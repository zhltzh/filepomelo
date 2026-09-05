/**
 * 引擎 Spike 验证驱动：用系统 Chrome + Playwright 打开 spike.html，
 * 真实加载 vendor wasm 引擎并执行压缩，验证静态托管下的可用性。
 *
 * 前置：已执行 npm run build（out/ 含 vendor/）且已复制 fixture。
 * 运行: node scripts/spike/run-spike.cjs
 */
const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const OUT = path.join(ROOT, "out");
const SPIKE_SRC = path.join(__dirname, "spike.html");
const PORT = 4175;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".wasm": "application/wasm",
  ".pdf": "application/pdf",
  ".json": "application/json",
};

async function prepare() {
  // 复制 spike 页与测试 PDF 到 out/
  fs.copyFileSync(SPIKE_SRC, path.join(OUT, "spike.html"));
  const assetsDir = path.join(OUT, "spike-assets");
  fs.mkdirSync(assetsDir, { recursive: true });
  const fixture = path.join(ROOT, "..", "pdfbzy", "e2e-fixtures", "big-image.pdf");
  fs.copyFileSync(fixture, path.join(assetsDir, "big-image.pdf"));
  console.log("✓ 已复制 spike.html 和 big-image.pdf 到 out/");
}

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

async function cleanup() {
  for (const f of ["spike.html", "spike-assets"]) {
    const p = path.join(OUT, f);
    if (fs.existsSync(p)) fs.rmSync(p, { recursive: true, force: true });
  }
}

(async () => {
  await prepare();
  const server = await serve();

  let browser;
  try {
    browser = await chromium.launch({ channel: "chrome", headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on("console", (m) => {
      if (m.text().includes("[spike]")) console.log("  " + m.text());
    });
    page.on("pageerror", (e) => console.log("  [pageerror]", e.message));

    const url = `http://localhost:${PORT}/spike.html`;
    console.log("\n打开 " + url + "\n");
    await page.goto(url, { waitUntil: "load", timeout: 60000 });

    await page.waitForFunction(() => window.__spike && window.__spike.done, { timeout: 180000 });

    const result = await page.evaluate(() => window.__spike);
    console.log("\n===== Spike 结果 =====");
    let pass = 0, fail = 0;
    for (const t of result.tests) {
      console.log(`${t.ok ? "PASS" : "FAIL"}  ${t.name}${t.detail ? "  | " + t.detail : ""}`);
      t.ok ? pass++ : fail++;
    }
    console.log(`\n通过 ${pass}/${result.tests.length}`);
    if (fail > 0) process.exitCode = 1;
  } catch (e) {
    console.error("spike 执行失败:", e);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
    await cleanup();
    console.log("已清理临时 spike 文件");
  }
})();
