import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getGuide, guidePath } from "@/content/guides";
import type { Guide, GuideContent, GuideLocale } from "@/content/guides/types";
import { GuideBlocks } from "./guide-body";

const BASE = "https://compress.aixuno.com";

export const GUIDE_UI = {
  zh: {
    home: "首页",
    guides: "教程",
    faqTitle: "常见问题",
    relatedTitle: "相关教程",
    allGuides: "查看全部教程",
    updated: "更新于",
    tool: "对应工具",
    listTitle: "压缩与转换教程",
    listDesc:
      "视频、音频、ZIP、字体压缩的实操教程：每一步都在浏览器本地完成，文件不上传服务器。",
    backToList: "返回教程列表",
  },
  en: {
    home: "Home",
    guides: "Guides",
    faqTitle: "FAQ",
    relatedTitle: "Related guides",
    allGuides: "View all guides",
    updated: "Updated",
    tool: "Tool",
    listTitle: "Compression & Conversion Guides",
    listDesc:
      "Hands-on guides for video, audio, ZIP and font compression. Every step runs locally in your browser.",
    backToList: "Back to all guides",
  },
} as const;

export function GuideArticle({
  guide,
  locale,
  content,
}: {
  guide: Guide;
  locale: GuideLocale;
  content: GuideContent;
}) {
  const ui = GUIDE_UI[locale];
  const url = `${BASE}/${locale}/guides/${guide.slug}/`;
  const listUrl = `${BASE}/${locale}/guides/`;
  const homeUrl = `${BASE}/${locale}/`;
  const related = guide.related
    .map((slug) => getGuide(slug))
    .filter((item): item is Guide => Boolean(item));

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 面包屑 */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-3xl px-4 py-3 sm:px-6">
          <nav className="flex flex-wrap items-center gap-1.5 text-sm text-gray-500">
            <Link href="/" className="transition-colors hover:text-primary">
              {ui.home}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/guides" className="transition-colors hover:text-primary">
              {ui.guides}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="line-clamp-1 font-medium text-gray-900">{content.title}</span>
          </nav>
        </div>
      </div>

      <article className="mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-10">
        <h1 className="text-2xl font-bold leading-snug text-gray-900 sm:text-3xl sm:leading-tight">
          {content.title}
        </h1>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
          <span>
            {ui.updated} {guide.dateModified}
          </span>
          <Link href={`/${guide.toolSlug}/`} className="font-medium text-primary hover:underline">
            {ui.tool}: {guide.toolName[locale]}
          </Link>
        </div>

        <div className="mt-6">
          <GuideBlocks blocks={content.blocks} locale={locale} />
        </div>

        {/* FAQ */}
        <section className="mt-12" aria-label={ui.faqTitle}>
          <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{ui.faqTitle}</h2>
          <div className="mt-4 space-y-3">
            {content.faq.map((item) => (
              <details
                key={item.q}
                className="group rounded-xl border bg-white p-4 shadow-sm"
              >
                <summary className="cursor-pointer list-none font-semibold text-gray-900 marker:hidden">
                  {item.q}
                </summary>
                <p className="mt-2 text-sm leading-6 text-gray-600">{item.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* 相关教程 */}
        {related.length > 0 && (
          <section className="mt-12" aria-label={ui.relatedTitle}>
            <h2 className="text-xl font-bold text-gray-900 sm:text-2xl">{ui.relatedTitle}</h2>
            <div className="mt-4 space-y-3">
              {related.map((item) => {
                const summary = item[locale].summary;
                return (
                  <Link
                    key={item.slug}
                    href={guidePath(item.slug)}
                    className="flex items-center justify-between gap-4 rounded-xl border bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
                  >
                    <span>
                      <strong className="block text-sm font-semibold text-gray-900">
                        {item[locale].title}
                      </strong>
                      <small className="mt-0.5 block text-xs text-gray-500">{summary}</small>
                    </span>
                    <span aria-hidden="true" className="text-gray-400">
                      →
                    </span>
                  </Link>
                );
              })}
            </div>
            <p className="mt-4 text-sm">
              <Link href="/guides" className="font-medium text-primary hover:underline">
                {ui.allGuides}
              </Link>
            </p>
          </section>
        )}
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "Article",
                headline: content.title,
                description: content.description,
                url,
                mainEntityOfPage: { "@type": "WebPage", "@id": url },
                image: [`${BASE}/og-image.png`],
                datePublished: guide.datePublished,
                dateModified: guide.dateModified,
                inLanguage: locale === "en" ? "en-US" : "zh-CN",
                author: { "@type": "Organization", name: "FilePomelo", url: BASE },
                publisher: {
                  "@type": "Organization",
                  name: "Aixuno",
                  logo: { "@type": "ImageObject", url: "https://aixuno.com/apple-touch-icon.png" },
                },
              },
              {
                "@type": "FAQPage",
                mainEntity: content.faq.map((item) => ({
                  "@type": "Question",
                  name: item.q,
                  acceptedAnswer: { "@type": "Answer", text: item.a },
                })),
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: ui.home, item: homeUrl },
                  { "@type": "ListItem", position: 2, name: ui.guides, item: listUrl },
                  { "@type": "ListItem", position: 3, name: content.title, item: url },
                ],
              },
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
