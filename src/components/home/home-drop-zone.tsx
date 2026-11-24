"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { UploadCloud } from "lucide-react";

const IMAGE_EXT = ["jpg", "jpeg", "png", "webp", "avif", "svg", "gif", "bmp", "ico"];
const VIDEO_EXT = ["mp4", "mov", "mkv", "webm", "avi", "m4v"];
const AUDIO_EXT = ["mp3", "aac", "ogg", "wav", "flac", "m4a", "opus"];
const FONT_EXT = ["ttf", "otf", "woff", "woff2"];

function routeToTool(file: File): string {
  const ext = (file.name.split(".").pop() ?? "").toLowerCase();
  const type = file.type;
  if (type.startsWith("image/") || IMAGE_EXT.includes(ext)) return "/zh/image-compressor/";
  if (ext === "pdf" || type === "application/pdf") return "/zh/pdf-compressor/";
  if (type.startsWith("video/") || VIDEO_EXT.includes(ext)) return "/zh/video-compressor/";
  if (type.startsWith("audio/") || AUDIO_EXT.includes(ext)) return "/zh/audio-compressor/";
  if (ext === "zip" || type === "application/zip") return "/zh/zip-compressor/";
  if (FONT_EXT.includes(ext)) return "/zh/font-compressor/";
  return "/zh/tools/";
}

export function HomeDropZone() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFiles = useCallback(
    (files: File[]) => {
      if (files.length === 0) return;
      router.push(routeToTool(files[0]));
    },
    [router]
  );

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => inputRef.current?.click()}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragOver(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragOver(false);
      }}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragOver(false);
        handleFiles(Array.from(e.dataTransfer.files));
      }}
      className={`mt-8 cursor-pointer rounded-2xl border-2 border-dashed bg-white/95 p-8 text-center shadow-soft backdrop-blur-sm transition-all duration-200 ${
        isDragOver ? "border-emerald-400 bg-white scale-[1.01]" : "border-white/40 hover:border-emerald-300"
      }`}
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
      <UploadCloud className={`mx-auto h-10 w-10 transition-colors ${isDragOver ? "text-emerald-500" : "text-blue-400"}`} />
      <p className="mt-3 text-base font-semibold text-gray-800">
        拖拽文件到此处，自动进入对应压缩工具
      </p>
      <p className="mt-1 text-sm text-gray-500">
        支持图片 / PDF / 视频 / 音频 / ZIP / 字体 · 也可点击选择文件
      </p>
    </div>
  );
}
