import { useLocale } from "next-intl";
import { AIXUNO_SITES, CURRENT_SITE } from "@/config/sites";

export function SiteNetwork() {
  const locale = useLocale() === "en" ? "en" : "zh";
  const title = locale === "zh" ? "Aixuno 工具" : "Aixuno tools";

  return (
    <section aria-label={title} className="border-t border-gray-200 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-semibold uppercase tracking-wide text-gray-400">{title}</p>
        <ul className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {AIXUNO_SITES.map((site) => (
            <li key={site.id}>
              {site.id === CURRENT_SITE ? (
                <span aria-current="page" className="font-medium text-gray-900">
                  {site.label[locale]}
                </span>
              ) : (
                <a href={site.href} className="text-gray-500 transition-colors hover:text-primary">
                  {site.label[locale]}
                </a>
              )}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
