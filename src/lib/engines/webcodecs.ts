import type { EngineHandler } from "@/lib/engine-registry";
import { getExtension } from "@/lib/utils";

/**
 * WebCodecs + Mediabunny 音视频压缩引擎（P4）。
 *
 * 为什么换掉 ffmpeg 单线程：
 * - WebCodecs 是浏览器原生 API，调用硬件编码器（Intel QSV / Apple VideoToolbox / NVENC），
 *   接近实时，且无需 COOP/COEP 响应头（GitHub Pages 可用）。
 * - mediabunny：纯 TS、零依赖的 WebCodecs 封装，MP4/MOV/MKV/WebM/OGG/AAC 容器读写 + 编码能力探测。
 *
 * 覆盖格式（第一版）：
 * - 视频 mp4/mov/mkv/webm → 同容器硬件重编码（mp4/mov/mkv→H.264；webm→VP9）
 * - 音频 aac/ogg → AAC/Opus 重编码
 * 浏览器编码能力不足时抛明确错误（后续接入 ffmpeg 兜底）。
 * 输出容器与输入扩展名一致，保证下载文件可正常播放。
 */

const VIDEO_EXT = new Set(["mp4", "mov", "mkv", "webm"]);
const AUDIO_EXT = new Set(["aac", "ogg"]);

/** 视频 quality(0-100) → 目标码率（bps） */
function videoBitrate(q: number): number {
  if (q <= 35) return 2_500_000; // 最大压缩
  if (q <= 70) return 5_000_000; // 推荐
  return 8_000_000; // 高质量
}

/** 音频 quality(0-100) → 目标码率（bps） */
function audioBitrate(q: number): number {
  if (q <= 35) return 96_000;
  if (q <= 70) return 128_000;
  return 192_000;
}

/** 运行时动态 import mediabunny（tree-shakable，仅本引擎用到） */
interface MbApi {
  Input: new (o: unknown) => { computeDuration(): Promise<number> };
  Output: new (o: unknown) => { target: { buffer: Uint8Array } };
  BlobSource: new (file: Blob) => unknown;
  BufferTarget: new () => unknown;
  Conversion: {
    init(o: unknown): Promise<{
      isValid: boolean;
      onProgress: ((p: number, t: number) => unknown) | null;
      execute(): Promise<void>;
    }>;
  };
  Quality: new (o: { bitrate: number }) => unknown;
  Mp4OutputFormat: new () => { getSupportedVideoCodecs(): string[] };
  WebMOutputFormat: new () => { getSupportedVideoCodecs(): string[] };
  MkvOutputFormat: new () => { getSupportedVideoCodecs(): string[] };
  AdtsOutputFormat: new () => unknown;
  OggOutputFormat: new () => unknown;
  ALL_FORMATS: unknown;
  getFirstEncodableVideoCodec(list: string[]): Promise<string | null>;
  getFirstEncodableAudioCodec(list: string[]): Promise<string | null>;
}

let mbPromise: Promise<MbApi> | null = null;
function getMb(): Promise<MbApi> {
  if (!mbPromise) {
    mbPromise = import("mediabunny") as Promise<MbApi>;
  }
  return mbPromise;
}

function outputFormatForExt(mb: MbApi, ext: string): unknown {
  if (ext === "webm") return new mb.WebMOutputFormat();
  if (ext === "mkv") return new mb.MkvOutputFormat();
  return new mb.Mp4OutputFormat();
}

async function compressVideo(
  file: File,
  quality: number,
  onProgress: (p: number) => void
) {
  const mb = await getMb();
  const ext = getExtension(file.name);
  onProgress(5);

  const outputFormat = outputFormatForExt(mb, ext) as {
    getSupportedVideoCodecs(): string[];
  };
  const candidates = outputFormat.getSupportedVideoCodecs();
  const codec = await mb.getFirstEncodableVideoCodec(candidates);
  if (!codec) {
    throw new Error("当前浏览器不支持视频硬件编码，请更换 Chrome/Edge/Safari 后重试。");
  }
  onProgress(15);

  const input = new mb.Input({
    source: new mb.BlobSource(file),
    formats: mb.ALL_FORMATS,
  });
  const output = new mb.Output({
    format: outputFormat,
    target: new mb.BufferTarget(),
  });

  const conversion = await mb.Conversion.init({
    input,
    output,
    video: {
      codec,
      quality: new mb.Quality({ bitrate: videoBitrate(quality) }),
      forceTranscode: true,
    },
  });

  if (!conversion.isValid) {
    throw new Error("无法解码该视频，请确认文件未损坏或更换格式后重试。");
  }

  conversion.onProgress = (p: number) =>
    onProgress(20 + Math.round(p * 75));

  await conversion.execute();
  // slice() 拷贝为 Uint8Array<ArrayBuffer>，满足 BlobPart 类型约束（buffer 可能为 SharedArrayBuffer）
  const bytes = output.target.buffer.slice();
  return new Blob([bytes], { type: "video/mp4" });
}

async function compressAudio(
  file: File,
  quality: number,
  onProgress: (p: number) => void
) {
  const mb = await getMb();
  const ext = getExtension(file.name);
  onProgress(5);

  const isAac = ext === "aac";
  const codec = await mb.getFirstEncodableAudioCodec(isAac ? ["aac"] : ["opus", "vorbis"]);
  if (!codec) {
    throw new Error("当前浏览器不支持该音频编码，请更换 Chrome/Edge/Safari 后重试。");
  }
  onProgress(15);

  const input = new mb.Input({
    source: new mb.BlobSource(file),
    formats: mb.ALL_FORMATS,
  });
  const output = new mb.Output({
    format: isAac ? new mb.AdtsOutputFormat() : new mb.OggOutputFormat(),
    target: new mb.BufferTarget(),
  });

  const conversion = await mb.Conversion.init({
    input,
    output,
    audio: {
      codec,
      quality: new mb.Quality({ bitrate: audioBitrate(quality) }),
      forceTranscode: true,
    },
    video: { discard: true },
  });

  if (!conversion.isValid) {
    throw new Error("无法解码该音频，请确认文件未损坏或更换格式后重试。");
  }

  conversion.onProgress = (p: number) =>
    onProgress(20 + Math.round(p * 75));

  await conversion.execute();
  const bytes = output.target.buffer.slice();
  return new Blob([bytes], { type: isAac ? "audio/aac" : "audio/ogg" });
}

export function createWebCodecsEngine(): EngineHandler {
  return {
    key: "webcodecs",
    async compress(file, options, onProgress) {
      const ext = getExtension(file.name);
      let blob: Blob;
      if (VIDEO_EXT.has(ext)) {
        blob = await compressVideo(file, options.quality, onProgress);
      } else if (AUDIO_EXT.has(ext)) {
        blob = await compressAudio(file, options.quality, onProgress);
      } else {
        throw new Error(`暂不支持 ${ext.toUpperCase()} 格式压缩。`);
      }
      onProgress(100);
      return { blob, size: blob.size, real: true };
    },
  };
}
