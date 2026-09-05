/**
 * 三个新工具 spike：图片格式转换 / ZIP 解压 / 字体 WOFF2 压缩
 * 运行: node scripts/spike/run-3tools-spike.cjs（需先 npm run build）
 * 子路径验证: 设置 SPIKE_BASE=/filepomelo 模拟 GitHub Pages 前缀
 */
const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");
const { zip } = require("fflate");

const ROOT = path.join(__dirname, "..", "..");
const OUT = path.join(ROOT, "out");
const PORT = 4187;
// 子路径部署验证：SPIKE_BASE=/filepomelo 时模拟 GitHub Pages 前缀
const BASE = process.env.SPIKE_BASE || "";
// CI 里无系统 Chrome：SPIKE_CHANNEL=chromium 使用 Playwright 自带浏览器
const CHANNEL = process.env.SPIKE_CHANNEL === "chromium" ? undefined : "chrome";

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".wasm": "application/wasm",
};

function serve() {
  const server = http.createServer((req, res) => {
    let p = decodeURIComponent((req.url || "/").split("?")[0]);
    if (BASE && p.startsWith(BASE)) p = p.slice(BASE.length);
    if (p.endsWith("/")) p += "index.html";
    let fp = path.normalize(path.join(OUT, p));
    if (!fp.startsWith(OUT)) { res.writeHead(403); res.end(); return; }
    if (!fs.existsSync(fp) || fs.statSync(fp).isDirectory()) {
      res.writeHead(404); res.end("not found"); return;
    }
    res.writeHead(200, { "Content-Type": MIME[path.extname(fp).toLowerCase()] || "application/octet-stream" });
    fs.createReadStream(fp).pipe(res);
  });
  return new Promise((resolve) => server.listen(PORT, () => resolve(server)));
}

(async () => {
  // 生成测试 zip（两个文本文件）
  const zipPath = path.join(OUT, "spike-test.zip");
  await new Promise((resolve, reject) => {
    zip(
      {
        "hello.txt": new TextEncoder().encode("FilePomelo unzip test ".repeat(2000)),
        "docs/readme.md": new TextEncoder().encode("# FilePomelo\n\nUnzip spike. ".repeat(800)),
      },
      { level: 6 },
      (err, data) => (err ? reject(err) : (fs.writeFileSync(zipPath, Buffer.from(data)), resolve()))
    );
  });

  // 测试素材：png 优先项目内 fixtures（CI 可用的提交文件），ttf 探测常见路径
  const pngCandidates = [
    path.join(__dirname, "fixtures", "big1.png"),
    "D:/PDF/pdfbzy/e2e-fixtures/big1.png",
  ];
  const png = pngCandidates.find((p) => fs.existsSync(p));
  const ttfCandidates = [
    "C:/Windows/Fonts/arial.ttf",
    "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf", // ubuntu CI
  ];
  const ttf = ttfCandidates.find((p) => fs.existsSync(p));
  if (!png || !ttf) {
    console.error("缺少测试素材: png=", png, " ttf=", ttf);
    process.exit(2);
  }
  const ttfName = path.basename(ttf);

  const server = await serve();
  let browser;
  const results = [];
  try {
    browser = await chromium.launch({ channel: CHANNEL, headless: true });
    const ctx = await browser.newContext({ acceptDownloads: true });
    const page = await ctx.newPage();
    page.on("pageerror", (e) => console.log("  [pageerror]", e.message));

    // ---- 1. 图片格式转换 ----
    console.log("\n[1] 图片格式转换 JPG/PNG → WebP");
    await page.goto(`http://localhost:${PORT}${BASE}/zh/image-converter/`, { waitUntil: "networkidle", timeout: 30000 });
    await page.setInputFiles('input[type=file]:not([webkitdirectory])', png, { timeout: 60000 });
    await page.waitForFunction(() => document.body.innerText.includes("1 个文件"), { timeout: 15000 });
    await page.getByRole("button", { name: /全部转换/ }).click();
    await page.waitForFunction(() => document.body.innerText.includes("→ "), { timeout: 30000 });
    const imgText = await page.evaluate(() => document.body.innerText.replace(/\s+/g, " "));
    const imgPass = /big1\.png\s*[\d.]+\s*KB\s*→\s*[\d.]+\s*KB/.test(imgText);
    const imgMatch = imgText.match(/big1\.png\s*([\d.]+\s*KB\s*→\s*[\d.]+\s*KB)/);
    console.log(imgPass ? `  ✅ 转换成功: ${imgMatch ? imgMatch[1] : ""}` : `  ❌ ${imgText.slice(0, 200)}`);
    results.push(["图片格式转换", imgPass]);

    // ---- 2. ZIP 解压 ----
    console.log("\n[2] ZIP 解压");
    await page.goto(`http://localhost:${PORT}${BASE}/zh/unzip/`, { waitUntil: "networkidle", timeout: 30000 });
    await page.setInputFiles('input[type=file]:not([webkitdirectory])', zipPath, { timeout: 60000 });
    await page.waitForFunction(() => document.body.innerText.includes("1 个压缩包"), { timeout: 15000 });
    await page.getByRole("button", { name: /开始解压/ }).click();
    await page.waitForFunction(() => document.body.innerText.includes("全部下载"), { timeout: 30000 });
    const unzipInfo = await page.evaluate(() => {
      const t = document.body.innerText;
      const m = t.match(/(\d+) 个文件/);
      return m ? m[1] : "?";
    });
    const unzipPass = Number(unzipInfo) >= 2;
    console.log(unzipPass ? `  ✅ 解压出 ${unzipInfo} 个文件` : `  ❌ 解压文件数=${unzipInfo}`);
    results.push(["ZIP 解压", unzipPass]);

    // ---- 3. 字体 WOFF2 压缩 ----
    console.log("\n[3] 字体 TTF → WOFF2");
    await page.goto(`http://localhost:${PORT}${BASE}/zh/font-compressor/`, { waitUntil: "networkidle", timeout: 30000 });
    await page.setInputFiles('input[type=file]:not([webkitdirectory])', ttf, { timeout: 60000 });
    await page.waitForFunction(() => document.body.innerText.includes("1 个字体"), { timeout: 15000 });
    await page.getByRole("button", { name: /转换为 WOFF2/ }).click();
    await page.waitForFunction(() => document.body.innerText.includes("→ "), { timeout: 60000 });
    const fontText = await page.evaluate(() => document.body.innerText.replace(/\s+/g, " "));
    const fontMatch = fontText.match(new RegExp(`${ttfName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}\\s*[\\d.]+\\s*KB\\s*→\\s*[\\d.]+\\s*KB\\s*\\(−?\\d+%\\)`));
    const fontPass = !!fontMatch;
    console.log(fontPass ? `  ✅ 压缩成功: ${fontMatch[0]}` : `  ❌ ${fontText.slice(0, 220)}`);
    results.push(["字体 WOFF2 压缩", fontPass]);
  } catch (e) {
    console.error("spike 执行失败:", e);
  } finally {
    if (browser) await browser.close();
    server.close();
    fs.rmSync(zipPath, { force: true });
  }

  const allPass = results.every(([, ok]) => ok);
  console.log("\n=== 结果 ===");
  results.forEach(([name, ok]) => console.log(`${ok ? "✅" : "❌"} ${name}`));
  console.log(allPass ? "✅ 三个新工具 spike 全部通过" : "❌ 存在失败项");
  process.exitCode = allPass ? 0 : 1;
})();
