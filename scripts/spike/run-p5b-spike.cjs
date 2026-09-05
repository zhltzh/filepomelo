/**
 * P5b spike：验证 PDF 结构压缩引擎（首页）。
 * 素材：D:\PDF\pdfbzy\e2e-fixtures\big-image.pdf（251KB 图片型 PDF）
 * 预期：走"结构压缩"标签路径（pdf-struct，非 Ghostscript），且比 gs −69% 更优或相当。
 * 前置：npm run build（out/ 含全部 vendor 与 pdf-lib 产物）
 * 运行: node scripts/spike/run-p5b-spike.cjs
 */
const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const OUT = path.join(ROOT, "out");
const PORT = 4181;
const SRC_PDF = "D:\\PDF\\pdfbzy\\e2e-fixtures\\big-image.pdf";

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
  if (!fs.existsSync(SRC_PDF)) throw new Error("找不到测试 PDF: " + SRC_PDF);
  const assetsDir = path.join(OUT, "spike-assets");
  fs.mkdirSync(assetsDir, { recursive: true });
  const localPdf = path.join(assetsDir, "big-image.pdf");
  fs.copyFileSync(SRC_PDF, localPdf);
  const origSize = fs.statSync(localPdf).size;
  const server = await serve();
  let browser;
  try {
    browser = await chromium.launch({ channel: "chrome", headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on("pageerror", (e) => console.log("  [pageerror]", e.message));

    const base = `http://localhost:${PORT}`;
    await page.goto(`${base}/zh/`, { waitUntil: "networkidle", timeout: 30000 });

    await page.setInputFiles('input[type="file"]:not([webkitdirectory])', [localPdf], { timeout: 60000 });
    await page.waitForFunction(
      (count) => document.querySelectorAll(".divide-y > div").length >= count,
      1,
      { timeout: 15000 }
    );
    console.log(`✓ 已注入 big-image.pdf（${(origSize / 1024).toFixed(1)}KB），切最大压缩`);
    const maxBtn = page.getByRole("button", { name: /最大压缩/ });
    if (await maxBtn.count()) await maxBtn.click();

    await page.getByRole("button", { name: /开始压缩/ }).click();
    console.log("✓ 已点击开始压缩，等待 PDF 结构压缩引擎...");

    await page.waitForFunction(
      () => document.querySelectorAll(".divide-y > div .h-1.w-full").length === 0,
      { timeout: 240000 }
    );

    const results = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".divide-y > div"))
        .map((row) => row.textContent.replace(/\s+/g, " ").trim())
    );
    console.log("\n===== P5b 任务结果 =====");
    for (const r of results) console.log("  " + r);

    const row = results.find((r) => r.includes("big-image.pdf")) || "";
    const match = row.match(/−(\d+)%/);
    const pct = match ? parseInt(match[1], 10) : 0;
    const pass =
      row.includes("下载") &&
      row.includes("结构压缩") &&
      pct > 50; // 结构压缩应显著优于/相当于 gs −69%
    console.log(
      `\n${pass
        ? `✅ P5b spike 通过（结构压缩 ${pct}%，且明确走了结构压缩路径，未回退 Ghostscript）`
        : `❌ P5b spike 未通过（done=${row.includes("下载")} tag=结构压缩:${row.includes("结构压缩")} pct=${pct}）`}`
    );
    process.exitCode = pass ? 0 : 1;
  } catch (e) {
    console.error("spike 执行失败:", e);
    process.exitCode = 1;
  } finally {
    if (browser) await browser.close();
    server.close();
    fs.rmSync(assetsDir, { recursive: true, force: true });
    console.log("已清理临时素材");
  }
})();
