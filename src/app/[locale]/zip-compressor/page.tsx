import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ZipCompressor } from "@/components/home/zip-compressor";
import { getTool } from "@/config/tools";
import { routing } from "@/i18n/routing";

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "Tool" });
  const base = "https://compress.aixuno.com";
  const path = "/zip-compressor/";
  const title = `${t("zip")} — FilePomelo`;
  const description = t("zipDesc");
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

export default async function ZipCompressorPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);
  const tool = getTool("zip")!;
  return (
    <ToolLayout tool={tool}>
      <ZipCompressor />
    </ToolLayout>
  );
}
