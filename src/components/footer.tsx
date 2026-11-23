import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/navigation";
import { TOOLS } from "@/config/tools";
import { ShareLinks } from "@/components/share-links";
import { ContactEmail } from "@/components/contact-email";

const SITES = [
  { href: "https://aixuno.com/", label: { zh: "Markdown 转换", en: "Markdown" } },
  { href: "https://image.aixuno.com/", label: { zh: "Pixkit 图片批量处理", en: "Pixkit Images" } },
  { href: "https://pdf.aixuno.com/", label: { zh: "PDF 工具", en: "PDF Tools" } },
  { href: "https://bg.aixuno.com/", label: { zh: "AI 抠图", en: "AI Cutout" } },
  { href: "https://scan.aixuno.com/", label: { zh: "文档扫描", en: "Document Scan" } },
  { href: "https://restore.aixuno.com/", label: { zh: "老照片修复", en: "Photo Restore" } },
  { href: "https://watermark.aixuno.com/", label: { zh: "视频去水印", en: "Watermark Remover" } },
];

export function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const now = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="max-w-sm">
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-emerald-400 text-xs font-bold text-white">
                F
              </span>
              <span className="font-bold text-gray-900">FilePomelo</span>
            </div>
            <p className="mt-3 text-sm text-gray-500">{t("desc")}</p>
          </div>

          <div>
            <p className="text-sm font-semibold text-gray-900">{t("tools")}</p>
            <ul className="mt-3 grid grid-cols-2 gap-x-8 gap-y-2 text-sm text-gray-500">
              {TOOLS.map((tool) => (
                <li key={tool.id}>
                  <Link href={`/${tool.slug}`} className="hover:text-primary">
                    {t(`tool.${tool.id}`)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6">
          <div className="text-xs font-semibold uppercase tracking-widest text-gray-400">
            {locale === "zh" ? "Aixuno 工具生态" : "Aixuno Tools"}
          </div>
          <nav aria-label="Aixuno" className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {SITES.map((site) => (
              <a
                key={site.href}
                href={site.href}
                className="text-gray-500 transition-colors hover:text-primary"
              >
                {locale === "zh" ? site.label.zh : site.label.en}
              </a>
            ))}
          </nav>
        </div>

        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
          © {now} FilePomelo. {t("copyright")}{" "}
          <Link href="/guides" className="underline-offset-2 hover:underline">
            {t("guides")}
          </Link>
          {" · "}
          <Link href="/privacy" className="underline-offset-2 hover:underline">
            {t("privacy")}
          </Link>
          {" · "}
          <ContactEmail label={t("feedback")} className="underline-offset-2 hover:underline" />
          {" · "}
          <a
            href="https://github.com/zhltzh/filepomelo/issues/new"
            target="_blank"
            rel="noopener noreferrer"
            className="underline-offset-2 hover:underline"
          >
            GitHub
          </a>
        </div>

        <div className="mt-6 flex items-center justify-center border-t border-gray-200 pt-6">
          <ShareLinks />
        </div>
      </div>
    </footer>
  );
}
