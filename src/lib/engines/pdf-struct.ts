import type * as PdfLib from "pdf-lib";
import type { EngineHandler } from "@/lib/engine-registry";
import { createGhostscriptEngine } from "./ghostscript";

/**
 * PDF 结构压缩引擎（P5）：只重采样/重编码 PDF 内嵌图片，文本与矢量完全不动。
 *
 * 实现（参考成熟方案）：pdf-lib 遍历每页 Resources → XObject 图像流，
 * 用 createImageBitmap + Canvas 按目标宽度/质量重编码为 JPEG，再 embedJpg 替换回原引用。
 * save({ useObjectStreams }) 额外减 5-15% 体积。
 *
 * 策略：
 * - 无嵌入图像 / 压缩后未变小 / 加密或解析失败 → 自动回退 Ghostscript 重编码引擎
 * - 透明/蒙版图像（SMask/Mask）保持原样，避免破坏透明度
 */

let pdfLibPromise: Promise<typeof PdfLib> | null = null;
function getPdfLib(): Promise<typeof PdfLib> {
  if (!pdfLibPromise) pdfLibPromise = import("pdf-lib");
  return pdfLibPromise;
}

/** quality 档位 → { jpegQuality, maxWidth }（图片超出 maxWidth 才缩放，保持宽高比） */
function settingsFor(q: number): { jpegQuality: number; maxWidth: number } {
  if (q <= 35) return { jpegQuality: 0.45, maxWidth: 1024 }; // 最大压缩
  if (q <= 70) return { jpegQuality: 0.7, maxWidth: 1400 }; // 推荐
  return { jpegQuality: 0.9, maxWidth: 2048 }; // 高质量
}

/** 重编码为 JPEG；无法解码（如 CMYK）或编码失败返回 null（保持原图） */
async function reencodeToJpeg(
  bytes: Uint8Array,
  quality: number,
  maxWidth: number
): Promise<Uint8Array | null> {
  try {
    const bitmap = await createImageBitmap(new Blob([bytes.slice()]));
    const scale = Math.min(1, maxWidth / bitmap.width);
    const width = Math.max(1, Math.floor(bitmap.width * scale));
    const height = Math.max(1, Math.floor(bitmap.height * scale));
    const canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext("2d");
    if (!ctx) return null;
    ctx.drawImage(bitmap, 0, 0, width, height);
    const blob = await new Promise<Blob | null>((r) =>
      canvas.toBlob(r, "image/jpeg", quality)
    );
    if (!blob) return null;
    return new Uint8Array(await blob.arrayBuffer());
  } catch {
    return null;
  }
}

interface StructResult {
  blob: Blob;
  reencoded: number;
}

async function compressStructural(
  file: File,
  quality: number,
  onProgress: (p: number) => void
): Promise<StructResult> {
  const { PDFDocument, PDFStream, PDFDict, PDFName } = await getPdfLib();
  const bytes = new Uint8Array(await file.arrayBuffer());
  const doc = await PDFDocument.load(bytes, { updateMetadata: false });
  const pages = doc.getPages();
  const { jpegQuality, maxWidth } = settingsFor(quality);
  let reencoded = 0;

  for (let i = 0; i < pages.length; i++) {
    const page = pages[i];
    const resources = page.node.Resources();
    if (!resources) continue;
    const xObject = resources.lookup(PDFName.of("XObject"));
    if (!(xObject instanceof PDFDict)) continue;

    for (const name of xObject.keys()) {
      const obj = xObject.get(name);
      if (!(obj instanceof PDFStream)) continue;
      const subtype = obj.dict.get(PDFName.of("Subtype"));
      if (!(subtype instanceof PDFName) || subtype.asString() !== "Image") continue;
      // 透明/蒙版图像保持原样，避免破坏透明度
      if (obj.dict.get(PDFName.of("SMask")) || obj.dict.get(PDFName.of("Mask"))) continue;
      const original = obj.getContents();
      const compressed = await reencodeToJpeg(original, jpegQuality, maxWidth);
      if (!compressed) continue;
      // 仅在确实更小时替换，避免膨胀
      if (compressed.length < original.length) {
        try {
          const embedded = await doc.embedJpg(compressed);
          xObject.set(name, embedded.ref);
          reencoded++;
        } catch {
          /* 替换失败保持原图 */
        }
      }
    }
    onProgress(10 + Math.round(((i + 1) / pages.length) * 60));
  }

  const out = await doc.save({ useObjectStreams: true, addDefaultPage: false });
  return { blob: new Blob([out.slice()], { type: "application/pdf" }), reencoded };
}

export function createPdfStructEngine(): EngineHandler {
  return {
    key: "pdf-struct",
    async compress(file, options, onProgress) {
      try {
        onProgress(5);
        const result = await compressStructural(file, options.quality, onProgress);
        onProgress(90);
        // 有重编码的图且整体确实变小 → 用结构压缩结果
        if (result.reencoded > 0 && result.blob.size < file.size) {
          onProgress(100);
          return { blob: result.blob, size: result.blob.size, real: true };
        }
        // 无嵌入图可压或未变小 → 回退 Ghostscript
      } catch {
        // 加密/解析失败 → 回退 Ghostscript
      }
      onProgress(0);
      const gs = createGhostscriptEngine();
      const fallback = await gs.compress(file, options, onProgress);
      return fallback;
    },
  };
}
