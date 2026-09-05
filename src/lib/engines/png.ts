import type { EngineHandler } from "@/lib/engine-registry";
import { decodeToImageData } from "./image-common";
import { asset } from "@/lib/base-path";

/**
 * OxiPNG 引擎：PNG 无损优化（Squoosh 官方 codec）。
 * wasm 从 /vendor/jsquash/png/squoosh_png_bg.wasm 加载。
 */
let initPromise: Promise<void> | null = null;
function ensureInit(): Promise<void> {
  if (!initPromise) {
    initPromise = (async () => {
      const mod = await import("@jsquash/png/encode");
      // png glue 的 init 接受 wasm URL 字符串（wasm-bindgen 风格）
      await mod.init(asset("/vendor/jsquash/png/squoosh_png_bg.wasm"));
    })();
  }
  return initPromise;
}

export function createPngEngine(): EngineHandler {
  return {
    key: "png",
    async compress(file, _options, onProgress) {
      onProgress(15);
      await ensureInit();
      onProgress(30);
      const imageData = await decodeToImageData(file);
      onProgress(55);
      const mod = await import("@jsquash/png/encode");
      const buffer = await mod.default(imageData, { bitDepth: 8 });
      onProgress(85);
      const blob = new Blob([buffer], { type: "image/png" });
      return { blob, size: blob.size, real: true };
    },
  };
}
