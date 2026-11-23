import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import { ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { routing } from "@/i18n/routing";
import { GUIDES, guidePath } from "@/content/guides";
import { GUIDE_UI } from "@/components/guides/guide-article";

const BASE = "https://compress.aixuno.com";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const ui = GUIDE_UI[locale === "en" ? "en" : "zh"];
  const path = "/guides/";
  const url = `${BASE}/${locale}${path}`;
  const title = `${ui.listTitle} — FilePomelo`;
  return {
    metadataBase: new URL(BASE),
    title,
    description: ui.listDesc,
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
      description: ui.listDesc,
      siteName: "FilePomelo",
      type: "website",
      locale: locale === "en" ? "en_US" : "zh_CN",
      url,
      images: [{ url: `${BASE}/og-image.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: ui.listDesc,
      images: [`${BASE}/og-image.png`],
    },
  };
}

export default function GuidesPage({ params }: { params: { locale: string } }) {
  const { locale } = params;
  setRequestLocale(locale);
  const lang = locale === "en" ? "en" : "zh";
  const ui = GUIDE_UI[lang];
  const listUrl = `${BASE}/${locale}/guides/`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500">
            <Link href="/" className="transition-colors hover:text-primary">
              {ui.home}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-gray-900">{ui.guides}</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">{ui.listTitle}</h1>
        <p className="mt-2 max-w-2xl text-gray-500">{ui.listDesc}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {GUIDES.map((guide) => {
            const content = guide[lang];
            return (
              <Link
                key={guide.slug}
                href={guidePath(guide.slug)}
                className="flex flex-col rounded-2xl border bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
              >
                <span className="inline-flex w-fit rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  {guide.toolName[lang]}
                </span>
                <h2 className="mt-3 text-base font-semibold leading-6 text-gray-900">
                  {content.title}
                </h2>
                <p className="mt-2 flex-1 text-sm leading-6 text-gray-500">{content.summary}</p>
                <span className="mt-4 text-xs text-gray-400">
                  {ui.updated} {guide.dateModified}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@graph": [
              {
                "@type": "CollectionPage",
                name: ui.listTitle,
                description: ui.listDesc,
                url: listUrl,
                inLanguage: lang === "en" ? "en-US" : "zh-CN",
                hasPart: GUIDES.map((guide) => ({
                  "@type": "Article",
                  headline: guide[lang].title,
                  url: `${BASE}/${locale}${guidePath(guide.slug)}`,
                })),
              },
              {
                "@type": "BreadcrumbList",
                itemListElement: [
                  {
                    "@type": "ListItem",
                    position: 1,
                    name: ui.home,
                    item: `${BASE}/${locale}/`,
                  },
                  {
                    "@type": "ListItem",
                    position: 2,
                    name: ui.guides,
                    item: listUrl,
                  },
                ],
              },
            ],
          }).replace(/</g, "\\u003c"),
        }}
      />
    </div>
  );
}
