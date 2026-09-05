/**
 * P3 引擎 spike：在首页（混合类别）验证 ghostscript/gifsicle/avif 三个真实引擎。
 * 素材：big-image.pdf（PDF）、giphy.gif（GIF，2.8MB）、test.avif（Chrome 生成）。
 *
 * 前置：npm run build（out/ 含 vendor/ 与 ghostscript-worker.mjs）
 * 运行: node scripts/spike/run-p3-spike.cjs
 */
const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const OUT = path.join(ROOT, "out");
const PORT = 4177;

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".wasm": "application/wasm",
  ".pdf": "application/pdf",
  ".gif": "image/gif",
  ".avif": "image/avif",
  ".png": "image/png",
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

async function download(url, dest) {
  const r = await fetch(url);
  if (!r.ok) throw new Error("download failed: " + url + " -> " + r.status);
  fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
}

(async () => {
  const assetsDir = path.join(OUT, "spike-assets");
  fs.mkdirSync(assetsDir, { recursive: true });
  // 素材：PDF（pdfbzy）+ GIF（下载）
  fs.copyFileSync(path.join(ROOT, "..", "pdfbzy", "e2e-fixtures", "big-image.pdf"), path.join(assetsDir, "big-image.pdf"));
  await download("https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif", path.join(assetsDir, "giphy.gif"));
  console.log(`✓ GIF 素材: ${(fs.statSync(path.join(assetsDir, "giphy.gif")).size / 1024).toFixed(0)}KB`);
  fs.copyFileSync(path.join(ROOT, "..", "pdfbzy", "e2e-fixtures", "big1.png"), path.join(assetsDir, "big1.png"));

  const server = await serve();
  let browser;
  try {
    browser = await chromium.launch({ channel: "chrome", headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on("pageerror", (e) => console.log("  [pageerror]", e.message));

    const base = `http://localhost:${PORT}`;

    // 1) 生成 AVIF 测试素材（Chrome canvas.toBlob）
    await page.goto(`${base}/zh/`, { waitUntil: "networkidle", timeout: 30000 });
    const avifB64 = await page.evaluate(async () => {
      const r = await fetch("/spike-assets/big1.png").catch(() => null);
      if (!r) return null;
      const buf = await r.arrayBuffer();
      const bmp = await createImageBitmap(new Blob([buf], { type: "image/png" }));
      const c = new OffscreenCanvas(bmp.width, bmp.height);
      c.getContext("2d").drawImage(bmp, 0, 0);
      const blob = await c.convertToBlob({ type: "image/avif", quality: 0.8 }).catch(() => null);
      if (!blob) return null;
      const bytes = new Uint8Array(await blob.arrayBuffer());
      let s = "";
      for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
      return btoa(s);
    });
    if (avifB64) {
      fs.writeFileSync(path.join(assetsDir, "test.avif"), Buffer.from(avifB64, "base64"));
      console.log(`✓ AVIF 素材生成: ${(fs.statSync(path.join(assetsDir, "test.avif")).size / 1024).toFixed(1)}KB`);
    } else {
      console.log("⚠ Chrome 不支持 avif 编码，AVIF 引擎跳过输入（保留单测到 P4 回归）");
    }

    // 2) 注入三个文件到首页混合队列
    const files = [path.join(assetsDir, "big-image.pdf"), path.join(assetsDir, "giphy.gif")];
    if (avifB64) files.push(path.join(assetsDir, "test.avif"));
    await page.setInputFiles('input[type="file"]:not([webkitdirectory])', files);
    await page.waitForFunction(
      (count) => document.querySelectorAll(".divide-y > div").length >= count,
      files.length,
      { timeout: 15000 }
    );
    console.log(`✓ 已注入 ${files.length} 个文件（PDF/GIF${avifB64 ? "/AVIF" : ""}）`);

    await page.getByRole("button", { name: /开始压缩/ }).click();
    console.log("✓ 已点击开始压缩，等待 Ghostscript/Gifsicle/AVIF 引擎...");

    await page.waitForFunction(
      () => {
        const rows = document.querySelectorAll(".divide-y > div");
        if (rows.length < 1) return false;
        return document.querySelectorAll(".divide-y > div .h-1.w-full").length === 0;
      },
      { timeout: 240000 }
    );

    const results = await page.evaluate(() => {
      return Array.from(document.querySelectorAll(".divide-y > div"))
        .map((row) => row.textContent.replace(/\s+/g, " ").trim());
    });
    console.log("\n===== P3 任务结果 =====");
    for (const r of results) console.log("  " + r);

    const allDone = results.length > 0 && results.every((r) => r.includes("下载"));
    // 校验：PDF 应显著压缩；GIF 应压缩或回退；AVIF 同理
    const pdfRow = results.find((r) => r.includes("big-image.pdf"));
    const gifRow = results.find((r) => r.includes("giphy.gif"));
    const pdfOk = pdfRow ? /−\d+%/.test(pdfRow) : false;
    const gifOk = gifRow ? true : false;
    const pass = allDone && pdfOk && gifOk;
    console.log(`\n${pass ? "✅ P3 spike 通过（PDF 压缩生效 + 全部任务完成）" : "❌ P3 spike 未全部通过"}`);

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
