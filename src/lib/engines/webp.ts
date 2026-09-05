import type { EngineHandler } from "@/lib/engine-registry";
import { decodeToImageData } from "./image-common";
import { asset } from "@/lib/base-path";

/**
 * WebP 引擎：WebP 有损重压缩（libwebp，Squoosh 官方 codec）。
 * 自动 SIMD 检测：支持则加载 webp_enc_simd.wasm，否则 webp_enc.wasm。
 * wasm 从 /vendor/jsquash/webp/ 加载。
 */
let initPromise: Promise<void> | null = null;
function ensureInit(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      const mod = await import("@jsquash/webp/encode");
      // init 支持单参数 options（含 locateFile 重定向 wasm 路径）
      await mod.init({
        locateFile: (p: string) => asset(`/vendor/jsquash/webp/${p}`),
      });
    })();
  }
  return initPromise;
}

export function createWebpEngine(): EngineHandler {
  return {
    key: "webp",
    async compress(file, options, onProgress) {
      onProgress(15);
      await ensureInit();
      onProgress(30);
      const imageData = await decodeToImageData(file);
      onProgress(55);
      const mod = await import("@jsquash/webp/encode");
      const buffer = await mod.default(imageData, {
        quality: options.quality,
      });
      onProgress(85);
      const blob = new Blob([buffer], { type: "image/webp" });
      return { blob, size: blob.size, real: true };
    },
  };
}
