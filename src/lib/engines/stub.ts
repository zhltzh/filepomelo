import type { EngineKey } from "@/config/tools";
import { registerEngine, type EngineHandler } from "@/lib/engine-registry";

/**
 * 桩引擎：P1 打通"上传→分发→进度→结果→zip"管线用。
 * 输出为原文件副本（不做真实压缩），P2 起被真实引擎覆盖。
 */
function makeStub(key: EngineKey): EngineHandler {
  return {
    key,
    async compress(file, _options, onProgress) {
      // 模拟分阶段进度，让 UI 有真实流转感
      for (let i = 0; i <= 100; i += 20) {
        onProgress(Math.min(i, 100));
        await new Promise((r) => setTimeout(r, 50));
      }
      // 桩：原样返回（真实压缩在 P2+ 接入）
      return { blob: file, size: file.size, real: false };
    },
  };
}

const STUB_KEYS: EngineKey[] = [
  "mozjpeg",
  "png",
  "webp",
  "avif",
  "svgo",
  "gifsicle",
  "ghostscript",
  "pdf-struct",
  "webcodecs",
  "ffmpeg",
];

for (const key of STUB_KEYS) {
  registerEngine(key, () => Promise.resolve(makeStub(key)));
}
