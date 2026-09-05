"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname, useRouter } from "@/i18n/navigation";
import { Languages } from "lucide-react";

export function Header() {
  const t = useTranslations("Header");
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = () => {
    const next = locale === "zh" ? "en" : "zh";
    router.replace(pathname, { locale: next });
  };

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-emerald-400 text-sm font-bold text-white">
            F
          </span>
          <span className="text-lg font-bold text-gray-900">FilePomelo</span>
        </Link>

        <nav className="flex items-center gap-1 text-sm text-gray-600">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            {t("home")}
          </Link>
          <Link
            href="/tools"
            className="rounded-lg px-3 py-2 transition-colors hover:bg-gray-100 hover:text-gray-900"
          >
            {t("tools")}
          </Link>
          <button
            onClick={switchLocale}
            className="ml-2 flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-gray-600 transition-colors hover:border-primary hover:bg-primary/5 hover:text-primary"
          >
            <Languages className="h-3.5 w-3.5" />
            {t("switchLang")}
          </button>
        </nav>
      </div>
    </header>
  );
}
