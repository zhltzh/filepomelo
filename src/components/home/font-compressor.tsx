"use client";

declare global {
  interface Window {
    __woff2Ready?: boolean;
  }
}

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Download,
  Loader2,
  Trash2,
  Type,
  CheckCircle2,
  X,
  FileWarning,
  FileText,
} from "lucide-react";
import { DropZone } from "@/components/home/drop-zone";
import { cn, downloadFile, formatFileSize, generateId } from "@/lib/utils";
import { asset } from "@/lib/base-path";
import { init as woff2Init, encode as woff2Encode } from "woff2-encode-wasm";

interface FontItem {
  id: string;
  name: string;
  file: File;
  status: "pending" | "working" | "done" | "error";
  outBlob?: Blob;
  error?: string;
}

const FONT_RE = /\.(ttf|otf)$/i;

function replaceExt(name: string, ext: string): string {
  return name.replace(/\.[^.]+$/, "") + ext;
}

/** 字体压缩：TTF/OTF → WOFF2（google/woff2 官方编码器 WASM，全部本地完成） */
export function FontCompressor() {
  const t = useTranslations("Font");
  const [items, setItems] = useState<FontItem[]>([]);
  const [isConverting, setIsConverting] = useState(false);

  const addFiles = useCallback((files: File[]) => {
    const fonts = files.filter((f) => FONT_RE.test(f.name));
    if (fonts.length === 0) return;
    setItems((prev) => {
      const existing = new Set(prev.map((i) => i.name));
      const added = fonts
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
    try {
      // 首次使用才初始化 wasm（懒加载，本地 vendor 文件）
      if (!window.__woff2Ready) {
        await woff2Init(fetch(asset("/vendor/woff2/encoder.wasm")));
        window.__woff2Ready = true;
      }
    } catch (e) {
      setItems((prev) =>
        prev.map((i) =>
          i.status === "pending"
            ? { ...i, status: "error" as const, error: String(e) }
            : i
        )
      );
      setIsConverting(false);
      return;
    }
    setItems((prev) =>
      prev.map((i) => (i.status === "pending" ? { ...i, status: "working" as const } : i))
    );
    for (const item of pending) {
      try {
        const bytes = new Uint8Array(await item.file.arrayBuffer());
        const out = await woff2Encode(bytes);
        const blob = new Blob([out.slice()], { type: "font/woff2" });
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
  }, [items]);

  const doneCount = useMemo(
    () => items.filter((i) => i.status === "done").length,
    [items]
  );

  return (
    <div className="space-y-6">
      <DropZone onFilesSelected={addFiles} />

      {/* 文件列表 */}
      {items.length > 0 && (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b bg-gray-50/80 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Type className="h-4 w-4 text-blue-800" />
              {t("fileCount", { count: items.length })}
              {doneCount > 0 && (
                <span className="text-xs text-green-600">
                  {t("doneCount", { count: doneCount })}
                </span>
              )}
            </div>
            <button
              onClick={() => setItems([])}
              className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-red-500"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("clearAll")}
            </button>
          </div>
          <div className="max-h-[20rem] divide-y overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                <FileText className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-700">{item.name}</p>
                  {item.status === "done" && item.outBlob && (
                    <p className="text-xs text-gray-400">
                      {formatFileSize(item.file.size)} →{" "}
                      <span className="font-medium text-green-600">
                        {formatFileSize(item.outBlob.size)}
                      </span>
                      {item.outBlob.size < item.file.size && (
                        <span className="ml-1 text-green-500">
                          (−
                          {Math.round((1 - item.outBlob.size / item.file.size) * 100)}
                          %)
                        </span>
                      )}
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
                          downloadFile(item.outBlob!, replaceExt(item.name, ".woff2"))
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
              <Type className="h-4 w-4" />
              {t("convertBtn")}
            </>
          )}
        </button>
      )}
    </div>
  );
}
