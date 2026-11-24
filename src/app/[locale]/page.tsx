import {
  ShieldCheck,
  Shield,
  Zap,
  Gift,
  Layers,
  Boxes,
  FileArchive,
  FolderOpen,
  Cpu,
  Download,
  Mail,
  Images,
  Video,
  Type,
  Package,
  FileOutput,
  type LucideIcon,
} from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CompressorHub } from "@/components/home/compressor-hub";
import { ToolCard } from "@/components/home/tool-card";
import { Reveal } from "@/components/home/reveal";
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
  const meta = await getTranslations({ locale, namespace: "Meta" });

  const base = "https://compress.aixuno.com";
  const inLang = locale === "zh" ? "zh-CN" : "en-US";

  const faqItems = [1, 2, 3, 4, 5, 6].map((i) => ({
    q: t(`faq${i}Q`),
    a: t(`faq${i}A`),
  }));

  const structuredData = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebApplication",
        name: meta("title"),
        description: meta("description"),
        url: `${base}/${locale}/`,
        applicationCategory: "UtilitiesApplication",
        operatingSystem: "Any (browser-based)",
        inLanguage: inLang,
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        isAccessibleForFree: true,
      },
      {
        "@type": "Organization",
        name: "Aixuno",
        url: "https://aixuno.com/",
        logo: "https://aixuno.com/apple-touch-icon.png",
      },
      {
        "@type": "WebSite",
        name: "Aixuno Compress",
        url: `${base}/`,
        inLanguage: ["zh-CN", "en-US"],
      },
      {
        "@type": "FAQPage",
        inLanguage: inLang,
        mainEntity: faqItems.map(({ q, a }) => ({
          "@type": "Question",
          name: q,
          acceptedAnswer: { "@type": "Answer", text: a },
        })),
      },
    ],
  };

  const stepIcons: [LucideIcon, string, string][] = [
    [FolderOpen, "step1Title", "step1Desc"],
    [Cpu, "step2Title", "step2Desc"],
    [Download, "step3Title", "step3Desc"],
  ];

  const scenes: [string, string, string][] = [
    ["Mail", "scene1Title", "scene1Desc"],
    ["Images", "scene2Title", "scene2Desc"],
    ["Video", "scene3Title", "scene3Desc"],
    ["Type", "scene4Title", "scene4Desc"],
    ["Package", "scene5Title", "scene5Desc"],
    ["FileOutput", "scene6Title", "scene6Desc"],
  ];
  const sceneIcons = { Mail, Images, Video, Type, Package, FileOutput };

  const compareRows = [1, 2, 3, 4, 5].map((i) => [
    t(`compareR${i}Feature`),
    t(`compareR${i}Us`),
    t(`compareR${i}Cloud`),
    t(`compareR${i}Desktop`),
  ]);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
      />

      {/* ============ Hero：深色渐变 + 徽章 + 演示卡 ============ */}
      <section className="relative overflow-hidden bg-[#070b16]">
        {/* 网格底纹 */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.55]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(75% 60% at 50% 0%, #000 30%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(75% 60% at 50% 0%, #000 30%, transparent 100%)",
          }}
        />
        <div className="pointer-events-none absolute -top-32 left-[-6rem] h-96 w-96 rounded-full bg-blue-500/25 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-[-4rem] h-96 w-96 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:py-24">
          <div className="text-center lg:text-left">
            <span className="inline-flex items-center gap-2 rounded-full border border-blue-400/30 bg-blue-500/15 px-4 py-1.5 text-sm font-semibold text-blue-100">
              <span className="fp-pulse-dot h-2 w-2 rounded-full bg-emerald-400" />
              {t("heroBadge")}
            </span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.12] tracking-tight text-white sm:text-5xl">
              {t("heroTitlePre")}{" "}
              <span className="bg-gradient-to-r from-sky-300 via-blue-200 to-emerald-300 bg-clip-text text-transparent">
                {t("heroTitleGrad")}
              </span>
            </h1>
            <p className="mx-auto mt-5 max-w-xl text-base text-blue-100/85 sm:text-lg lg:mx-0">
              {t("heroSubtitle")}
            </p>
            <div className="mt-5 flex flex-wrap justify-center gap-2 lg:justify-start">
              {["heroBadge1", "heroBadge2", "heroBadge3"].map((k) => (
                <span
                  key={k}
                  className="rounded-full border border-white/15 bg-white/[0.07] px-3.5 py-1 text-[13px] font-semibold text-slate-200"
                >
                  {t(k)}
                </span>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
              <a
                href="#compress"
                className="rounded-xl bg-gradient-to-r from-blue-500 to-emerald-400 px-6 py-3 text-[15px] font-bold text-white shadow-[0_12px_32px_rgba(47,107,255,0.4)] transition hover:-translate-y-0.5 hover:shadow-[0_18px_40px_rgba(47,107,255,0.5)]"
              >
                {t("heroCta")}
              </a>
              <Link
                href="/tools"
                className="rounded-xl border border-white/20 bg-white/[0.06] px-5 py-3 text-sm font-semibold text-slate-200 transition hover:bg-white/[0.12]"
              >
                {t("heroCtaAlt")}
              </Link>
            </div>
            <p className="mt-4 text-xs text-slate-400">{t("heroCtaNote")}</p>
          </div>

          {/* 压缩演示卡 */}
          <div className="mx-auto w-full max-w-md" aria-hidden="true">
            <div className="rounded-2xl border border-white/10 bg-[#0d1222]/90 p-5 shadow-[0_24px_64px_rgba(10,15,30,0.45)]">
              <div className="flex items-center gap-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-blue-200">
                  <FileArchive className="h-6 w-6" />
                </span>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-100">{t("demoFileLabel")}</p>
                  <p className="relative h-5">
                    <span className="fp-demo-size-out absolute left-0 top-0 text-xs text-slate-400">
                      {t("demoBefore")}
                    </span>
                    <span className="fp-demo-size-in absolute left-0 top-0 text-xs font-bold text-emerald-300">
                      {t("demoAfter")}
                    </span>
                  </p>
                </div>
                <span className="ml-auto rounded-full bg-emerald-400/15 px-2.5 py-1 text-xs font-bold text-emerald-300">
                  {t("demoSaved")}
                </span>
              </div>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-white/10">
                <div className="fp-demo-bar h-full rounded-full bg-gradient-to-r from-blue-500 to-emerald-400" />
              </div>
              <p className="mt-3 text-center text-xs font-medium text-blue-200/80">{t("demoCaption")}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                {["demoChipBatch", "demoChipFast", "demoChipPrivate"].map((k) => (
                  <div key={k} className="rounded-lg border border-white/10 bg-white/[0.06] px-2 py-2 text-xs font-semibold text-slate-200">
                    {t(k)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ 压缩操作区 ============ */}
      <section id="compress" className="mx-auto max-w-6xl scroll-mt-20 px-4 pb-16 sm:px-6 lg:px-8">
        <CompressorHub />
      </section>

      {/* ============ 工具入口 ============ */}
      <section id="tools" className="scroll-mt-20 border-t bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
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

      {/* ============ 三步骤 ============ */}
      <section id="how" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <span className="block text-center text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
            {t("stepsKicker")}
          </span>
          <h2 className="mt-2 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            {t("stepsTitle")}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-gray-500">{t("stepsDesc")}</p>
          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {stepIcons.map(([Icon, title, desc], i) => (
              <Reveal key={title}>
                <div className="h-full rounded-2xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 text-sm font-extrabold text-white shadow-[0_6px_16px_rgba(47,107,255,0.3)]">
                    {i + 1}
                  </span>
                  <Icon className="mt-4 h-7 w-7 text-primary" />
                  <h3 className="mt-3 text-lg font-semibold text-gray-900">{t(title)}</h3>
                  <p className="mt-1.5 text-sm text-gray-500">{t(desc)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 使用场景 ============ */}
      <section id="scenes" className="scroll-mt-20 border-t bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <span className="block text-center text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
            {t("scenesKicker")}
          </span>
          <h2 className="mt-2 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            {t("scenesTitle")}
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {scenes.map(([iconName, title, desc]) => {
              const Icon = sceneIcons[iconName as keyof typeof sceneIcons];
              return (
                <Reveal key={title}>
                  <div className="flex h-full items-start gap-4 rounded-2xl border bg-white p-5 transition hover:-translate-y-1 hover:border-blue-200">
                    <span className="flex h-11 w-11 flex-none items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="text-[15px] font-semibold text-gray-900">{t(title)}</h3>
                      <p className="mt-1 text-sm text-gray-500">{t(desc)}</p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ 数据带 ============ */}
      <section className="mx-auto max-w-6xl px-4 pt-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 rounded-3xl bg-[#0b1020] p-8 text-center sm:p-10 lg:grid-cols-4">
          {[
            ["100%", "stat1Label"],
            ["0", "stat2Label"],
            [String(TOOLS.length), "stat3Label"],
            ["∞", "stat4Label"],
          ].map(([num, label]) => (
            <div key={label}>
              <b className="block bg-gradient-to-r from-sky-300 to-emerald-300 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent sm:text-5xl">
                {num}
              </b>
              <span className="mt-1 block text-sm text-slate-400">{t(label)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ============ 特性：为什么选择（保留） ============ */}
      <section className="border-t bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <h2 className="text-center text-2xl font-bold text-gray-900 sm:text-3xl">
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
              <Reveal key={k}>
                <div className="h-full rounded-2xl border bg-white p-6 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="mt-4 font-semibold text-gray-900">{t(k)}</h3>
                  <p className="mt-1 text-sm text-gray-500">{t(d)}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ 对比表 ============ */}
      <section id="compare" className="scroll-mt-20">
        <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
          <span className="block text-center text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
            {t("compareKicker")}
          </span>
          <h2 className="mt-2 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            {t("compareTitle")}
          </h2>
          <p className="mx-auto mt-2 max-w-2xl text-center text-gray-500">{t("compareDesc")}</p>
          <Reveal className="mt-10">
            <div className="overflow-x-auto rounded-2xl border shadow-sm">
              <table className="w-full border-collapse bg-white text-sm">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="px-4 py-3.5 text-left font-semibold text-gray-900" />
                    <th className="bg-gradient-to-r from-blue-500 to-emerald-400 px-4 py-3.5 text-center font-bold text-white">
                      {t("compareColUs")}
                    </th>
                    <th className="px-4 py-3.5 text-center font-semibold text-gray-600">
                      {t("compareColCloud")}
                    </th>
                    <th className="px-4 py-3.5 text-center font-semibold text-gray-600">
                      {t("compareColDesktop")}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {compareRows.map((row, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-4 py-3.5 font-semibold text-gray-800">{row[0]}</td>
                      <td className="bg-gradient-to-b from-blue-50 to-emerald-50 px-4 py-3.5 text-center font-bold text-emerald-600">
                        ✓ {row[1]}
                      </td>
                      <td className="px-4 py-3.5 text-center text-gray-500">{row[2]}</td>
                      <td className="px-4 py-3.5 text-center text-gray-500">{row[3]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============ 隐私承诺 + 截图（保留，修复硬编码） ============ */}
      <section className="border-t bg-gray-50">
        <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-emerald-200 bg-gradient-to-b from-emerald-50 to-white p-8 text-center sm:p-10">
            <Shield className="mx-auto h-10 w-10 text-green-500" />
            <h2 className="mt-4 text-xl font-bold text-gray-900">{t("privacyTitle")}</h2>
            <p className="mx-auto mt-2 max-w-2xl text-gray-500">{t("privacyDesc")}</p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:px-6 lg:px-8">
          <figure className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
            <img
              src="/compress-interface.webp"
              alt={t("screenshotAlt")}
              width="2560"
              height="1800"
              loading="lazy"
              decoding="async"
              className="h-auto w-full"
            />
          </figure>
          <p className="mt-4 text-center text-sm text-gray-500">{t("screenshotCaption")}</p>
        </div>
      </section>

      {/* ============ FAQ ============ */}
      <section id="faq" className="scroll-mt-20 border-t bg-gray-50">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <span className="block text-center text-xs font-extrabold uppercase tracking-[0.14em] text-primary">
            {t("faqKicker")}
          </span>
          <h2 className="mt-2 text-center text-2xl font-bold text-gray-900 sm:text-3xl">
            {t("faqTitle")}
          </h2>
          <div className="mt-8 space-y-3">
            {faqItems.map(({ q, a }) => (
              <details key={q} className="fp-faq rounded-xl border bg-white transition open:border-blue-200">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-[15px] font-semibold text-gray-900">
                  {q}
                </summary>
                <p className="px-5 pb-4 text-sm leading-relaxed text-gray-500">{a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============ CTA ============ */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c1330] via-[#131b3f] to-[#10332b] px-6 py-14 text-center shadow-2xl sm:py-16">
          <div className="pointer-events-none absolute -top-24 left-1/2 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-blue-400/25 blur-3xl" />
          <h2 className="relative text-2xl font-extrabold tracking-tight text-white sm:text-4xl">
            {t("ctaTitle")}
          </h2>
          <p className="relative mt-3 text-sm text-slate-300 sm:text-base">{t("ctaDesc")}</p>
          <a
            href="#compress"
            className="relative mt-8 inline-block rounded-xl bg-gradient-to-r from-blue-500 to-emerald-400 px-8 py-3.5 text-base font-bold text-white shadow-[0_12px_32px_rgba(47,107,255,0.45)] transition hover:-translate-y-0.5"
          >
            {t("ctaBtn")}
          </a>
        </div>
      </section>
    </div>
  );
}
