import Link from "next/link";
import type { Metadata } from "next";
import { HomeDropZone } from "@/components/home/home-drop-zone";

/**
 * 根路径直出中文内容页：保证 SEO 收录与直访体验，
 * 语言切换通过显式入口（/zh/ 与 /en/）完成，不再做自动跳转。
 */
export const metadata: Metadata = {
  title: "FilePomelo - 免费在线文件压缩器 | 图片、PDF、视频、音频本地压缩",
  description:
    "FilePomelo 提供完全免费的在线文件压缩工具：图片、PDF、视频、音频全部在浏览器本地压缩，无需上传服务器，保护你的文件隐私。",
  alternates: {
    canonical: "/",
    languages: {
      "zh-CN": "/zh/",
      en: "/en/",
      "x-default": "/",
    },
  },
};

const TOOLS = [
  { href: "/zh/image-compressor", name: "图片压缩", desc: "压缩 JPG、PNG、GIF、WebP、AVIF、SVG 图片" },
  { href: "/zh/image-converter", name: "图片格式转换", desc: "在 JPG、PNG、WebP、AVIF 之间互转图片格式" },
  { href: "/zh/pdf-compressor", name: "PDF 压缩", desc: "压缩 PDF 文件，减小体积" },
  { href: "/zh/video-compressor", name: "视频压缩", desc: "压缩 MP4、MOV、MKV、FLV 等视频" },
  { href: "/zh/audio-compressor", name: "音频压缩", desc: "压缩 MP3、OGG、AAC、WMA 等音频" },
  { href: "/zh/zip-compressor", name: "ZIP 压缩", desc: "把多个文件打包压缩成一个 ZIP，全部本地处理" },
  { href: "/zh/unzip", name: "ZIP 解压", desc: "在浏览器本地解压 ZIP 压缩包并下载其中的文件" },
  { href: "/zh/font-compressor", name: "字体压缩", desc: "把 TTF、OTF 字体压缩为 WOFF2 网页字体格式" },
];

const SITES = [
  { href: "https://aixuno.com/", name: "Markdown 转换" },
  { href: "https://image.aixuno.com/", name: "Pixkit 图片" },
  { href: "https://pdf.aixuno.com/", name: "PDF 工具" },
  { href: "https://bg.aixuno.com/", name: "AI 抠图" },
  { href: "https://scan.aixuno.com/", name: "文档扫描" },
  { href: "https://restore.aixuno.com/", name: "老照片修复" },
  { href: "https://watermark.aixuno.com/", name: "视频去水印" },
];

export default function RootHome() {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-gray-50 to-white">
      <header className="border-b border-gray-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <span className="text-lg font-bold text-gray-900">FilePomelo</span>
          <nav aria-label="语言切换" className="flex items-center gap-2 text-sm">
            <span className="rounded-lg bg-primary/10 px-3 py-1.5 font-medium text-primary">中文</span>
            <Link
              href="/en/"
              className="rounded-lg border border-gray-200 px-3 py-1.5 text-gray-600 transition-colors hover:border-primary hover:text-primary"
            >
              English
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <section className="text-center">
          <span className="inline-flex items-center rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
            100% 本地处理 · 文件不上传
          </span>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 sm:text-4xl">
            免费在线文件压缩器
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-gray-500 sm:text-base">
            图片、PDF、视频、音频全部在浏览器本地压缩，无需注册，文件不上传服务器。
          </p>
          <HomeDropZone />
        </section>

        <section aria-label="全部工具" className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="rounded-xl border border-gray-200 bg-white p-5 transition-colors hover:border-primary hover:shadow-md"
            >
              <strong className="block text-base font-semibold text-gray-900">{tool.name}</strong>
              <small className="mt-1.5 block text-xs leading-relaxed text-gray-500">{tool.desc}</small>
            </Link>
          ))}
        </section>

        <section className="mt-10 text-center">
          <Link
            href="/zh/tools"
            className="inline-flex items-center rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary/90"
          >
            浏览全部工具
          </Link>
        </section>

        <section aria-label="Aixuno 站群" className="mt-14 border-t border-gray-200 pt-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-gray-400">Aixuno 工具生态</div>
          <nav className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm text-gray-600">
            {SITES.map((site) => (
              <a key={site.href} href={site.href} className="transition-colors hover:text-primary">
                {site.name}
              </a>
            ))}
          </nav>
        </section>
      </main>

      <footer className="border-t border-gray-200 py-6 text-center text-xs text-gray-400">
        隐私优先 · 浏览器本地处理 ·{" "}
        <Link href="/zh/privacy" className="hover:text-gray-600">
          隐私政策
        </Link>
      </footer>
    </div>
  );
}
