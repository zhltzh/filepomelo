"use client";

import { useCallback, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import {
  Play,
  Package,
  Trash2,
  Download,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  File as FileIcon,
} from "lucide-react";
import { zipSync } from "fflate";
import { DropZone } from "@/components/home/drop-zone";
import {
  detectEngine,
  getCategoryForExt,
  type EngineKey,
  type ToolCategory,
} from "@/config/tools";
import { loadEngine } from "@/lib/engine-registry";
import { compressToTargetSize } from "@/lib/target-search";
// 注册全部引擎（stub 兜底 + 真实图片引擎懒加载覆盖），页面加载即生效
import "@/lib/engines/index";
import {
  cn,
  downloadFile,
  formatFileSize,
  friendlyError,
  generateId,
  getExtension,
} from "@/lib/utils";
import type { FileTask, QualitySetting } from "@/types";

const ENGINE_LABEL: Record<EngineKey, string> = {
  mozjpeg: "MozJPEG",
  png: "Oxipng",
  webp: "WebP",
  avif: "AVIF",
  svgo: "SVGO",
  gifsicle: "Gifsicle",
  ghostscript: "Ghostscript",
  "pdf-struct": "结构压缩",
  webcodecs: "WebCodecs",
  ffmpeg: "FFmpeg",
};

const QUALITY_OPTIONS: QualitySetting[] = [
  { key: "max", value: 30 },
  { key: "recommended", value: 60 },
  { key: "high", value: 80 },
];

/** 并发池：同时最多处理 limit 个任务 */
async function runPool(
  tasks: FileTask[],
  limit: number,
  worker: (t: FileTask) => Promise<void>
) {
  const queue = [...tasks];
  const runners = Array.from({ length: Math.min(limit, queue.length) }, async () => {
    while (queue.length > 0) {
      const task = queue.shift();
      if (task) await worker(task);
    }
  });
  await Promise.all(runners);
}

interface CompressorHubProps {
  /** 限定接受的类别；不传则接受所有格式（混合首页） */
  category?: ToolCategory;
}

export function CompressorHub({ category }: CompressorHubProps) {
  const t = useTranslations("Home");
  const tt = useTranslations("Tool");
  const te = useTranslations("Error");
  const [tasks, setTasks] = useState<FileTask[]>([]);
  const [quality, setQuality] = useState<QualitySetting>(
    QUALITY_OPTIONS[1]
  );
  /** P5c 目标尺寸（KB），填入后对所有待处理任务生效，自动二分搜索最接近的质量档位 */
  const [targetKb, setTargetKb] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const processingRef = useRef(false);

  const updateTask = useCallback((id: string, patch: Partial<FileTask>) => {
    setTasks((prev) => prev.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  }, []);

  const addFiles = useCallback(
    (files: File[]) => {
      const newTasks: FileTask[] = files.map((file) => {
        const ext = getExtension(file.name);
        const engine = detectEngine(file.name);
        // 混合首页接受所有已识别格式；独立页限定类别
        const allowed =
          engine !== null &&
          (!category || getCategoryForExt(ext) === category);
        return {
          id: generateId(),
          name: file.name,
          file,
          engine: allowed ? engine : null,
          status: allowed ? "pending" : "failed",
          progress: allowed ? 0 : 100,
          originalSize: file.size,
          compressedSize: null,
          outputBlob: null,
          error: allowed ? null : te("unsupported", { ext: `.${ext}` }),
        };
      });
      setTasks((prev) => [...prev, ...newTasks]);
    },
    [category, te]
  );

  const processOne = useCallback(
    async (task: FileTask) => {
      // 仅处理 pending 任务（addFiles 已把不支持格式标为 failed）
      if (!task.engine || task.status !== "pending") return;
      try {
        updateTask(task.id, { status: "processing", progress: 0 });
        const engine = await loadEngine(task.engine);
        const targetBytes = task.targetSize ?? 0;
        const result =
          targetBytes > 0
            ? await compressToTargetSize(engine, task.file, targetBytes, (p) =>
                updateTask(task.id, { progress: p })
              )
            : await engine.compress(
                task.file,
                { quality: quality.value },
                (p) => updateTask(task.id, { progress: p })
              );
        // 结果不小于原文件时回退为原文件，避免"压缩后反而变大"的误导
        const better = result.blob.size < task.file.size;
        updateTask(task.id, {
          status: "completed",
          progress: 100,
          outputBlob: better ? result.blob : task.file,
          compressedSize: better ? result.size : task.file.size,
        });
      } catch (err) {
        updateTask(task.id, {
          status: "failed",
          error: friendlyError(err, "处理失败，请重试。"),
        });
      }
    },
    [quality, updateTask]
  );

  const startCompress = useCallback(async () => {
    if (processingRef.current) return;
    processingRef.current = true;
    setIsProcessing(true);

    const pending0 = tasks.filter((x) => x.status === "pending");
    // P5c：目标尺寸（KB）应用到全部待处理任务
    const kb = Number.parseInt(targetKb.trim(), 10);
    const targetBytes = Number.isFinite(kb) && kb > 0 ? kb * 1024 : 0;
    const pending =
      targetBytes > 0
        ? pending0.map((x) => ({ ...x, targetSize: targetBytes }))
        : pending0;
    if (targetBytes > 0) {
      setTasks((prev) =>
        prev.map((x) =>
          x.status === "pending" ? { ...x, targetSize: targetBytes } : x
        )
      );
    }
    // 视频（webcodecs/ffmpeg 转码）串行，避免内存峰值；其余并发 limit=3
    const videos = pending.filter(
      (x) => x.engine === "ffmpeg" || x.engine === "webcodecs"
    );
    const others = pending.filter(
      (x) => x.engine !== "ffmpeg" && x.engine !== "webcodecs"
    );

    try {
      await runPool(others, 3, processOne);
      for (const task of videos) await processOne(task);
    } finally {
      processingRef.current = false;
      setIsProcessing(false);
    }
  }, [tasks, processOne, targetKb]);

  const removeTask = useCallback(
    (id: string) => setTasks((prev) => prev.filter((x) => x.id !== id)),
    []
  );

  const clearAll = useCallback(() => {
    if (processingRef.current) return;
    setTasks([]);
  }, []);

  const handleDownloadOne = useCallback((task: FileTask) => {
    if (task.outputBlob) downloadFile(task.outputBlob, task.name);
  }, []);

  const handleDownloadAll = useCallback(async () => {
    const done = tasks.filter((x) => x.status === "completed" && x.outputBlob);
    if (done.length === 0) return;
    if (done.length === 1) {
      downloadFile(done[0].outputBlob!, done[0].name);
      return;
    }
    const files: Record<string, Uint8Array> = {};
    const used = new Set<string>();
    for (const task of done) {
      let name = task.name;
      let i = 1;
      while (used.has(name)) {
        const dot = task.name.lastIndexOf(".");
        name =
          (dot > 0 ? task.name.slice(0, dot) : task.name) +
          ` (${i++})` +
          (dot > 0 ? task.name.slice(dot) : "");
      }
      used.add(name);
      files[name] = new Uint8Array(await task.outputBlob!.arrayBuffer());
    }
    const zipped = zipSync(files);
    downloadFile(
      new Blob([zipped], { type: "application/zip" }),
      "filepomelo-compressed.zip"
    );
  }, [tasks]);

  const pendingCount = tasks.filter((x) => x.status === "pending").length;
  const completedCount = tasks.filter((x) => x.status === "completed" && x.outputBlob).length;

  return (
    <div className="space-y-6">
      <DropZone onFilesSelected={addFiles} />

      {/* 压缩档位 */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm text-gray-500">{t("qualityLabel")}</span>
        {QUALITY_OPTIONS.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setQuality(opt)}
            className={cn(
              "rounded-full border px-4 py-1.5 text-sm transition-colors",
              quality.key === opt.key
                ? "border-primary bg-primary/10 text-primary font-medium"
                : "border-gray-200 text-gray-500 hover:border-primary/50"
            )}
          >
            {opt.key === "max" && tt("qualityMax")}
            {opt.key === "recommended" && tt("qualityRecommended")}
            {opt.key === "high" && tt("qualityHigh")}
          </button>
        ))}
        {/* P5c 目标尺寸模式：填入后自动二分搜索最接近目标体积的质量档位 */}
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-gray-500">{t("targetSizeLabel")}</span>
          <input
            type="number"
            min={1}
            value={targetKb}
            onChange={(e) => setTargetKb(e.target.value)}
            placeholder={t("targetSizePlaceholder")}
            className="w-24 rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-sm text-gray-700 outline-none transition-colors focus:border-primary"
          />
          <span className="text-xs text-gray-400">{t("targetSizeUnit")}</span>
        </div>
      </div>

      {/* 任务列表 */}
      {tasks.length > 0 && (
        <div className="overflow-hidden rounded-2xl border bg-white shadow-sm">
          <div className="flex items-center justify-between border-b bg-gray-50/80 px-4 py-3">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileIcon className="h-4 w-4 text-primary" />
              {t("taskCount", { count: tasks.length })}
              {isProcessing && (
                <Loader2 className="h-4 w-4 animate-spin text-primary" />
              )}
            </div>
            <button
              onClick={clearAll}
              disabled={isProcessing}
              className="flex items-center gap-1 text-xs text-gray-400 transition-colors hover:text-red-500 disabled:opacity-40"
            >
              <Trash2 className="h-3.5 w-3.5" />
              {t("clearAll")}
            </button>
          </div>

          <div className="max-h-[26rem] divide-y overflow-y-auto">
            {tasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3 px-4 py-3">
                <FileIcon className="h-4 w-4 flex-shrink-0 text-gray-400" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-gray-700">
                      {task.name}
                    </p>
                    {task.engine && (
                      <span className="flex-shrink-0 rounded bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium text-gray-500">
                        {ENGINE_LABEL[task.engine]}
                      </span>
                    )}
                  </div>
                  <div className="mt-1 flex items-center gap-2 text-xs text-gray-400">
                    <span>{formatFileSize(task.originalSize)}</span>
                    {task.status === "completed" && task.compressedSize != null && (
                      <>
                        <span>→</span>
                        <span className="text-green-600 font-medium">
                          {formatFileSize(task.compressedSize)}
                        </span>
                        {task.originalSize > 0 &&
                          task.compressedSize < task.originalSize && (
                            <span className="text-green-500">
                              (−{Math.round((1 - task.compressedSize / task.originalSize) * 100)}%)
                            </span>
                          )}
                        {task.targetSize &&
                          (task.compressedSize <= task.targetSize ? (
                            <span className="text-green-600 font-medium">
                              ≤ {(task.targetSize / 1024).toFixed(0)}
                              {t("targetSizeUnit")}
                            </span>
                          ) : (
                            <span className="text-amber-500">
                              &gt; {(task.targetSize / 1024).toFixed(0)}
                              {t("targetSizeUnit")}
                            </span>
                          ))}
                      </>
                    )}
                    {task.status === "processing" && (
                      <span className="text-primary">{task.progress}%</span>
                    )}
                  </div>
                  {/* 进度条 */}
                  {task.status === "processing" && (
                    <div className="mt-1.5 h-1 w-full overflow-hidden rounded-full bg-gray-100">
                      <div
                        className="h-full rounded-full bg-primary transition-all duration-200"
                        style={{ width: `${task.progress}%` }}
                      />
                    </div>
                  )}
                  {task.status === "failed" && task.error && (
                    <p className="mt-1 truncate text-xs text-red-500">{task.error}</p>
                  )}
                </div>

                <div className="flex flex-shrink-0 items-center gap-1.5">
                  {task.status === "pending" && (
                    <Clock className="h-4 w-4 text-gray-300" />
                  )}
                  {task.status === "processing" && (
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  )}
                  {task.status === "completed" && (
                    <>
                      <button
                        onClick={() => handleDownloadOne(task)}
                        className="flex items-center gap-1 rounded-lg bg-primary/10 px-2.5 py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                      >
                        <Download className="h-3.5 w-3.5" />
                        {t("download")}
                      </button>
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    </>
                  )}
                  {task.status === "failed" && (
                    <XCircle className="h-4 w-4 text-red-400" />
                  )}
                  {!isProcessing && task.status !== "processing" && (
                    <button
                      onClick={() => removeTask(task.id)}
                      className="text-gray-300 transition-colors hover:text-red-500"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 操作按钮 */}
      {(pendingCount > 0 || completedCount > 0) && (
        <div className="flex flex-col gap-3 sm:flex-row">
          {pendingCount > 0 && (
            <button
              onClick={startCompress}
              disabled={isProcessing}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-primary to-emerald-500 px-6 py-3 text-sm font-semibold text-white shadow-soft transition-all hover:from-primary/90 hover:to-emerald-500/90 active:scale-[0.98] disabled:opacity-60"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  {t("compressing")}
                </>
              ) : (
                <>
                  <Play className="h-4 w-4" />
                  {t("startCompress")} ({pendingCount})
                </>
              )}
            </button>
          )}
          {completedCount > 0 && (
            <button
              onClick={handleDownloadAll}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-primary/30 bg-primary/5 px-6 py-3 text-sm font-semibold text-primary transition-all hover:bg-primary/10 active:scale-[0.98]"
            >
              <Package className="h-4 w-4" />
              {completedCount > 1
                ? `${t("downloadAll")} · ${completedCount}`
                : t("download")}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
