import type { EngineKey } from "@/config/tools";

export interface CompressOptions {
  /** 质量 0-100 */
  quality: number;
}

export interface CompressResult {
  blob: Blob;
  size: number;
  /** 是否经过真实压缩（P1 桩引擎为 false） */
  real?: boolean;
}

/**
 * 引擎处理单元。P1 仅注册桩引擎打通管线；
 * P2 起各格式接入真实 wasm 实现，以同名 key 覆盖注册。
 */
export interface EngineHandler {
  key: EngineKey;
  compress(
    file: File,
    options: CompressOptions,
    onProgress: (p: number) => void
  ): Promise<CompressResult>;
}

type EngineFactory = () => Promise<EngineHandler>;

const factories = new Map<EngineKey, EngineFactory>();
const instances = new Map<EngineKey, EngineHandler>();

/** 注册引擎工厂（动态 import 懒加载）。同名 key 后注册覆盖先注册。 */
export function registerEngine(key: EngineKey, factory: EngineFactory) {
  factories.set(key, factory);
  // 覆盖注册时清除已缓存实例，确保下次 loadEngine 用新 factory
  // （防止 stub 已被实例化后真实引擎覆盖无效）
  instances.delete(key);
}

/** 获取（并缓存）引擎实例，只加载一次 */
export async function loadEngine(key: EngineKey): Promise<EngineHandler> {
  let inst = instances.get(key);
  if (!inst) {
    const factory = factories.get(key);
    if (!factory) {
      throw new Error(`No engine registered for "${key}"`);
    }
    inst = await factory();
    instances.set(key, inst);
  }
  return inst;
}

export function hasEngine(key: EngineKey): boolean {
  return factories.has(key);
}
