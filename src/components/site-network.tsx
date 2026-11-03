import { useLocale } from "next-intl";
import { AIXUNO_SITES, CURRENT_SITE, type AixunoSiteId } from "@/config/sites";

/** 站点色块：静态类名，确保 Tailwind 能扫描到 */
const TONE: Record<AixunoSiteId, string> = {
  markdown: "from-amber-400 to-orange-500",
  image: "from-fuchsia-500 to-pink-500",
  compress: "from-sky-500 to-emerald-500",
  pdf: "from-rose-500 to-red-500",
  bg: "from-violet-500 to-indigo-500",
};

const MARK: Record<AixunoSiteId, string> = {
  markdown: "MD",
  image: "IMG",
  compress: "ZIP",
  pdf: "PDF",
  bg: "BG",
};

export function SiteNetwork() {
  const locale = useLocale() === "en" ? "en" : "zh";
  const ariaLabel = locale === "zh" ? "Aixuno 产品线" : "Aixuno products";

  return (
    <nav aria-label={ariaLabel} className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center gap-1.5 overflow-x-auto px-4 py-2 sm:px-6 lg:px-8">
        <span className="mr-1 shrink-0 text-[11px] font-bold uppercase tracking-widest text-gray-400">
          Aixuno
        </span>
        {AIXUNO_SITES.map((site) => {
          const isCurrent = site.id === CURRENT_SITE;
          const inner = (
            <>
              <span
                className={`inline-grid h-5 min-w-[26px] shrink-0 place-items-center rounded bg-gradient-to-br px-1 text-[10px] font-bold leading-none text-white ${TONE[site.id]}`}
              >
                {MARK[site.id]}
              </span>
              <span className="whitespace-nowrap text-xs font-semibold">{site.label[locale]}</span>
            </>
          );
          return isCurrent ? (
            <span
              key={site.id}
              aria-current="page"
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-primary"
            >
              {inner}
            </span>
          ) : (
            <a
              key={site.id}
              href={site.href}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-transparent px-2.5 py-1 text-gray-600 transition-colors hover:border-gray-200 hover:bg-gray-50 hover:text-gray-900"
            >
              {inner}
            </a>
          );
        })}
      </div>
    </nav>
  );
}
