"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

/**
 * 根路径 landing：静态导出无法做服务端语言重定向，
 * 这里用客户端脚本按浏览器语言跳转，并提供手动选择兜底。
 */
export default function RootLanding() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const lang = (navigator.language || "zh").toLowerCase();
    const target = lang.startsWith("zh") ? "/zh/" : "/en/";
    window.location.replace(target);
  }, []);

  useEffect(() => {
    // 给自动跳转一个窗口，之后展示手动选择
    const t = setTimeout(() => setReady(true), 800);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-white px-6 text-center">
      <div className="text-3xl font-bold text-gray-900">FilePomelo</div>
      <p className="mt-2 text-sm text-gray-500">
        正在进入 FilePomelo… / Redirecting…
      </p>

      {ready && (
        <div className="mt-8 animate-fade-in">
          <div className="text-xs text-gray-400">选择语言 / Choose language</div>
          <div className="mt-3 flex gap-3">
            <Link
              href="/zh/"
              className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary"
            >
              中文
            </Link>
            <Link
              href="/en/"
              className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:border-primary hover:text-primary"
            >
              English
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
