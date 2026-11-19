import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { SiteNetwork } from "@/components/site-network";
import { ChunkReloadGuard } from "@/components/chunk-reload-guard";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "Meta" });
  const base = "https://compress.aixuno.com";
  // trailingSlash: true，实际 URL 带尾斜杠，canonical 必须一致避免重复内容
  const url = `${base}/${locale}/`;
  return {
    metadataBase: new URL(base),
    title: t("title"),
    description: t("description"),
    keywords: [t("keywords")],
    alternates: {
      canonical: url,
      languages: {
        "zh-CN": `${base}/zh/`,
        "en-US": `${base}/en/`,
        "x-default": `${base}/zh/`,
      },
    },
    openGraph: {
      title: t("title"),
      description: t("description"),
      siteName: "Aixuno Compress",
      type: "website",
      locale: locale === "zh" ? "zh_CN" : "en_US",
      url,
      images: [
        {
          url: `${base}/og-image.png`,
          width: 1200,
          height: 630,
          alt: "FilePomelo - 100% local file compressor",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [`${base}/og-image.png`],
    },
    icons: {
      icon: "/icon.svg",
    },
    manifest: "/manifest.webmanifest",
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  const { locale } = params;

  if (!routing.locales.includes(locale as (typeof routing.locales)[number])) {
    notFound();
  }

  // 启用静态渲染（配合 [locale] 段的 generateStaticParams）
  setRequestLocale(locale);

  // 显式传入 messages，保证 Client 组件（DropZone/ToolCard 等）在静态导出下也能拿到翻译
  const messages = await getMessages();

  return (
    <NextIntlClientProvider messages={messages}>
      <ChunkReloadGuard />
      <div className="flex min-h-screen flex-col">
        <SiteNetwork />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </div>
    </NextIntlClientProvider>
  );
}
