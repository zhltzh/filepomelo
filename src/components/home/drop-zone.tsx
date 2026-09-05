"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Upload, FolderOpen, ClipboardPaste } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

interface DropZoneProps {
  onFilesSelected: (files: File[]) => void;
}

/** 递归遍历目录项收集所有文件 */
async function traverseEntry(entry: FileSystemEntry | null, out: File[]) {
  if (!entry) return;
  if (entry.isFile) {
    const file = await new Promise<File>((resolve, reject) =>
      (entry as FileSystemFileEntry).file(resolve, reject)
    );
    out.push(file);
  } else if (entry.isDirectory) {
    const reader = (entry as FileSystemDirectoryEntry).createReader();
    // readEntries 每次最多返回 100 项，需循环读取到空
    while (true) {
      const batch = await new Promise<FileSystemEntry[]>((resolve) =>
        reader.readEntries(resolve)
      );
      if (batch.length === 0) break;
      for (const e of batch) await traverseEntry(e, out);
    }
  }
}

async function getFilesFromDataTransfer(
  dt: DataTransfer
): Promise<File[]> {
  const items = Array.from(dt.items);
  const entries = items.map((i) => i.webkitGetAsEntry?.());
  if (entries.some(Boolean)) {
    const out: File[] = [];
    for (const entry of entries) {
      if (entry) await traverseEntry(entry, out);
    }
    return out;
  }
  return Array.from(dt.files);
}

export function DropZone({ onFilesSelected }: DropZoneProps) {
  const t = useTranslations("Home");
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: File[]) => {
      if (files.length > 0) onFilesSelected(files);
    },
    [onFilesSelected]
  );

  // 全局 Ctrl+V 粘贴
  useEffect(() => {
    const onPaste = (e: ClipboardEvent) => {
      const files = Array.from(e.clipboardData?.files ?? []);
      if (files.length > 0) handleFiles(files);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [handleFiles]);

  const handleDrop = useCallback(
    async (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      const files = await getFilesFromDataTransfer(e.dataTransfer);
      handleFiles(files);
    },
    [handleFiles]
  );

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragOver(false);
      }}
      onDrop={handleDrop}
      className={cn(
        "relative cursor-pointer overflow-hidden rounded-2xl border-2 border-dashed p-10 text-center transition-all duration-200 sm:p-14",
        isDragOver
          ? "border-primary bg-gradient-to-b from-primary/[0.06] to-transparent shadow-soft scale-[1.01]"
          : "border-gray-200 bg-white/60 hover:border-primary/50 hover:bg-gradient-to-b hover:from-primary/[0.02]"
      )}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => {
          if (e.target.files) handleFiles(Array.from(e.target.files));
          e.target.value = "";
        }}
      />
      <input
        ref={folderInputRef}
        type="file"
        multiple
        className="hidden"
        // @ts-expect-error webkitdirectory 为 Chromium 私有属性
        webkitdirectory=""
        onChange={(e) => {
          if (e.target.files) handleFiles(Array.from(e.target.files));
          e.target.value = "";
        }}
      />

      <div
        className={cn(
          "mx-auto flex h-16 w-16 items-center justify-center rounded-2xl transition-all duration-200",
          isDragOver
            ? "bg-gradient-to-br from-primary to-emerald-400 scale-110 shadow-soft"
            : "bg-gradient-to-br from-gray-100 to-gray-50 ring-1 ring-black/[0.04]"
        )}
      >
        <Upload
          className={cn(
            "h-8 w-8 transition-colors",
            isDragOver ? "text-white" : "text-gray-400"
          )}
        />
      </div>

      <p className="mt-5 text-lg font-semibold text-gray-800">{t("dropTitle")}</p>
      <p className="mt-1.5 text-sm text-gray-400">{t("dropSubtitle")}</p>

      <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs text-gray-400">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-600 transition-colors hover:border-primary hover:text-primary"
        >
          <Upload className="h-3.5 w-3.5" />
          {t("selectFiles")}
        </button>
        <button
          type="button"
          onClick={() => folderInputRef.current?.click()}
          className="flex items-center gap-1.5 rounded-lg border border-gray-200 bg-white px-3 py-2 text-gray-600 transition-colors hover:border-primary hover:text-primary"
        >
          <FolderOpen className="h-3.5 w-3.5" />
          {t("selectFolder")}
        </button>
        <span className="flex items-center gap-1.5 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
          <ClipboardPaste className="h-3.5 w-3.5" />
          {t("paste")}
        </span>
      </div>

      <p className="mt-4 text-xs text-gray-300">{t("dropHint")}</p>
    </div>
  );
}
