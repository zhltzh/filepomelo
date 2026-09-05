import type {
  CompressResult,
  EngineHandler,
} from "@/lib/engine-registry";

/**
 * 目标尺寸压缩（P5c）：二分搜索 quality（1..100），
 * 找到"输出 ≤ 目标字节"的最大质量档位。
 *
 * 单调性假设：有损引擎 quality↑ → 输出文件↑（图片/PDF/视频/音频均符合）。
 * 最多 ITER 次压缩尝试；若无档位满足目标，返回最后一次（最接近目标）的结果。
 */
export async function compressToTargetSize(
  engine: EngineHandler,
  file: File,
  targetBytes: number,
  onProgress: (p: number) => void
): Promise<CompressResult> {
  const ITER = 6;
  let lo = 1;
  let hi = 100;
  let best: CompressResult | null = null;
  let last: CompressResult | null = null;

  for (let i = 0; i < ITER; i++) {
    const mid = Math.round((lo + hi) / 2);
    const base = Math.round((i / ITER) * 90);
    const result = await engine.compress(file, { quality: mid }, (p) =>
      onProgress(base + Math.round((p / 100) * (90 / ITER)))
    );
    last = result;
    if (result.size <= targetBytes) {
      // 满足目标 → 记下并尝试更高质量
      best = result;
      lo = mid + 1;
    } else {
      // 超出目标 → 降低质量
      hi = mid - 1;
    }
  }

  onProgress(100);
  return (best ?? last)!;
}
