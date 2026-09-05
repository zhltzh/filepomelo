/**
 * P5c spike：验证目标尺寸模式（首页）。
 * 素材：big-image.pdf（251.2KB）。填目标 50KB → 二分搜索 quality，
 * 期望输出 ≤ 50KB（51200B）且任务行显示绿色"≤ 50KB"达标徽标。
 * 前置：npm run build（out/ 含全部 vendor）
 * 运行: node scripts/spike/run-p5c-spike.cjs
 */
const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const OUT = path.join(ROOT, "out");
const PORT = 4182;
const SRC_PDF = "D:\\PDF\\pdfbzy\\e2e-fixtures\\big-image.pdf";
const TARGET_KB = 50;

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

    // 填目标尺寸 50KB
    const targetInput = page.locator('input[type="number"]');
    await targetInput.fill(String(TARGET_KB));
    console.log(`✓ 已注入 big-image.pdf（${(origSize / 1024).toFixed(1)}KB），目标大小=${TARGET_KB}KB`);

    await page.getByRole("button", { name: /开始压缩/ }).click();
    console.log("✓ 已点击开始压缩，等待目标尺寸二分搜索...");

    await page.waitForFunction(
      () => document.querySelectorAll(".divide-y > div .h-1.w-full").length === 0,
      { timeout: 240000 }
    );

    const results = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".divide-y > div"))
        .map((row) => row.textContent.replace(/\s+/g, " ").trim())
    );
    console.log("\n===== P5c 任务结果 =====");
    for (const r of results) console.log("  " + r);

    const row = results.find((r) => r.includes("big-image.pdf")) || "";
    // 从"→ xx.x KB"解析输出体积
    const sizeMatch = row.match(/→\s*([\d.]+)\s*KB/);
    const outKB = sizeMatch ? parseFloat(sizeMatch[1]) : NaN;
    const pass =
      row.includes("下载") &&
      row.includes("结构压缩") &&
      !isNaN(outKB) &&
      outKB <= TARGET_KB && // 达标：≤ 目标
      row.includes(`≤ ${TARGET_KB}KB`); // 显示绿色达标徽标
    console.log(
      `\n${pass
        ? `✅ P5c spike 通过（目标 ${TARGET_KB}KB，实际 ${outKB.toFixed(1)}KB，达标徽标已显示）`
        : `❌ P5c spike 未通过（done=${row.includes("下载")} out=${outKB}KB 达标徽标=${row.includes(`≤ ${TARGET_KB}KB`)}）`}`
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
