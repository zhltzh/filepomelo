/**
 * P4 引擎 spike：验证 WebCodecs + mediabunny 视频压缩引擎（首页混合队列）。
 *
 * 素材：页面内用 ffmpeg-core 生成"高码率 + 噪声"测试 mp4
 *       （testsrc + noise 破坏可压缩性，使 x264 真正吃满 8Mbps，≈2MB），
 *       再注入首页走真实链路压缩，验证输出显著变小。
 *
 * 前置：npm run build（out/ 含 vendor/ffmpeg）
 * 运行: node scripts/spike/run-p4-spike.cjs
 */
const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const OUT = path.join(ROOT, "out");
const PORT = 4179;

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
  const server = await serve();
  let browser;
  try {
    browser = await chromium.launch({ channel: "chrome", headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    page.on("pageerror", (e) => console.log("  [pageerror]", e.message));

    const base = `http://localhost:${PORT}`;
    await page.goto(`${base}/zh/`, { waitUntil: "networkidle", timeout: 30000 });

    // 1) 页面内用 ffmpeg-core 生成高码率噪声测试 mp4 + 高码率噪声 ogg（阻塞主线程，完成后写回）
    const gen = await page.evaluate(async () => {
      const mod = await import("/vendor/ffmpeg/core/ffmpeg-core.js");
      const createCore = mod.default;
      const coreURL = "/vendor/ffmpeg/core/ffmpeg-core.js";
      const wasmURL = "/vendor/ffmpeg/core/ffmpeg-core.wasm";
      const workerURL = "/vendor/ffmpeg/core/ffmpeg-core.worker.js";
      const ff = await createCore({
        mainScriptUrlOrBlob: coreURL + "#" + btoa(JSON.stringify({ wasmURL, workerURL })),
      });
      const errs = [];
      ff.setLogger((type, msg) => { if (type === "error") errs.push(msg); }); ff.setProgress(() => {});
      const toB64 = (name) => {
        const out = ff.FS.readFile(name);
        let s = "";
        for (let i = 0; i < out.length; i++) s += String.fromCharCode(out[i]);
        return btoa(s);
      };
      // 视频：testsrc + noise 使 x264 真正吃满 8Mbps
      ff.exec(
        "-f", "lavfi", "-i", "testsrc=duration=2:size=640x360:rate=30",
        "-vf", "noise=alls=40:allf=t",
        "-c:v", "libx264", "-preset", "ultrafast", "-b:v", "8000k", "-y", "in.mp4"
      );
      const retV = ff.ret;
      const mp4b64 = retV === 0 ? toB64("in.mp4") : null;
      ff.reset();
      // 音频：anoisesrc 噪声（不可压缩）→ 内置 aac 编码器 320k 真正占满码率
      ff.exec(
        "-f", "lavfi", "-i", "anoisesrc=duration=3:amplitude=0.8",
        "-c:a", "aac", "-b:a", "320k", "-y", "in.aac"
      );
      const retA = ff.ret;
      const aacb64 = retA === 0 ? toB64("in.aac") : null;
      ff.reset();
      return { retV, retA, mp4b64, aacb64, errs };
    });
    if (!gen.mp4b64) throw new Error(`ffmpeg 生成测试视频失败 ret=${gen.retV}\n${(gen.errs || []).join("\n")}`);
    if (!gen.aacb64) throw new Error(`ffmpeg 生成测试音频失败 ret=${gen.retA}\n${(gen.errs || []).join("\n")}`);
    fs.writeFileSync(path.join(assetsDir, "test.mp4"), Buffer.from(gen.mp4b64, "base64"));
    fs.writeFileSync(path.join(assetsDir, "test.aac"), Buffer.from(gen.aacb64, "base64"));
    const srcSize = fs.statSync(path.join(assetsDir, "test.mp4")).size;
    const srcSizeA = fs.statSync(path.join(assetsDir, "test.aac")).size;
    console.log(`✓ 已生成噪声测试视频: ${(srcSize / 1024).toFixed(0)}KB、噪声测试音频: ${(srcSizeA / 1024).toFixed(0)}KB`);

    // 2) 注入首页混合队列（P3 已验证此路径），切"最大压缩"档
    await page.setInputFiles(
      'input[type="file"]:not([webkitdirectory])',
      [path.join(assetsDir, "test.mp4"), path.join(assetsDir, "test.aac")],
      { timeout: 60000 }
    );
    await page.waitForFunction(
      (count) => document.querySelectorAll(".divide-y > div").length >= count,
      2,
      { timeout: 15000 }
    );
    console.log("✓ 已注入 test.mp4 + test.aac，切换档位为最大压缩");
    const maxBtn = page.getByRole("button", { name: /最大压缩/ });
    if (await maxBtn.count()) await maxBtn.click();

    await page.getByRole("button", { name: /开始压缩/ }).click();
    console.log("✓ 已点击开始压缩，等待 WebCodecs 引擎...");

    await page.waitForFunction(
      () => {
        const rows = document.querySelectorAll(".divide-y > div");
        if (rows.length < 1) return false;
        return document.querySelectorAll(".divide-y > div .h-1.w-full").length === 0;
      },
      { timeout: 180000 }
    );

    const results = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".divide-y > div"))
        .map((row) => row.textContent.replace(/\s+/g, " ").trim())
    );
    console.log("\n===== P4 任务结果 =====");
    for (const r of results) console.log("  " + r);

    const okRow = (name) => {
      const row = results.find((r) => r.includes(name)) || "";
      return { done: row.includes("下载"), webcodecs: row.includes("WebCodecs"), shrunk: /−\d+%/.test(row) };
    };
    const v = okRow("test.mp4");
    const a = okRow("test.aac");
    const pass = v.done && v.webcodecs && v.shrunk && a.done && a.webcodecs && a.shrunk;
    console.log(
      `\n${pass ? "✅ P4 spike 通过（WebCodecs 视频/音频压缩均生效）" :
        "❌ P4 spike 未通过（video done=" + v.done + " wc=" + v.webcodecs + " shrink=" + v.shrunk +
        " | audio done=" + a.done + " wc=" + a.webcodecs + " shrink=" + a.shrunk + "）"}`
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
