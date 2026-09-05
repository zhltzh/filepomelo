"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Download,
  Loader2,
  Trash2,
  File as FileIcon,
  Package,
  CheckCircle2,
  X,
} from "lucide-react";
import { zip } from "fflate";
import { DropZone } from "@/components/home/drop-zone";
import { cn, downloadFile, formatFileSize, generateId } from "@/lib/utils";

interface ZipItem {
  id: string;
  name: string;
  file: File;
}

/** fflate 压缩级别（ZIP 档位，level 为 fflate 支持的字面量联合） */
type ZipLevel = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
const LEVELS: { key: string; value: ZipLevel }[] = [
  { key: "fast", value: 1 },
  { key: "recommended", value: 6 },
  { key: "max", value: 9 },
];

/** ZIP 打包压缩：把多个文件在浏览器本地打包成一个 zip（fflate，零后端） */
export function ZipCompressor() {
  const t = useTranslations("Zip");
  const [items, setItems] = useState<ZipItem[]>([]);
  const [level, setLevel] = useState<ZipLevel>(6);
  const [isPacking, setIsPacking] = useState(false);
  const [result, setResult] = useState<{
    zip: Blob;
    original: number;
    packed: number;
  } | null>(null);

  const addFiles = useCallback((files: File[]) => {
    setItems((prev) => {
      const existing = new Set(prev.map((i) => i.name));
      const added = files
        .filter((f) => !existing.has(f.name))
        .map((f) => ({ id: generateId(), name: f.name, file: f }));
      return [...prev, ...added];
    });
    setResult(null);
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
    setResult(null);
  }, []);

  const totalSize = useMemo(
    () => items.reduce((s, i) => s + i.file.size, 0),
    [items]
  );

  const pack = useCallback(async () => {
    if (items.length === 0) return;
    setIsPacking(true);
    try {
      const files: Record<string, Uint8Array> = {};
      for (const item of items) {
        files[item.name] = new Uint8Array(await item.file.arrayBuffer());
      }
      const data = await new Promise<Uint8Array>((resolve, reject) => {
        zip(files, { level }, (err, out) => (err ? reject(err) : resolve(out)));
      });
      const blob = new Blob([data.slice()], { type: "application/zip" });
      setResult({ zip: blob, original: totalSize, packed: blob.size });
    } finally {
      setIsPacking(false);
    }
  }, [items, level, totalSize]);

  const saveRate =
    result && result.original > 0
      ? Math.round((1 - result.packed / result.original) * 100)
      : 0;

  return (
    <div className="space-y-6">
      <DropZone onFilesSelected={addFiles} />

      {/* ZIP 压缩级别 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500">{t("levelLabel")}</span>
        {LEVELS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setLevel(opt.value)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              level === opt.value
                ? "border-primary bg-primary/10 text-blue-800 font-medium"
                : "border-gray-200 text-gray-500 hover:border-primary/50"
            )}
          >
            {opt.key === "fast" && t("levelFast")}
            {opt.key === "recommended" && t("levelRecommended")}
            {opt.key === "max" && t("levelMax")}
          </button>
        ))}
      </div>

      {/* 文件列表 */}
      {items.length > 0 && (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b bg-gray-50/80 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileIcon className="h-4 w-4 text-blue-800" />
              {t("fileCount", { count: items.length })}
              <span className="text-xs text-gray-400">
                {formatFileSize(totalSize)}
              </span>
            </div>
            <button
              onClick={() => {
                setItems([]);
                setResult(null);
              }}
              className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("clearAll")}
            </button>
          </div>
          <div className="max-h-[20rem] divide-y overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                <FileIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <p className="min-w-0 flex-1 truncate text-sm text-gray-700">
                  {item.name}
                </p>
                <span className="flex-shrink-0 text-xs text-gray-400">
                  {formatFileSize(item.file.size)}
                </span>
                <button
                  onClick={() => removeItem(item.id)}
                  disabled={isPacking}
                  className="text-gray-300 transition-colors hover:text-red-500 disabled:opacity-40"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 打包按钮 */}
      {items.length > 0 && (
        <button
          onClick={pack}
          disabled={isPacking}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:from-primary/90 hover:to-emerald-500/90 active:scale-[0.98] disabled:opacity-60 sm:w-auto"
        >
          {isPacking ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("packing")}
            </>
          ) : (
            <>
              <Package className="h-4 w-4" />
              {t("packBtn")}
            </>
          )}
        </button>
      )}

      {/* 结果 */}
      {result && (
        <div className="flex flex-col items-center gap-4 rounded-2xl border bg-white p-6 text-center shadow-sm sm:flex-row sm:justify-between sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
              <CheckCircle2 className="h-6 w-6 text-blue-800" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{t("done")}</p>
              <p className="mt-1 text-sm text-gray-500">
                {formatFileSize(result.original)} →{" "}
                <span className="font-medium text-green-600">
                  {formatFileSize(result.packed)}
                </span>{" "}
                {result.packed < result.original && (
                  <span className="text-green-500">
                    (−{saveRate}%)
                  </span>
                )}
              </p>
            </div>
          </div>
          <button
            onClick={() =>
              downloadFile(result.zip, "filepomelo-files.zip")
            }
            className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-primary to-emerald-500 px-6 py-2.5 text-sm font-semibold text-white shadow-soft transition-all hover:from-primary/90 hover:to-emerald-500/90"
          >
            <Download className="h-4 w-4" />
            {t("download")}
          </button>
        </div>
      )}
    </div>
  );
}
