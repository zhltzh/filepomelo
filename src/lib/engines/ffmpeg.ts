import type { EngineHandler } from "@/lib/engine-registry";
import { generateId, getExtension } from "@/lib/utils";
import { asset } from "@/lib/base-path";

/**
 * FFmpeg 兜底引擎（WebCodecs 无法处理的格式）：
 * - 音频 mp3/wma → MP3 重编码降码率
 * - 视频 flv/3gp/ogv → H.264 MP4 重编码
 * 通过 Web Worker 运行（ffmpeg-core exec 同步阻塞，放主线程会冻结 UI），
 * worker 单例复用，首次压缩时懒加载 ffmpeg-core.wasm（32MB）。
 */

/** 视频类扩展名（其余走音频） */
const VIDEO_EXT = new Set(["flv", "3gp", "ogv"]);

interface WorkerReply {
  id: string;
  success: boolean;
  output?: ArrayBuffer;
  mime?: string;
  error?: string;
}
interface WorkerProgress {
  id: string;
  type: "progress";
  progress: number;
}

let workerPromise: Promise<Worker> | null = null;
function getWorker(): Promise<Worker> {
  if (!workerPromise) {
    workerPromise = Promise.resolve(
      new Worker(asset("/ffmpeg-worker.mjs"), { type: "module" })
    );
  }
  return workerPromise;
}

export function createFfmpegEngine(): EngineHandler {
  return {
    key: "ffmpeg",
    async compress(file, options, onProgress) {
      onProgress(5);
      const worker = await getWorker();
      const kind: "audio" | "video" = VIDEO_EXT.has(getExtension(file.name))
        ? "video"
        : "audio";
      const input = new Uint8Array(await file.arrayBuffer());
      onProgress(10);

      const result = await new Promise<Blob>((resolve, reject) => {
        const id = generateId();
        let settled = false;
        const settle = () => {
          if (settled) return;
          settled = true;
          worker.removeEventListener("message", onMsg);
          worker.removeEventListener("error", onErr);
        };
        const onMsg = (e: MessageEvent<WorkerReply | WorkerProgress>) => {
          if (e.data.id !== id) return;
          if ((e.data as WorkerProgress).type === "progress") {
            onProgress(10 + Math.round((e.data as WorkerProgress).progress * 80));
            return;
          }
          const reply = e.data as WorkerReply;
          settle();
          if (reply.success && reply.output) {
            resolve(new Blob([reply.output], { type: reply.mime || "application/octet-stream" }));
          } else {
            reject(new Error(reply.error || "FFmpeg 压缩失败"));
          }
        };
        const onErr = (e: ErrorEvent) => {
          settle();
          reject(new Error(e.message || "FFmpeg 压缩 worker 异常"));
        };
        worker.addEventListener("message", onMsg);
        worker.addEventListener("error", onErr);
        worker.postMessage({ id, input, kind, quality: options.quality }, [input.buffer]);
      });

      onProgress(100);
      return { blob: result, size: result.size, real: true };
    },
  };
}
