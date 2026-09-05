import type { EngineKey } from "@/config/tools";

export type TaskStatus = "pending" | "processing" | "completed" | "failed";

export interface FileTask {
  id: string;
  name: string;
  file: File;
  /** 分发到的引擎，null = 不支持 */
  engine: EngineKey | null;
  status: TaskStatus;
  /** 0-100 */
  progress: number;
  originalSize: number;
  compressedSize: number | null;
  outputBlob: Blob | null;
  error: string | null;
  /** P5c 目标尺寸模式：期望输出 ≤ 该字节数（可选，设置后忽略全局质量档位） */
  targetSize?: number;
}

/** 压缩档位 */
export interface QualitySetting {
  /** 0-100 传给引擎的质量值 */
  value: number;
  key: "max" | "recommended" | "high";
}
