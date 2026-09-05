import type { EngineHandler } from "@/lib/engine-registry";
import { decodeToImageData } from "./image-common";
import { asset } from "@/lib/base-path";

/**
 * MozJPEG 引擎：JPEG 有损重压缩（Squoosh 官方 codec）。
 * wasm 从 /vendor/jsquash/jpeg/ 加载（由 scripts/setup-vendor.cjs 复制）。
 */
let initPromise: Promise<void> | null = null;
function ensureInit(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      const mod = await import("@jsquash/jpeg/encode");
      // init 支持单参数 options（含 locateFile 重定向 wasm 路径）
      await mod.init({
        locateFile: (p: string) => asset(`/vendor/jsquash/jpeg/${p}`),
      });
    })();
  }
  return initPromise;
}

export function createMozjpegEngine(): EngineHandler {
  return {
    key: "mozjpeg",
    async compress(file, options, onProgress) {
      onProgress(15);
      await ensureInit();
      onProgress(30);
      const imageData = await decodeToImageData(file);
      onProgress(55);
      const mod = await import("@jsquash/jpeg/encode");
      const buffer = await mod.default(imageData, {
        quality: options.quality,
      });
      onProgress(85);
      const blob = new Blob([buffer], { type: "image/jpeg" });
      return { blob, size: blob.size, real: true };
    },
  };
}
