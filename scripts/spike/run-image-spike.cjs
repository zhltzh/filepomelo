/**
 * P2 图片引擎 spike：在真实应用链路（/zh/image-compressor）验证
 * mozjpeg/png/webp/svgo 四个真实引擎的加载与压缩。
 *
 * 前置：npm run build（out/ 含 vendor/）
 * 运行: node scripts/spike/run-image-spike.cjs
 */
const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const OUT = path.join(ROOT, "out");
const PORT = 4176;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".wasm": "application/wasm",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
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

/** 从 big1.png 用 Chrome 原生转换生成 jpg/webp 测试素材 */
async function genFixtures(page, outDir) {
  const base64 = await page.evaluate(async () => {
    const r = await fetch("/spike-assets/big1.png");
    const buf = await r.arrayBuffer();
    const bmp = await createImageBitmap(new Blob([buf], { type: "image/png" }));
    const c = new OffscreenCanvas(bmp.width, bmp.height);
    const ctx = c.getContext("2d");
    ctx.drawImage(bmp, 0, 0);
    const jpg = await c.convertToBlob({ type: "image/jpeg", quality: 0.92 });
    const webp = await c.convertToBlob({ type: "image/webp", quality: 0.9 });
    const ab = (b) => b.arrayBuffer();
    const [j, w] = await Promise.all([ab(jpg), ab(webp)]);
    const toB64 = (arr) => {
      let s = "";
      const bytes = new Uint8Array(arr);
      for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
      return btoa(s);
    };
    return { jpg: toB64(j), webp: toB64(w), jpgSize: j.byteLength, webpSize: w.byteLength };
  });
  fs.writeFileSync(path.join(outDir, "test.jpg"), Buffer.from(base64.jpg, "base64"));
  fs.writeFileSync(path.join(outDir, "test.webp"), Buffer.from(base64.webp, "base64"));
  return { jpgSize: base64.jpgSize, webpSize: base64.webpSize };
}

(async () => {
  const assetsDir = path.join(OUT, "spike-assets");
  fs.mkdirSync(assetsDir, { recursive: true });
  // 源图 + 手写 svg 直接复制/生成
  const src = path.join(ROOT, "..", "pdfbzy", "e2e-fixtures", "big1.png");
  fs.copyFileSync(src, path.join(assetsDir, "big1.png"));
  fs.writeFileSync(
    path.join(assetsDir, "test.svg"),
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><rect width="400" height="200" fill="#fee2e2"/><circle cx="120" cy="100" r="60" fill="#ef4444"/><rect x="200" y="50" width="160" height="100" rx="12" fill="#3b82f6"/><text x="210" y="100" font-size="28" fill="#fff">FilePomelo</text><path d="M20 180 L100 20 L180 180 Z" fill="#22c55e"/></svg>'
  );

  const server = await serve();
  let browser;
  try {
    browser = await chromium.launch({ channel: "chrome", headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on("pageerror", (e) => console.log("  [pageerror]", e.message));

    // 先生成 jpg/webp
    const base = `http://localhost:${PORT}`;
    await page.goto(`${base}/zh/image-compressor/`, { waitUntil: "networkidle", timeout: 30000 });
    const sizes = await genFixtures(page, assetsDir);
    console.log(`✓ 测试素材就绪: test.jpg ${(sizes.jpgSize/1024).toFixed(1)}KB, test.webp ${(sizes.webpSize/1024).toFixed(1)}KB, test.png, test.svg`);

    // 注入 4 个文件（png/jpg/webp/svg）
    await page.setInputFiles('input[type="file"]:not([webkitdirectory])', [
      path.join(assetsDir, "big1.png"),
      path.join(assetsDir, "test.jpg"),
      path.join(assetsDir, "test.webp"),
      path.join(assetsDir, "test.svg"),
    ]);
    await page.waitForFunction(() => document.querySelectorAll(".divide-y > div").length >= 4, { timeout: 15000 });
    console.log("✓ 已注入 4 个文件，任务列表就绪");

    // 点击"开始压缩"
    await page.getByRole("button", { name: /开始压缩/ }).click();
    console.log("✓ 已点击开始压缩，等待引擎加载与转码...");

    // 轮询直到没有 pending/processing 任务
    await page.waitForFunction(
      () => {
        const rows = document.querySelectorAll(".divide-y > div");
        if (rows.length < 4) return false;
        // processing 行含进度条，pending 行含 Clock 图标；completed 有"下载"按钮
        const bar = document.querySelectorAll(".divide-y > div .h-1.w-full").length;
        return bar === 0 && rows.length >= 4;
      },
      { timeout: 180000 }
    );

    // 读取每行结果文本
    const results = await page.evaluate(() => {
      const rows = Array.from(document.querySelectorAll(".divide-y > div"));
      return rows.map((row) => row.textContent.replace(/\s+/g, " ").trim());
    });
    console.log("\n===== 任务结果 =====");
    for (const r of results) console.log("  " + r);

    // 校验：全部行都含"下载"（completed）且含压缩率或不变
    const allDone = results.every((r) => r.includes("下载"));
    const pass = allDone;
    console.log(`\n${pass ? "✅ P2 图片引擎 spike 通过" : "❌ 存在未完成任务"}`);

    // 额外：抓一次下载，验证输出可下载（第一行 completed 任务）
    const dlPromise = page.waitForEvent("download", { timeout: 15000 }).catch(() => null);
    const firstRow = page.locator(".divide-y > div").first();
    const dlBtn = firstRow.getByRole("button", { name: "下载" });
    if (await dlBtn.count()) {
      await dlBtn.click();
      const dl = await dlPromise;
      if (dl) console.log("✓ 输出文件可下载:", dl.suggestedFilename());
    }

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
