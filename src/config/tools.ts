import {
  Image as ImageIcon,
  FileText,
  Video,
  Music,
  Archive,
  Repeat,
  PackageOpen,
  Type,
  type LucideIcon,
} from "lucide-react";

/** 压缩引擎标识 */
export type EngineKey =
  | "mozjpeg"
  | "png"
  | "webp"
  | "avif"
  | "svgo"
  | "gifsicle"
  | "ghostscript"
  | "pdf-struct"
  | "webcodecs"
  | "ffmpeg";

export type ToolCategory = "image" | "pdf" | "video" | "audio" | "zip" | "font";

export interface ToolDefinition {
  id: string;
  /** 页面路由 slug（对应 /{slug}） */
  slug: string;
  category: ToolCategory;
  /** tailwind 渐变类，用于图标底色 */
  color: string;
  /** 支持的扩展名（小写，不含点） */
  formats: string[];
  /** 引擎难度（用于 UI 展示） */
  difficulty: "low" | "medium" | "high" | "highest";
}

/**
 * 图标按 id 取用（不随 tool 对象跨 Client/Server 边界传递函数，
 * 避免 Next.js "Functions cannot be passed directly to Client Components"）
 */
export function getToolIcon(id: string): LucideIcon {
  const map: Record<string, LucideIcon> = {
    image: ImageIcon,
    imageConvert: Repeat,
    pdf: FileText,
    video: Video,
    audio: Music,
    zip: Archive,
    unzip: PackageOpen,
    font: Type,
  };
  return map[id] ?? ImageIcon;
}

/** 扩展名 → 引擎 分发映射 */
export const FORMAT_ENGINE_MAP: Record<string, EngineKey> = {
  // 图片
  jpg: "mozjpeg",
  jpeg: "mozjpeg",
  png: "png",
  webp: "webp",
  avif: "avif",
  svg: "svgo",
  gif: "gifsicle",
  // PDF：结构压缩优先（只重采样内嵌图，文本/矢量不动），无收益自动回退 Ghostscript
  pdf: "pdf-struct",
  // 视频：WebCodecs（mediabunny）为主，硬件编码免隔离头
  mp4: "webcodecs",
  mov: "webcodecs",
  mkv: "webcodecs",
  webm: "webcodecs",
  // 视频：WebCodecs 无法处理的容器，留给 ffmpeg 兜底
  flv: "ffmpeg",
  "3gp": "ffmpeg",
  ogv: "ffmpeg",
  // 音频：WebCodecs（mediabunny）为主（aac/ogg 有浏览器原生编码器）
  ogg: "webcodecs",
  aac: "webcodecs",
  // 音频：mp3 浏览器无原生编码器（需 LAME 扩展），wma 无法解码，均留 ffmpeg 兜底
  mp3: "ffmpeg",
  wma: "ffmpeg",
};

export const TOOLS: ToolDefinition[] = [
  {
    id: "image",
    slug: "image-compressor",
    category: "image",
    color: "from-orange-400 to-rose-500",
    formats: ["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"],
    difficulty: "low",
  },
  {
    id: "pdf",
    slug: "pdf-compressor",
    category: "pdf",
    color: "from-red-400 to-rose-600",
    formats: ["pdf"],
    difficulty: "medium",
  },
  {
    id: "video",
    slug: "video-compressor",
    category: "video",
    color: "from-violet-500 to-fuchsia-500",
    formats: ["mp4", "mov", "mkv", "flv", "3gp", "ogv"],
    difficulty: "highest",
  },
  {
    id: "audio",
    slug: "audio-compressor",
    category: "audio",
    color: "from-emerald-400 to-teal-500",
    formats: ["mp3", "ogg", "aac", "wma"],
    difficulty: "high",
  },
  {
    id: "zip",
    slug: "zip-compressor",
    category: "zip",
    color: "from-amber-400 to-orange-500",
    formats: ["zip"],
    difficulty: "low",
  },
  {
    id: "imageConvert",
    slug: "image-converter",
    category: "image",
    color: "from-cyan-400 to-blue-500",
    formats: ["jpg", "jpeg", "png", "webp", "avif"],
    difficulty: "low",
  },
  {
    id: "unzip",
    slug: "unzip",
    category: "zip",
    color: "from-indigo-400 to-violet-500",
    formats: ["zip"],
    difficulty: "low",
  },
  {
    id: "font",
    slug: "font-compressor",
    category: "font",
    color: "from-fuchsia-400 to-pink-500",
    formats: ["ttf", "otf"],
    difficulty: "medium",
  },
];

/** 按扩展名识别引擎，未知返回 null */
export function detectEngine(filename: string): EngineKey | null {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  return FORMAT_ENGINE_MAP[ext] ?? null;
}

/** 按扩展名判断是否被支持 */
export function isSupportedFile(filename: string): boolean {
  return detectEngine(filename) !== null;
}

/** 按扩展名返回所属工具类别（图片/PDF/视频/音频），未知返回 null */
export function getCategoryForExt(ext: string): ToolCategory | null {
  const lower = ext.toLowerCase().replace(/^\./, "");
  const tool = TOOLS.find((t) => t.formats.includes(lower));
  return tool?.category ?? null;
}

/** 按工具 id 查找定义 */
export function getTool(id: string): ToolDefinition | undefined {
  return TOOLS.find((t) => t.id === id);
}
