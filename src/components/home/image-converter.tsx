"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Download,
  Loader2,
  Trash2,
  Image as ImageIcon,
  CheckCircle2,
  X,
  RefreshCw,
  FileWarning,
} from "lucide-react";
import { DropZone } from "@/components/home/drop-zone";
import { cn, downloadFile, formatFileSize, generateId } from "@/lib/utils";
import { asset } from "@/lib/base-path";
import avifEncode from "@jsquash/avif/encode";
import { init as avifInit } from "@jsquash/avif/encode";
type TargetFormat = "jpeg" | "png" | "webp" | "avif";

interface ConvertItem {
  id: string;
  name: string;
  file: File;
  status: "pending" | "working" | "done" | "error";
  outBlob?: Blob;
  error?: string;
}

const IMAGE_RE = /\.(jpe?g|png|webp|avif|gif|bmp|svg)$/i;
const EXT_FOR: Record<TargetFormat, string> = {
  jpeg: ".jpg",
  png: ".png",
  webp: ".webp",
  avif: ".avif",
};

let avifInitPromise: Promise<unknown> | null = null;
function ensureAvifInit(): Promise<unknown> {
  if (!avifInitPromise) {
    avifInitPromise = avifInit(undefined, {
      locateFile: (p: string) => asset(`/vendor/jsquash/avif/${p}`),
    });
  }
  return avifInitPromise;
}

/** 用 canvas 解码→编码，把图片转成目标格式（jpg/png/webp 用原生编码器，avif 用 jsquash） */
async function convertImage(file: File, format: TargetFormat, quality: number): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  try {
    const canvas = document.createElement("canvas");
    canvas.width = bitmap.width;
    canvas.height = bitmap.height;
    const ctx = canvas.getContext("2d");
    if (!ctx) throw new Error("no 2d context");
    if (format === "jpeg") {
      // JPEG 无透明通道，透明区域用白底填充
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    ctx.drawImage(bitmap, 0, 0);

    if (format === "avif") {
      await ensureAvifInit();
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const cqLevel = Math.max(0, Math.min(63, Math.round(((100 - quality) / 100) * 63)));
      const out = await avifEncode(imgData, { cqLevel, speed: 6 });
      return new Blob([out.slice()], { type: "image/avif" });
    }

    const mime =
      format === "jpeg" ? "image/jpeg" : format === "png" ? "image/png" : "image/webp";
    const blob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("encode failed"))),
        mime,
        format === "png" ? undefined : quality
      );
    });
    return blob;
  } finally {
    bitmap.close();
  }
}

function replaceExt(name: string, format: TargetFormat): string {
  const base = name.replace(/\.[^.]+$/, "");
  return base + EXT_FOR[format];
}

