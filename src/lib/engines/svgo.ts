import type { EngineHandler } from "@/lib/engine-registry";

/**
 * SVGO 引擎：SVG 无损优化（纯 JS，无 wasm）。
 * 使用 svgo 的浏览器核心（lib/svgo.js，无 node 依赖）。
 * SVGO 只做结构优化，不处理内嵌位图，quality 档位对其无意义。
 */
let optimizeFn: (typeof import("svgo/lib/svgo.js"))["optimize"] | null = null;
async function getOptimize() {
  if (!optimizeFn) {
    const mod = await import("svgo/lib/svgo.js");
    optimizeFn = mod.optimize;
  }
  return optimizeFn;
}

export function createSvgoEngine(): EngineHandler {
  return {
    key: "svgo",
    async compress(file, _options, onProgress) {
      onProgress(30);
      const optimize = await getOptimize();
      onProgress(50);
      const text = await file.text();
      onProgress(65);
      const result = optimize(text, {
        path: file.name,
        plugins: [{ name: "preset-default" }],
      });
      onProgress(85);
      const blob = new Blob([result.data], { type: "image/svg+xml" });
      return { blob, size: blob.size, real: true };
    },
  };
}
