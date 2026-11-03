import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { ToolCard } from "@/components/home/tool-card";
import { TOOLS } from "@/config/tools";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "Tools" });
  const base = "https://compress.aixuno.com";
  const path = "/tools/";
  const title = `${t("title")} — FilePomelo`;
  const description = t("description");
  return {
    metadataBase: new URL(base),
    title,
    description,
    alternates: {
      canonical: `${base}/${locale}${path}`,
      languages: {
        "zh-CN": `${base}/zh${path}`,
        "en-US": `${base}/en${path}`,
        "x-default": `${base}/zh${path}`,
      },
    },
    openGraph: {
      title,
      description,
      siteName: "FilePomelo",
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      url: `${base}/${locale}${path}`,
      images: [{ url: `${base}/og-image.png`, width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [`${base}/og-image.png`],
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ToolsPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Tools" });

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
        <p className="mt-2 text-gray-500">{t("description")}</p>
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {TOOLS.map((tool) => (
            <ToolCard key={tool.id} tool={tool} />
          ))}
        </div>
      </div>
    </div>
  );
}
