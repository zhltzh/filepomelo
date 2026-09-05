/**
 * 引擎注册入口：客户端页面加载时执行，注册全部引擎。
 * - stub.ts 先注册所有引擎（兜底，原样返回）
 * - 下方真实引擎以懒加载 factory 覆盖同名 key
 *   P2：图片 mozjpeg/png/webp/svgo；P3：avif/gifsicle/ghostscript
 *   ffmpeg(音视频) 仍在 P4/P5 接入
 */
import "./stub";
import { registerEngine } from "@/lib/engine-registry";

// P2：真实图片引擎（懒加载，首次压缩该格式时才动态 import wasm 胶水）
registerEngine("mozjpeg", () =>
  import("@/lib/engines/mozjpeg").then((m) => m.createMozjpegEngine())
);
registerEngine("png", () =>
  import("@/lib/engines/png").then((m) => m.createPngEngine())
);
registerEngine("webp", () =>
  import("@/lib/engines/webp").then((m) => m.createWebpEngine())
);
registerEngine("svgo", () =>
  import("@/lib/engines/svgo").then((m) => m.createSvgoEngine())
);

// P3：AVIF / GIF / PDF（Ghostscript 走 Web Worker）
registerEngine("avif", () =>
  import("@/lib/engines/avif").then((m) => m.createAvifEngine())
);
registerEngine("gifsicle", () =>
  import("@/lib/engines/gifsicle").then((m) => m.createGifsicleEngine())
);
registerEngine("ghostscript", () =>
  import("@/lib/engines/ghostscript").then((m) => m.createGhostscriptEngine())
);

// P5：PDF 结构压缩（只重采样内嵌图，文本/矢量不动；无收益自动回退 Ghostscript）
registerEngine("pdf-struct", () =>
  import("@/lib/engines/pdf-struct").then((m) => m.createPdfStructEngine())
);

// P4：音视频 WebCodecs + mediabunny（硬件编码，免 COOP/COEP；ffmpeg 兜底引擎后续接入）
registerEngine("webcodecs", () =>
  import("@/lib/engines/webcodecs").then((m) => m.createWebCodecsEngine())
);

// P5：FFmpeg 兜底（WebCodecs 无法处理的格式：mp3/wma 音频、flv/3gp/ogv 视频）
registerEngine("ffmpeg", () =>
  import("@/lib/engines/ffmpeg").then((m) => m.createFfmpegEngine())
);
