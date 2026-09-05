import type { EngineHandler } from "@/lib/engine-registry";
import { generateId } from "@/lib/utils";
import { asset } from "@/lib/base-path";

/**
 * Ghostscript PDF 压缩引擎。
 * 通过 Web Worker 运行（gs.js 的 callMain 是同步调用，放主线程会冻结 UI）。
 * worker 单例复用，首次压缩时创建并懒加载 gs.wasm（15.5MB）。
 */

interface WorkerReply {
  id: string;
  success: boolean;
  output?: ArrayBuffer;
  error?: string;
}

let workerPromise: Promise<Worker> | null = null;
function getWorker(): Promise<Worker> {
  if (!workerPromise) {
    workerPromise = Promise.resolve(
      new Worker(asset("/ghostscript-worker.mjs"), { type: "module" })
    );
  }
  return workerPromise;
}

/** quality 档位 → Ghostscript -dPDFSETTINGS preset */
function qualityToPreset(quality: number): "screen" | "ebook" | "printer" {
  if (quality <= 35) return "screen";
  if (quality <= 70) return "ebook";
  return "printer";
}

export function createGhostscriptEngine(): EngineHandler {
  return {
    key: "ghostscript",
    async compress(file, options, onProgress) {
      onProgress(10);
      const worker = await getWorker();
      onProgress(20);
      const input = new Uint8Array(await file.arrayBuffer());
      const preset = qualityToPreset(options.quality);

      const result = await new Promise<Blob>((resolve, reject) => {
        const id = generateId();
        let settled = false;
        // gs.js 加载与 callMain 无进度回调：轻量模拟进度提供"处理中"反馈
        const timer = setInterval(
          () => onProgress(Math.min(85, 25 + Math.random() * 8)),
          300
        );
        const settle = () => {
          if (settled) return;
          settled = true;
          clearInterval(timer);
          worker.removeEventListener("message", onMsg);
          worker.removeEventListener("error", onErr);
        };
        const onMsg = (e: MessageEvent<WorkerReply>) => {
          if (e.data.id !== id) return;
          settle();
          if (e.data.success && e.data.output) {
            resolve(new Blob([e.data.output], { type: "application/pdf" }));
          } else {
            reject(new Error(e.data.error || "PDF 压缩失败"));
          }
        };
        const onErr = (e: ErrorEvent) => {
          settle();
          reject(new Error(e.message || "PDF 压缩 worker 异常"));
        };
        worker.addEventListener("message", onMsg);
        worker.addEventListener("error", onErr);
        worker.postMessage({ id, input, preset }, [input.buffer]);
      });

      onProgress(100);
      return { blob: result, size: result.size, real: true };
    },
  };
}
