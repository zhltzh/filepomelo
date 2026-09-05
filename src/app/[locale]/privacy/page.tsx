import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: { locale: string };
}): Promise<Metadata> {
  const { locale } = params;
  const t = await getTranslations({ locale, namespace: "Privacy" });
  return {
    title: t("metaTitle"),
    description: t("metaDescription"),
    alternates: { canonical: `https://filepomelo.com/${locale}/privacy` },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Privacy" });

  const sections: Array<{ k: string; d: string }> = [
    { k: "s1Title", d: "s1Desc" },
    { k: "s2Title", d: "s2Desc" },
    { k: "s3Title", d: "s3Desc" },
    { k: "s4Title", d: "s4Desc" },
    { k: "s5Title", d: "s5Desc" },
  ];

  return (
    <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900">{t("title")}</h1>
      <p className="mt-3 text-sm text-gray-500">{t("updated")}</p>
      <div className="mt-8 space-y-8">
        {sections.map(({ k, d }) => (
          <section key={k}>
            <h2 className="text-xl font-semibold text-gray-900">{t(k)}</h2>
            <p className="mt-2 leading-relaxed text-gray-600">{t(d)}</p>
          </section>
        ))}
      </div>
    </div>
  );
}
