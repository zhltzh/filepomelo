/**
 * GIF 参数扫描：确认 gifsicle-wasm-browser 对真实 GIF 的压缩参数。
 * 复制 gifsicle.min.js 到 out/vendor/，在浏览器里跑多组命令对比。
 * 运行: node scripts/spike/run-gif-scan.cjs
 */
const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const OUT = path.join(ROOT, "out");
const PORT = 4178;

function serve() {
  const MIME = { ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8", ".wasm": "application/wasm" };
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent((req.url || "/").split("?")[0]);
    if (p === "/") {
      res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
      res.end("<!DOCTYPE html><html><body></body></html>");
      return;
    }
    let fp = path.normalize(path.join(OUT, p));
    if (!fp.startsWith(OUT)) { res.writeHead(403); res.end(); return; }
    if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
      res.writeHead(404); res.end(); return;
    }
    const ext = path.extname(fp).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    fs.createReadStream(fp).pipe(res);
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

(async () => {
  const vendorDir = path.join(OUT, "vendor");
  fs.mkdirSync(vendorDir, { recursive: true });
  fs.copyFileSync(
    path.join(ROOT, "node_modules", "gifsicle-wasm-browser", "dist", "gifsicle.min.js"),
    path.join(vendorDir, "gifsicle.min.js")
  );
  const assetsDir = path.join(OUT, "spike-assets");
  fs.mkdirSync(assetsDir, { recursive: true });
  const r = await fetch("https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif");
  fs.writeFileSync(path.join(assetsDir, "giphy.gif"), Buffer.from(await r.arrayBuffer()));
  const srcSize = fs.statSync(path.join(assetsDir, "giphy.gif")).size;
  console.log("源 GIF:", (srcSize / 1024).toFixed(0) + "KB\n");

  const server = await serve();
  let browser;
  try {
    browser = await chromium.launch({ channel: "chrome", headless: true });
    const page = await browser.newPage();
    await page.goto(`http://localhost:${PORT}/`, { waitUntil: "load" });

    const cmds = [
      "-O2 --lossy=60 --colors=256",
      "-O2 --lossy=80 --colors=128",
      "-O3 --lossy=120 --colors=64",
      "-O2 --colors=128",
      "-O1",
      "-O2",
    ];

    const results = await page.evaluate(
      async ({ base, cmds, srcSize }) => {
        const mod = await import(base + "/vendor/gifsicle.min.js");
        const g = mod.default ?? mod;
        const gifResp = await fetch(base + "/spike-assets/giphy.gif");
        const gifBlob = await gifResp.blob();
        const out = [];
        for (const c of cmds) {
          try {
            const files = await g.run({
              input: [{ file: gifBlob, name: "input.gif" }],
              command: [`${c} input.gif -o /out/out.gif`],
            });
            const f = files[0];
            out.push({ cmd: c, size: f ? f.size : -1 });
          } catch (e) {
            out.push({ cmd: c, size: -1, err: String(e) });
          }
        }
        return out;
      },
      { base: `http://localhost:${PORT}`, cmds, srcSize }
    );

    console.log("命令                                         输出大小     压缩率");
    for (const r of results) {
      const pct = r.size > 0 ? ((1 - r.size / srcSize) * 100).toFixed(1) : "-";
      console.log(`${r.cmd.padEnd(40)} ${((r.size) / 1024).toFixed(0).padStart(6)}KB   ${pct}%${r.err ? "  ERR:" + r.err : ""}`);
    }
  } catch (e) {
    console.error("scan 失败:", e);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
    fs.rmSync(path.join(OUT, "spike-assets"), { recursive: true, force: true });
    fs.rmSync(vendorDir, { recursive: true, force: true });
  }
})();
