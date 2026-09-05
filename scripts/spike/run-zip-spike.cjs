/** ZIP 工具 spike：注入可压缩文本文件 → 打包 → 验证压缩生效 */
const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const OUT = path.join(ROOT, "out");
const PORT = 4183;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".wasm": "application/wasm",
};

function serve() {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent((req.url || "/").split("?")[0]);
    if (p.endsWith("/")) p += "index.html";
    let fp = path.normalize(path.join(OUT, p));
    if (!fp.startsWith(OUT)) { res.writeHead(403); res.end(); return; }
    if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
      res.writeHead(404); res.end("not found"); return;
    }
    const ext = path.extname(fp).toLowerCase();
    res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
    fs.createReadStream(fp).pipe(res);
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

(async () => {
  const assetsDir = path.join(OUT, "spike-assets");
  fs.mkdirSync(assetsDir, { recursive: true });
  // 两个高可压缩文本文件
  const t1 = path.join(assetsDir, "report.txt");
  const t2 = path.join(assetsDir, "notes.txt");
  fs.writeFileSync(t1, ("FilePomelo 本地压缩测试数据。".repeat(6000)));
  fs.writeFileSync(t2, ("Hello FilePomelo zip compression! ".repeat(4000)));
  const total = fs.statSync(t1).size + fs.statSync(t2).size;
  const server = await serve();
  let browser;
  try {
    browser = await chromium.launch({ channel: "chrome", headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on("pageerror", (e) => console.log("  [pageerror]", e.message));
    await page.goto(`http://localhost:${PORT}/zh/zip-compressor/`, { waitUntil: "networkidle", timeout: 30000 });

    await page.setInputFiles('input[type="file"]:not([webkitdirectory])', [t1, t2], { timeout: 60000 });
    await page.waitForFunction(() => document.body.textContent.includes("2 个文件"), { timeout: 15000 });

    await page.getByRole("button", { name: /打包压缩/ }).click();
    // 等待结果区稳定（"下载 ZIP" / "Download ZIP" 按钮出现）
    await page.waitForFunction(
      () =>
        document.body.textContent.includes("下载 ZIP") ||
        document.body.textContent.includes("Download ZIP"),
      { timeout: 30000 }
    );
    await page.waitForTimeout(300);

    const text = await page.evaluate(() => document.body.textContent.replace(/\s+/g, " "));
    const sizeMatch = text.match(/→\s*([\d.]+)\s*KB/);
    const outKB = sizeMatch ? parseFloat(sizeMatch[1]) : NaN;
    const pass = !isNaN(outKB) && outKB * 1024 < total;
    console.log(`原大小 ${(total/1024).toFixed(1)}KB → ZIP ${isNaN(outKB) ? "?" : outKB}KB`);
    console.log(pass ? "✅ ZIP spike 通过（打包压缩生效）" : "❌ ZIP spike 未通过");
    process.exitCode = pass ? 0 : 1;
  } catch (e) {
    console.error("spike 执行失败:", e);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
    fs.rmSync(assetsDir, { recursive: true, force: true });
  }
})();
