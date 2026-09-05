import type { EngineHandler } from "@/lib/engine-registry";

/**
 * Gifsicle GIF 压缩引擎。
 * gifsicle-wasm-browser：Gifsicle 1.92 编译为 wasm（wasm 内嵌于 JS，无独立部署文件）。
 * 压缩策略：-O2 优化 + 有损调色板 --lossy（1-200，越大噪点越明显）+ --colors 降色。
 * 实测：--lossy 是关键（纯无损优化对已优化 GIF 反而膨胀），配合降色可压 16%-50%。
 */

interface GifModule {
  run(options: {
    input: { file: File | Blob | ArrayBuffer; name: string }[];
    command: string[];
  }): Promise<File[]>;
}

let gifPromise: Promise<GifModule> | null = null;
function getGifsicle(): Promise<GifModule> {
  if (!gifPromise) {
    gifPromise = (async () => {
      const mod = await import("gifsicle-wasm-browser");
      const g = (mod.default ?? mod) as unknown as GifModule;
      return g;
    })();
  }
  return gifPromise;
}

/** quality 档位 → lossy 与 colors（扫描校准） */
function qualityToParams(quality: number): { lossy: number; colors: number } {
  if (quality <= 35) return { lossy: 120, colors: 64 }; // 最大压缩
  if (quality <= 70) return { lossy: 80, colors: 128 }; // 推荐
  return { lossy: 60, colors: 256 }; // 高质量（轻优化）
}

export function createGifsicleEngine(): EngineHandler {
  return {
    key: "gifsicle",
    async compress(file, options, onProgress) {
      onProgress(20);
      const gifsicle = await getGifsicle();
      onProgress(40);
      const { lossy, colors } = qualityToParams(options.quality);
      const files = await gifsicle.run({
        input: [{ file, name: "input.gif" }],
        command: [
          `-O2 --lossy=${lossy} --colors=${colors} input.gif -o /out/output.gif`,
        ],
      });
      onProgress(90);
      const out = files[0];
      if (!out) throw new Error("GIF 压缩无输出");
      return { blob: out, size: out.size, real: true };
    },
  };
}
