"use client";

import { useState, type ReactNode } from "react";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle, Clock, Shield, ChevronRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getToolIcon, TOOLS, type ToolDefinition } from "@/config/tools";
import { cn } from "@/lib/utils";

interface ToolLayoutProps {
  tool: ToolDefinition;
  children: ReactNode;
  faqItems?: { q: string; a: string }[];
}

const NAME_KEYS = ["image", "pdf", "video", "audio", "zip", "imageConvert", "unzip", "font"] as const;

export function ToolLayout({ tool, children, faqItems }: ToolLayoutProps) {
  const t = useTranslations("Tool");
  const locale = useLocale();
  const [showFaq, setShowFaq] = useState(false);

  const nameKey = (NAME_KEYS as readonly string[]).includes(tool.id)
    ? (tool.id as (typeof NAME_KEYS)[number])
    : "image";
  const name = t(nameKey);
  const desc = t(`${nameKey}Desc`);

  const steps = [
    { step: 1, title: t("step1Title"), description: t("step1Desc") },
    { step: 2, title: t("step2Title"), description: t("step2Desc") },
    { step: 3, title: t("step3Title"), description: t("step3Desc") },
  ];

  // 各工具专属 FAQ（messages 里 faq-{tool.id}-NQ/NA），faqItems prop 可覆盖
  const faq = faqItems ?? [
    { q: t(`faq-${tool.id}-1Q`), a: t(`faq-${tool.id}-1A`) },
    { q: t(`faq-${tool.id}-2Q`), a: t(`faq-${tool.id}-2A`) },
    { q: t(`faq-${tool.id}-3Q`), a: t(`faq-${tool.id}-3A`) },
  ];

  const relatedTools = TOOLS.filter((x) => x.id !== tool.id);
  const baseUrl = "https://filepomelo.com";
  const HeaderIcon = getToolIcon(tool.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* 面包屑 + JSON-LD */}
      <div className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-5xl px-4 py-3 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-sm text-gray-500">
            <Link href="/" className="transition-colors hover:text-blue-800">
              {t("breadcrumbHome")}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/tools" className="transition-colors hover:text-blue-800">
              {t("breadcrumbTools")}
            </Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="font-medium text-gray-900">{name}</span>
          </nav>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BreadcrumbList",
                itemListElement: [
                  { "@type": "ListItem", position: 1, name: t("breadcrumbHome"), item: `${baseUrl}/${locale}` },
                  { "@type": "ListItem", position: 2, name: t("breadcrumbTools"), item: `${baseUrl}/${locale}/tools` },
                  { "@type": "ListItem", position: 3, name, item: `${baseUrl}/${locale}/${tool.slug}` },
                ],
              }),
            }}
          />
        </div>
      </div>

      {/* 标题区 */}
      <div className="border-b bg-white">
        <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex h-14 w-14 flex-shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br shadow-sm",
                tool.color
              )}
            >
              <HeaderIcon className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 sm:text-3xl">{name}</h1>
              <p className="mt-1 text-gray-500">{desc}</p>
            </div>
          </div>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-gray-400">
            <span className="flex items-center gap-1">
              <CheckCircle className="h-3.5 w-3.5 text-green-500" />
              {t("free")}
            </span>
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-green-500" />
              {t("local")}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-green-500" />
              {t("noSignup")}
            </span>
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "SoftwareApplication",
                name: `FilePomelo ${name}`,
                url: `${baseUrl}/${locale}/${tool.slug}`,
                applicationCategory: "UtilitiesApplication",
                operatingSystem: "Any",
                offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
              }),
            }}
          />
        </div>
      </div>

      {/* 操作区 */}
      <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="rounded-2xl border bg-white p-6 shadow-sm sm:p-8">{children}</div>

        {/* 使用步骤 */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">
            {t("howToTitle")} {name}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-3">
            {steps.map((item) => (
              <div
                key={item.step}
                className="relative rounded-xl border bg-white p-5 text-center"
              >
                <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-blue-800">
                  {item.step}
                </div>
                <h3 className="mt-3 font-semibold text-gray-900">{item.title}</h3>
                <p className="mt-1 text-sm text-gray-500">{item.description}</p>
              </div>
            ))}
          </div>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "HowTo",
                name: `${t("howToTitle")} ${name}`,
                description: desc,
                step: steps.map((item) => ({
                  "@type": "HowToStep",
                  position: item.step,
                  name: item.title,
                  text: item.description,
                })),
              }),
            }}
          />
        </div>

        {/* FAQ */}
        <div className="mt-10">
          <button
            onClick={() => setShowFaq(!showFaq)}
            className="flex items-center gap-2 text-xl font-bold text-gray-900"
          >
            {t("faqTitle")}
            <ChevronRight
              className={cn(
                "h-5 w-5 transition-transform",
                showFaq && "rotate-90"
              )}
            />
          </button>
          {showFaq && (
            <div className="mt-4 space-y-4">
              {faq.map((item, i) => (
                <div key={i} className="animate-fade-in rounded-xl border bg-white p-5">
                  <h3 className="font-semibold text-gray-900">{item.q}</h3>
                  <p className="mt-2 text-sm text-gray-600">{item.a}</p>
                </div>
              ))}
            </div>
          )}
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "FAQPage",
                mainEntity: faq.map((item) => ({
                  "@type": "Question",
                  name: item.q,
                  acceptedAnswer: { "@type": "Answer", text: item.a },
                })),
              }),
            }}
          />
        </div>

        {/* 相关工具 */}
        <div className="mt-10">
          <h2 className="text-xl font-bold text-gray-900">{t("relatedTitle")}</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {relatedTools.map((item) => {
              const k = (NAME_KEYS as readonly string[]).includes(item.id)
                ? (item.id as (typeof NAME_KEYS)[number])
                : "image";
              const ItemIcon = getToolIcon(item.id);
              return (
                <Link
                  key={item.id}
                  href={`/${item.slug}`}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border bg-white p-4 shadow-sm transition-all",
                    "hover:-translate-y-0.5 hover:shadow-md"
                  )}
                >
                  <div
                    className={cn(
                      "flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-gradient-to-br",
                      item.color
                    )}
                  >
                    <ItemIcon className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{t(k)}</p>
                    <p className="text-xs text-gray-500">{t(`${k}Desc`)}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
