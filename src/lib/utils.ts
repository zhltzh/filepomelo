import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化文件大小
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}

/**
 * 下载文件
 */
export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // 延迟释放，避免部分浏览器中断尚未开始的下载
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * 生成唯一 ID
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}

/**
 * 将底层库（Ghostscript / ffmpeg / jsquash / gifsicle）抛出的错误
 * 映射为对用户友好的中文提示。
 */
export function friendlyError(err: unknown, fallback: string): string {
  const msg = err instanceof Error ? err.message : String(err ?? "");
  if (!msg) return fallback;

  const lower = msg.toLowerCase();

  // 引擎加载类错误
  if (lower.includes("networkerror") || lower.includes("failed to fetch") || lower.includes("load failed"))
    return "网络请求失败，请检查网络连接后重试。";
  if (lower.includes("wasm") || lower.includes("engine"))
    return "压缩引擎加载失败，请刷新页面重试。";
  if (lower.includes("worker")) return "后台处理进程加载失败，请刷新页面重试。";
  if (lower.includes("404") || lower.includes("not found"))
    return "引擎文件缺失（404），请确认静态资源已正确部署。";

  // 内存/资源类错误
  if (lower.includes("oom") || lower.includes("out of memory") || lower.includes("memory"))
    return "内存不足，文件可能过大。请选择较小的文件，或关闭其他标签页后重试。";
  if (lower.includes("abort") || lower.includes("canceled"))
    return "操作已中止。";

  // 文件解析类错误
  if (lower.includes("encrypted") || lower.includes("password"))
    return "该文件已加密，请先解密后再处理。";
  if (lower.includes("corrupt") || lower.includes("invalid") || lower.includes("cannot open"))
    return "文件无法解析，请确认是有效的文件（且未被损坏）。";
  if (lower.includes("unsupported") || lower.includes("no such file"))
    return "不支持该文件格式或内部编码，请转换为常见格式后再试。";

  // 超时
  if (lower.includes("timeout")) return "处理超时，文件可能过大或过于复杂，请重试。";

  return msg;
}

/**
 * 文件扩展名（小写，不含点）
 */
export function getExtension(filename: string): string {
  return filename.split(".").pop()?.toLowerCase() ?? "";
}
