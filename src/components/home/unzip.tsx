"use client";

import { useCallback, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Download,
  Loader2,
  Trash2,
  FolderArchive,
  CheckCircle2,
  X,
  File as FileIcon,
  FileWarning,
} from "lucide-react";
import { Unzip, UnzipInflate } from "fflate";
import { DropZone } from "@/components/home/drop-zone";
import { cn, downloadFile, formatFileSize, generateId } from "@/lib/utils";

interface ZipEntry {
  id: string;
  zipName: string;
  name: string; // zip 内路径
  data: Uint8Array;
}

interface ZipFileItem {
  id: string;
  name: string;
  file: File;
  status: "pending" | "working" | "done" | "error";
  entries?: ZipEntry[];
  error?: string;
}

const ZIP_RE = /\.zip$/i;

/** fflate 流式解压单个 zip，逐文件回调收集（内存可控，大包不一次性载入） */
async function extractZip(file: File): Promise<ZipEntry[]> {
  const bytes = new Uint8Array(await file.arrayBuffer());
  const out: ZipEntry[] = [];
  await new Promise<void>((resolve, reject) => {
    const unzipper = new Unzip((data) => {
      const { name } = data;
      const chunks: Uint8Array[] = [];
      let total = 0;
      data.ondata = (err, chunk, final) => {
        // fflate 流式回调签名: (err, data, final)
        if (err || !chunk) return;
        chunks.push(chunk);
        total += chunk.length;
        if (final) {
          const full = new Uint8Array(total);
          let off = 0;
          for (const c of chunks) {
            full.set(c, off);
            off += c.length;
          }
          // 跳过目录项（路径以 / 结尾或零长度目录）
          if (name && !name.endsWith("/") && full.length > 0) {
            out.push({ id: generateId(), zipName: file.name, name, data: full });
          }
        }
      };
      // fflate 流式 Unzip 需手动调用 start() 启动该文件解压
      data.start();
    });
    try {
      unzipper.register(UnzipInflate);
      unzipper.push(bytes, true);
      resolve();
    } catch (e) {
      reject(e instanceof Error ? e : new Error(String(e)));
    }
  });
  return out;
}

function basename(name: string): string {
  const parts = name.split("/");
  return parts[parts.length - 1] || name;
}

/** ZIP 解压：浏览器本地解压 zip 并下载其中的文件（fflate，零后端） */
export function UnzipCompressor() {
  const t = useTranslations("Unzip");
  const [items, setItems] = useState<ZipFileItem[]>([]);
  const [isExtracting, setIsExtracting] = useState(false);

  const addFiles = useCallback((files: File[]) => {
    const zips = files.filter((f) => ZIP_RE.test(f.name));
    if (zips.length === 0) return;
    setItems((prev) => {
      const existing = new Set(prev.map((i) => i.name));
      const added = zips
        .filter((f) => !existing.has(f.name))
        .map((f) => ({ id: generateId(), name: f.name, file: f, status: "pending" as const }));
      return [...prev, ...added];
    });
  }, []);

  const removeItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  }, []);

  const extractAll = useCallback(async () => {
    const pending = items.filter((i) => i.status !== "done");
    if (pending.length === 0) return;
    setIsExtracting(true);
    setItems((prev) =>
      prev.map((i) => (i.status === "pending" ? { ...i, status: "working" as const } : i))
    );
    for (const item of pending) {
      try {
        const entries = await extractZip(item.file);
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id ? { ...i, status: "done" as const, entries } : i
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
    setIsExtracting(false);
  }, [items]);

  const allEntries = useMemo(() => items.flatMap((i) => i.entries ?? []), [items]);
  const doneCount = useMemo(
    () => items.filter((i) => i.status === "done").length,
    [items]
  );

  const downloadAll = useCallback(() => {
    const used = new Set<string>();
    for (const entry of allEntries) {
      let name = basename(entry.name);
      let n = 1;
      while (used.has(name)) {
        const ext = name.includes(".") ? name.slice(name.lastIndexOf(".")) : "";
        const base = ext ? name.slice(0, name.lastIndexOf(".")) : name;
        name = `${base} (${n})${ext}`;
        n++;
      }
      used.add(name);
      const blob = new Blob([entry.data.slice()], { type: "application/octet-stream" });
      // 间隔触发避免浏览器合并多个下载
      setTimeout(() => downloadFile(blob, name), allEntries.indexOf(entry) * 120);
    }
  }, [allEntries]);

  return (
    <div className="space-y-6">
      <DropZone onFilesSelected={addFiles} />

      {/* ZIP 文件列表 */}
      {items.length > 0 && (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b bg-gray-50/80 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FolderArchive className="h-4 w-4 text-blue-800" />
              {t("zipCount", { count: items.length })}
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
          <div className="max-h-[14rem] divide-y overflow-y-auto">
            {items.map((item) => (
              <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
                <FolderArchive className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-700">{item.name}</p>
                  {item.status === "done" && item.entries && (
                    <p className="text-xs text-gray-400">
                      {t("fileCount", { count: item.entries.length })}
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
                  <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" />
                  </span>
                )}
                {item.status === "error" && (
                  <FileWarning className="h-4 w-4 flex-shrink-0 text-red-400" />
                )}
                <button
                  onClick={() => removeItem(item.id)}
                  disabled={isExtracting}
                  className="text-gray-300 transition-colors hover:text-red-500 disabled:opacity-40"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 解压按钮 */}
      {items.length > 0 && (
        <button
          onClick={extractAll}
          disabled={isExtracting}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:from-primary/90 hover:to-emerald-500/90 active:scale-[0.98] disabled:opacity-60 sm:w-auto"
        >
          {isExtracting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              {t("extracting")}
            </>
          ) : (
            <>
              <FolderArchive className="h-4 w-4" />
              {t("extractBtn")}
            </>
          )}
        </button>
      )}

      {/* 解压结果文件列表 */}
      {allEntries.length > 0 && (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b bg-gray-50/80 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileIcon className="h-4 w-4 text-blue-800" />
              {t("resultCount", { count: allEntries.length })}
            </div>
            <button
              onClick={downloadAll}
              className="flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-blue-800 transition-colors hover:bg-primary/20"
            >
              <Download className="h-3.5 w-3.5" />
              {t("downloadAll")}
            </button>
          </div>
          <div className="max-h-[22rem] divide-y overflow-y-auto">
            {allEntries.map((entry) => (
              <div key={entry.id} className="flex items-center gap-3 px-4 py-2">
                <FileIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-gray-700">
                    {entry.name.startsWith(entry.zipName)
                      ? entry.name
                      : `${entry.zipName} › ${entry.name}`}
                  </p>
                  <p className="text-xs text-gray-400">{formatFileSize(entry.data.length)}</p>
                </div>
                <button
                  onClick={() => {
                    const blob = new Blob([entry.data.slice()], {
                      type: "application/octet-stream",
                    });
                    downloadFile(blob, basename(entry.name));
                  }}
                  className="flex flex-shrink-0 items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-medium text-blue-800 transition-colors hover:bg-primary/20"
                >
                  <Download className="h-3.5 w-3.5" />
                  {t("download")}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
