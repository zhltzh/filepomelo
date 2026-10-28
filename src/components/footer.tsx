import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { TOOLS } from "@/config/tools";
import { SiteNetwork } from "@/components/site-network";

export function Footer() {
  const t = useTranslations("Footer");
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

        <div className="mt-8 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
          © {now} FilePomelo. {t("copyright")}{" "}
          <Link href="/privacy" className="underline-offset-2 hover:underline">
            {t("privacy")}
          </Link>
        </div>

        <div className="mt-6 border-t border-gray-200">
          <SiteNetwork />
        </div>
      </div>
    </footer>
  );
}
