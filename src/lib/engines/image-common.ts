/**
 * 图片引擎公共工具：把 Blob 解码为 ImageData。
 * 用浏览器原生解码（createImageBitmap），支持 jpg/png/webp/gif/avif/bmp 等，
 * 比 wasm 解码器更快且无需额外加载。
 */
export async function decodeToImageData(blob: Blob): Promise<ImageData> {
  let bitmap: ImageBitmap | null = null;
  try {
    bitmap = await createImageBitmap(blob);
  } catch (e) {
    throw new Error("图片解码失败，文件可能已损坏或格式不受支持。");
  }
  try {
    const canvas = new OffscreenCanvas(bitmap.width, bitmap.height);
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("Canvas 初始化失败。");
    ctx.drawImage(bitmap, 0, 0);
    return ctx.getImageData(0, 0, bitmap.width, bitmap.height);
  } finally {
    bitmap.close();
  }
}
