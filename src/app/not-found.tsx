import Link from "next/link";

/** 全局 404 页（静态导出为 404.html） */
export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <div className="text-7xl font-extrabold text-blue-600">404</div>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">页面不存在</h1>
      <p className="mt-2 max-w-md text-gray-500">
        你访问的页面可能已被移动或删除。所有压缩都在浏览器本地完成，文件不会上传。
      </p>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
        <Link
          href="/zh/"
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          返回中文首页
        </Link>
        <Link
          href="/en/"
          className="rounded-xl border border-gray-200 px-6 py-3 text-sm font-semibold text-gray-700 transition-colors hover:border-blue-600 hover:text-blue-600"
        >
          English Home
        </Link>
      </div>
    </div>
  );
}
