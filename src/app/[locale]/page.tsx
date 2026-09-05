import { ShieldCheck, Shield, Zap, Gift, Layers, Boxes } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CompressorHub } from "@/components/home/compressor-hub";
import { ToolCard } from "@/components/home/tool-card";
import { TOOLS } from "@/config/tools";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function HomePage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "Home" });

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-blue-800">
        {/* 光晕 */}
        <div className="pointer-events-none absolute -top-28 right-[-6rem] h-96 w-96 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-28 left-[-4rem] h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="pointer-events-none absolute left-1/2 top-1/3 h-40 w-40 -translate-x-1/2 rounded-full bg-sky-400/10 blur-2xl" />
        <div className="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6 lg:px-8 sm:py-24">
          <span className="inline-flex animate-fade-in items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-400/10 px-4 py-1.5 text-sm font-medium text-emerald-200 backdrop-blur-sm">
            <ShieldCheck className="h-4 w-4" />
            {t("heroBadge")}
          </span>
          <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
            {t("heroTitlePre")}{" "}
            <span className="bg-gradient-to-r from-sky-300 via-blue-200 to-emerald-300 bg-clip-text text-transparent">
              {t("heroTitleGrad")}
            </span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-blue-100/85 sm:text-lg">
            {t("heroSubtitle")}
          </p>
          <p className="mt-5 text-xs text-blue-200/50 sm:text-sm">
            {t("supportedFormats")}
          </p>
        </div>
      </section>

      {/* 压缩操作区 */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <CompressorHub />
      </section>

      {/* 工具入口 */}
      <section className="border-t bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            {t("toolsTitle")}
          </h2>
          <p className="mt-2 text-center text-gray-500">{t("toolsDesc")}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {TOOLS.map((tool) => (
              <ToolCard key={tool.id} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* 特性：为什么选择 */}
      <section className="border-t bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900">
            {t("whyTitle")}
          </h2>
          <p className="mt-2 text-center text-gray-500">{t("whySubtitle")}</p>
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: ShieldCheck, k: "whyLocalTitle", d: "whyLocalDesc" },
              { icon: Gift, k: "whyFreeTitle", d: "whyFreeDesc" },
              { icon: Layers, k: "whyBatchTitle", d: "whyBatchDesc" },
              { icon: Boxes, k: "whyFormatsTitle", d: "whyFormatsDesc" },
            ].map(({ icon: Icon, k, d }) => (
              <div
                key={k}
                className="rounded-2xl border bg-white p-6 text-center shadow-sm"
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mt-4 font-semibold text-gray-900">{t(k)}</h3>
                <p className="mt-1 text-sm text-gray-500">{t(d)}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 隐私承诺 */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-white p-8 text-center sm:p-10">
          <Shield className="mx-auto h-10 w-10 text-green-500" />
          <h2 className="mt-4 text-xl font-bold text-gray-900">{t("privacyTitle")}</h2>
          <p className="mx-auto mt-2 max-w-2xl text-gray-500">{t("privacyDesc")}</p>
        </div>
      </section>
    </div>
  );
}