/** 图片格式转换：JPG ↔ PNG ↔ WebP ↔ AVIF，全部本地完成 */
export function ImageConverter() {
  const t = useTranslations("ImageConvert");
  const [items, setItems] = useState<ConvertItem[]>([]);
  const [format, setFormat] = useState<TargetFormat>("webp");
  const [quality, setQuality] = useState(80);
  const [isConverting, setIsConverting] = useState(false);

  const addFiles = useCallback((files: File[]) => {
    const images = files.filter((f) => IMAGE_RE.test(f.name));
    if (images.length === 0) return;
    setItems((prev) => {
      const existing = new Set(prev.map((i) => i.name));
      const added = images
        .filter((f) => !existing.has(f.name))
        .map((f) => ({ id: generateId(), name: f.name, file: f, status: "pending" as const }));
      return [...prev, ...added];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const convertAll = useCallback(async () => {
    const pending = items.filter((i) => i.status !== "done");
    if (pending.length === 0) return;
    setIsConverting(true);
    setItems((prev) =>
      prev.map((i) => (i.status === "pending" ? { ...i, status: "working" as const } : i))
    );
    for (const item of pending) {
      try {
        const blob = await convertImage(item.file, format, quality);
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: "done" as const, outBlob: blob } : i
          )
        );
      } catch (e) {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: "error" as const, error: String(e) }
              : i
          )
        );
      }
    }
    setIsConverting(false);
  }, [items, format, quality]);

  const doneCount = useMemo(
    () => items.filter((i) => i.status === "done").length,
    [items]
  );

  return (
    <div className="space-y-6">
      <DropZone onFilesSelected={addFiles} />

      {/* 目标格式 + 质量 */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-gray-500">{t("targetLabel")}</span>
          {(["jpeg", "png", "webp", "avif"] as TargetFormat[]).map((f) => (
            <button
              key={f}
              onClick={() => setFormat(f)}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm transition-colors",
                format === f
                  ? "border-primary bg-primary/10 font-medium text-blue-800"
                  : "border-gray-200 text-gray-500 hover:border-primary/50"
              )}
            >
              {f === "jpeg" && "JPG"}
              {f === "png" && "PNG"}
              {f === "webp" && "WebP"}
              {f === "avif" && "AVIF"}
            </button>
          ))}
        </div>
        {format !== "png" && (
          <label className="flex items-center gap-2 text-sm text-gray-500">
            {t("quality")}
            <input
              type="range"
              min={10}
              max={100}
              value={quality}
              onChange={(e) => setQuality(Number(e.target.value))}
              className="w-36 accent-primary"
            />
            <span className="w-9 font-medium text-gray-700">{quality}</span>
          </label>
        )}
      </div>

      {/* 文件列表 */}
      {items.length > 0 && (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b bg-gray-50/80 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <ImageIcon className="h-4 w-4 text-blue-800" />
              {t("fileCount", { count: items.length })}
              {doneCount > 0 && (
                <span className="text-xs text-green-600">
                  {t("doneCount", { count: doneCount })}
                </span>
              )}
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => {
                  setItems([]);
                }}
                className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-red-500"
              >
                <Trash2 className="h-3.5 w-3.5" />
                {t("clearAll")}
              </button>
            </div>
          </div>
          <div className="max-h-[20rem] divide-y overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                <ImageIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-700">{item.name}</p>
                  {item.status === "done" && item.outBlob && (
                    <p className="text-xs text-gray-400">
                      {formatFileSize(item.file.size)} →{" "}
                      <span className="font-medium text-green-600">
                        {formatFileSize(item.outBlob.size)}
                      </span>
                    </p>
                  )}
                  {item.status === "error" && (
                    <p className="text-xs text-red-500">
                      {t("error")}: {item.error}
                    </p>
                  )}
                </div>
                {item.status === "working" && (
                  <Loader2 className="h-4 w-4 flex-shrink-0 animate-spin text-blue-800" />
                )}
                {item.status === "done" && (
                  <>
                    <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                    </span>
                    {item.outBlob && (
                      <button
                        onClick={() =>
                          downloadFile(item.outBlob!, replaceExt(item.name, format))
                        }
                        className="flex flex-shrink-0 items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-blue-800 transition-colors hover:bg-primary/20"
                      >
                        <Download className="h-3.5 w-3.5" />
                        {t("download")}
                      </button>
                    )}
                  </>
                )}
                {item.status === "error" && (
                  <FileWarning className="h-4 w-4 flex-shrink-0 text-red-400" />
                )}
                <button
                  onClick={() => removeItem(item.id)}
                  disabled={isConverting}
                  className="text-gray-300 transition-colors hover:text-red-500 disabled:opacity-40"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 转换按钮 */}
      {items.length > 0 && (
        <button
          onClick={convertAll}
          disabled={isConverting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:from-primary/90 hover:to-emerald-500/90 active:scale-[0.98] disabled:opacity-60 sm:w-auto"
        >
          {isConverting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("converting")}
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4" />
              {t("convertBtn")}
            </>
          )}
        </button>
      )}
    </div>
  );
}
