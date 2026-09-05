"use client";

import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";
import { Link } from "@/i18n/navigation";
import { getToolIcon, type ToolDefinition } from "@/config/tools";
import { cn } from "@/lib/utils";

const NAME_KEYS = ["image", "pdf", "video", "audio", "zip", "imageConvert", "unzip", "font"] as const;

export function ToolCard({ tool }: { tool: ToolDefinition }) {
  const t = useTranslations("Tool");
  const key = (NAME_KEYS as readonly string[]).includes(tool.id)
    ? (tool.id as (typeof NAME_KEYS)[number])
    : "image";
  const Icon = getToolIcon(tool.id);
  const chips = tool.formats.slice(0, 4);

  return (
    <Link
      href={`/${tool.slug}`}
      className={cn(
        "group relative flex flex-col items-start overflow-hidden rounded-2xl border border-gray-200 bg-white p-5 shadow-card transition-all duration-200",
        "hover:-translate-y-1 hover:border-primary/30 hover:shadow-soft"
      )}
    >
      {/* hover 渐变光 */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/[0.04] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

      <div
        className={cn(
          "flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br shadow-sm transition-transform duration-200 group-hover:scale-110",
          tool.color
        )}
      >
        <Icon className="h-6 w-6 text-white" />
      </div>

      <p className="mt-4 font-semibold text-gray-900">{t(key)}</p>
      <p className="mt-1 text-sm leading-snug text-gray-500">
        {t(`${key}Desc`)}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {chips.map((f) => (
          <span
            key={f}
            className="rounded-md bg-gray-100 px-1.5 py-0.5 text-[10px] font-medium uppercase text-gray-500"
          >
            {f}
          </span>
        ))}
      </div>

      <span className="absolute right-4 top-4 flex h-7 w-7 items-center justify-center rounded-full bg-gray-100 text-gray-400 transition-all duration-200 group-hover:bg-primary group-hover:text-white">
        <ArrowRight className="h-3.5 w-3.5" />
      </span>
    </Link>
  );
}
