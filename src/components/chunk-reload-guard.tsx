"use client";

import { useEffect } from "react";

/**
 * 部署兜底：新版本发布后，仍持有旧 HTML/bundle 的用户在触发懒加载
 * （压缩引擎等 chunk）时会遇到 ChunkLoadError / chunk 404。
 * 这里全局兜底：首次失败自动刷新一次进入新版本，sessionStorage 防止死循环。
 */
export function ChunkReloadGuard() {
  useEffect(() => {
    const KEY = "fp_chunk_reload_at";
    const onChunkFailure = (msg: string) => {
      const last = Number(sessionStorage.getItem(KEY) || 0);
      if (Date.now() - last < 10_000) return; // 10s 内只兜底一次
      sessionStorage.setItem(KEY, String(Date.now()));
      // eslint-disable-next-line no-console
      console.warn("[filepomelo] new deployment detected, reloading:", msg);
      window.location.reload();
    };

    const onError = (e: ErrorEvent) => {
      if (/Loading chunk \d+ failed|ChunkLoadError|error loading dynamically imported module/i.test(e.message || "")) {
        onChunkFailure(e.message);
      }
    };
    const onRejection = (e: PromiseRejectionEvent) => {
      const m = String(e.reason?.message || e.reason || "");
      if (/Loading chunk \d+ failed|ChunkLoadError|error loading dynamically imported module|Failed to fetch dynamically imported module/i.test(m)) {
        onChunkFailure(m);
      }
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);
    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
