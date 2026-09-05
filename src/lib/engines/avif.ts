import type { EngineHandler } from "@/lib/engine-registry";
import { decodeToImageData } from "./image-common";
import { asset } from "@/lib/base-path";

/**
 * AVIF 引擎：AVIF 有损重压缩（libavif，Squoosh 官方 codec）。
 * 自动线程检测：无 SharedArrayBuffer 的静态站环境自动用单线程 avif_enc.wasm。
 * wasm 从 /vendor/jsquash/avif/ 加载。
 */
let initPromise: Promise<void> | null = null;
function ensureInit(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      const mod = await import("@jsquash/avif/encode");
      await mod.init(undefined, {
        locateFile: (p: string) => asset(`/vendor/jsquash/avif/${p}`),
      });
    })();
  }
  return initPromise;
}

/** libavif cqLevel（0-63，值越小画质越高）由 quality 档位映射 */
function qualityToCqLevel(quality: number): number {
  // max=30→47, recommended=60→31, high=80→20
  return Math.max(8, Math.min(58, Math.round(63 - quality * 0.53)));
}

export function createAvifEngine(): EngineHandler {
  return {
    key: "avif",
    async compress(file, options, onProgress) {
      onProgress(15);
      await ensureInit();
      onProgress(30);
      const imageData = await decodeToImageData(file);
      onProgress(55);
      const mod = await import("@jsquash/avif/encode");
      const buffer = await mod.default(imageData, {
        cqLevel: qualityToCqLevel(options.quality),
        speed: 6,
      });
      onProgress(85);
      const blob = new Blob([buffer], { type: "image/avif" });
      return { blob, size: blob.size, real: true };
    },
  };
}
