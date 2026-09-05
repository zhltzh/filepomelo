/**
 * P5 spike：验证 FFmpeg 兜底引擎（首页混合队列）。
 * 素材：页面内用 ffmpeg-core 生成 高码率噪声 mp3（音频兜底）+ 高码率噪声 flv（视频兜底），
 *       注入首页走真实链路，验证输出显著变小。
 *
 * 前置：npm run build（out/ 含 vendor/ffmpeg 与 ffmpeg-worker.mjs）
 * 运行: node scripts/spike/run-p5-spike.cjs
 */
const { chromium } = require("playwright");
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "..");
const OUT = path.join(ROOT, "out");
const PORT = 4180;

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

    // 1) 生成噪声 mp3 + 噪声 flv
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
      // 音频：噪声 → mp3 320k 真正占满
      ff.exec(
        "-f", "lavfi", "-i", "anoisesrc=duration=3:amplitude=0.8",
        "-c:a", "mp3", "-b:a", "320k", "-y", "in.mp3"
      );
      const retA = ff.ret;
      const mp3b64 = retA === 0 ? toB64("in.mp3") : null;
      ff.reset();
      // 视频：testsrc + noise → flv1 编码（WebCodecs 不支持的容器）
      ff.exec(
        "-f", "lavfi", "-i", "testsrc=duration=2:size=640x360:rate=30",
        "-vf", "noise=alls=40:allf=t", "-c:v", "flv", "-y", "in.flv"
      );
      const retV = ff.ret;
      const flvb64 = retV === 0 ? toB64("in.flv") : null;
      ff.reset();
      return { retA, retV, mp3b64, flvb64, errs };
    });
    if (!gen.mp3b64) throw new Error(`ffmpeg 生成测试音频失败 ret=${gen.retA}\n${(gen.errs || []).join("\n")}`);
    if (!gen.flvb64) throw new Error(`ffmpeg 生成测试视频失败 ret=${gen.retV}\n${(gen.errs || []).join("\n")}`);
    fs.writeFileSync(path.join(assetsDir, "test.mp3"), Buffer.from(gen.mp3b64, "base64"));
    fs.writeFileSync(path.join(assetsDir, "test.flv"), Buffer.from(gen.flvb64, "base64"));
    const szA = fs.statSync(path.join(assetsDir, "test.mp3")).size;
    const szV = fs.statSync(path.join(assetsDir, "test.flv")).size;
    console.log(`✓ 已生成噪声 mp3: ${(szA / 1024).toFixed(0)}KB、噪声 flv: ${(szV / 1024).toFixed(0)}KB`);

    // 2) 注入首页混合队列，切"最大压缩"
    await page.setInputFiles(
      'input[type="file"]:not([webkitdirectory])',
      [path.join(assetsDir, "test.mp3"), path.join(assetsDir, "test.flv")],
      { timeout: 60000 }
    );
    await page.waitForFunction(
      (count) => document.querySelectorAll(".divide-y > div").length >= count,
      2,
      { timeout: 15000 }
    );
    console.log("✓ 已注入 test.mp3 + test.flv，切换档位为最大压缩");
    const maxBtn = page.getByRole("button", { name: /最大压缩/ });
    if (await maxBtn.count()) await maxBtn.click();

    await page.getByRole("button", { name: /开始压缩/ }).click();
    console.log("✓ 已点击开始压缩，等待 FFmpeg 兜底引擎...");

    await page.waitForFunction(
      () => {
        const rows = document.querySelectorAll(".divide-y > div");
        if (rows.length < 1) return false;
        return document.querySelectorAll(".divide-y > div .h-1.w-full").length === 0;
      },
      { timeout: 240000 }
    );

    const results = await page.evaluate(() =>
      Array.from(document.querySelectorAll(".divide-y > div"))
        .map((row) => row.textContent.replace(/\s+/g, " ").trim())
    );
    console.log("\n===== P5a 任务结果 =====");
    for (const r of results) console.log("  " + r);

    const okRow = (name) => {
      const row = results.find((r) => r.includes(name)) || "";
      return { done: row.includes("下载"), ffmpeg: row.includes("FFmpeg"), shrunk: /−\d+%/.test(row) };
    };
    const a = okRow("test.mp3");
    const v = okRow("test.flv");
    const pass = a.done && a.ffmpeg && a.shrunk && v.done && v.ffmpeg && v.shrunk;
    console.log(
      `\n${pass ? "✅ P5a spike 通过（FFmpeg 兜底 音频/视频压缩均生效）" :
        "❌ P5a spike 未通过（mp3 done=" + a.done + " ff=" + a.ffmpeg + " shrink=" + a.shrunk +
        " | flv done=" + v.done + " ff=" + v.ffmpeg + " shrink=" + v.shrunk + "）"}`
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
