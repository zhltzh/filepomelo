/**
 * FFmpeg 压缩 Web Worker（WebCodecs 兜底引擎）。
 * 独立于 React 打包链：位于 public/，ES Module Worker 动态 import vendor 的 ffmpeg-core，
 * 由 src/lib/engines/ffmpeg.ts 通过 new Worker("/ffmpeg-worker.mjs", {type:"module"}) 驱动。
 *
 * 用途：WebCodecs 无法处理的格式（浏览器无原生编解码器）走这里。
 * - 音频 mp3/wma → MP3 重编码（内置 mp3 编码器，降码率）
 * - 视频 flv/3gp/ogv → H.264 MP4 重编码（libx264 + AAC）
 * 单线程 core（免 COOP/COEP），exec 同步阻塞 → 必须放 Worker。
 */
let ffmpegPromise = null;
let currentId = null;

function getFfmpeg() {
  if (!ffmpegPromise) {
    ffmpegPromise = (async () => {
      // 相对 import.meta.url 解析 vendor 资源：worker 与 vendor 同在站点根，
      // 自动适配 GitHub Pages 子路径前缀（/filepomelo/）
      const coreURL = new URL("./vendor/ffmpeg/core/ffmpeg-core.js", import.meta.url).href;
      const wasmURL = new URL("./vendor/ffmpeg/core/ffmpeg-core.wasm", import.meta.url).href;
      const workerURL = new URL("./vendor/ffmpeg/core/ffmpeg-core.worker.js", import.meta.url).href;
      const mod = await import(coreURL);
      const createCore = mod.default;
      const ff = await createCore({
        mainScriptUrlOrBlob:
          coreURL + "#" + btoa(JSON.stringify({ wasmURL, workerURL })),
      });
      ff.setLogger(() => {});
      ff.setProgress((p) => {
        if (currentId && typeof p === "number") {
          self.postMessage({ id: currentId, type: "progress", progress: p });
        }
      });
      return ff;
    })();
  }
  return ffmpegPromise;
}

function audioBitrateKbps(q) {
  if (q <= 35) return 96;
  if (q <= 70) return 128;
  return 192;
}
function videoBitrateKbps(q) {
  if (q <= 35) return 2500;
  if (q <= 70) return 5000;
  return 8000;
}

self.onmessage = async (e) => {
  const { id, input, kind, quality } = e.data;
  currentId = id;
  try {
    const ff = await getFfmpeg();
    ff.FS.writeFile("input.bin", new Uint8Array(input));

    if (kind === "audio") {
      ff.exec(
        "-i", "input.bin",
        "-c:a", "mp3", "-b:a", String(audioBitrateKbps(quality)) + "k",
        "-y", "out.mp3"
      );
    } else {
      ff.exec(
        "-i", "input.bin",
        "-c:v", "libx264", "-preset", "veryfast", "-b:v", String(videoBitrateKbps(quality)) + "k",
        "-c:a", "aac", "-b:a", "128k", "-movflags", "+faststart",
        "-y", "out.mp4"
      );
    }
    const ret = ff.ret;
    const outName = kind === "audio" ? "out.mp3" : "out.mp4";
    const out = ff.FS.readFile(outName, { encoding: "binary" });
    // 先读回再清理/reset（reset 会重置 FS 与实例状态）
    if (ff.FS.analyzePath("input.bin").exists) ff.FS.unlink("input.bin");
    if (ff.FS.analyzePath(outName).exists) ff.FS.unlink(outName);
    ff.reset();

    if (ret !== 0 || !out || out.length === 0) {
      self.postMessage({ id, success: false, error: "ffmpeg 执行失败 ret=" + ret });
      return;
    }
    const mime = kind === "audio" ? "audio/mpeg" : "video/mp4";
    self.postMessage({ id, success: true, output: out.buffer, mime }, [out.buffer]);
  } catch (err) {
    self.postMessage({ id, success: false, error: String((err && err.message) || err) });
  } finally {
    currentId = null;
  }
};
