import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { GUIDES, getGuide, guideContent } from "@/content/guides";
import { GuideArticle } from "@/components/guides/guide-article";

const BASE = "https://compress.aixuno.com";

/** 静态导出：中英 × 全部教程 slug */
export function generateStaticParams() {
  return routing.locales.flatMap((locale) =>
    GUIDES.map((guide) => ({ locale, slug: guide.slug }))
  );
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string; slug: string };
}): Promise<Metadata> {
  const { locale, slug } = params;
  const guide = getGuide(slug);
  if (!guide) return {};
  const content = guideContent(guide, locale);
  const path = `/guides/${guide.slug}/`;
  const url = `${BASE}/${locale}${path}`;
  const title = `${content.title} | FilePomelo`;
  return {
    metadataBase: new URL(BASE),
    title,
    description: content.description,
    alternates: {
      canonical: url,
      languages: {
        "zh-CN": `${BASE}/zh${path}`,
        "en-US": `${BASE}/en${path}`,
        "x-default": `${BASE}/zh${path}`,
      },
    },
    openGraph: {
      title,
      description: content.description,
      siteName: "FilePomelo",
      type: "article",
      locale: locale === "en" ? "en_US" : "zh_CN",
      url,
      images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630, alt: content.title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: content.description,
      images: [`${BASE}/og-image.png`],
    },
  };
}

export default function GuideDetailPage({
  params,
}: {
  params: { locale: string; slug: string };
}) {
  const { locale, slug } = params;
  setRequestLocale(locale);
  const guide = getGuide(slug);
  if (!guide) notFound();
  const lang = locale === "en" ? "en" : "zh";

  return <GuideArticle guide={guide} locale={lang} content={guide[lang]} />;
}
