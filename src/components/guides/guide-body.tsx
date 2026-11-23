import { Link } from "@/i18n/navigation";
import type { GuideBlock, GuideLocale } from "@/content/guides/types";

/** 行内语法：**加粗**、[文字](链接)，其余按纯文本输出 */
const INLINE_TOKEN = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\))/g;

function Inline({ text }: { text: string }) {
  const parts = text.split(INLINE_TOKEN).filter((part) => part !== "");
  return (
    <>
      {parts.map((part, index) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={index} className="font-semibold text-gray-900">
              {part.slice(2, -2)}
            </strong>
          );
        }
        const link = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
        if (link) {
          const [, label, href] = link;
          if (href.startsWith("http")) {
            return (
              <a
                key={index}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-primary underline-offset-2 hover:underline"
              >
                {label}
              </a>
            );
          }
          return (
            <Link
              key={index}
              href={href}
              className="font-medium text-primary underline-offset-2 hover:underline"
            >
              {label}
            </Link>
          );
        }
        return <span key={index}>{part}</span>;
      })}
    </>
  );
}

function GuideCta({
  href,
  label,
  text,
  locale,
}: {
  href: string;
  label: string;
  text: string;
  locale: GuideLocale;
}) {
  return (
    <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5 sm:p-6">
      <p className="font-semibold text-gray-900">{label}</p>
      <p className="mt-1 text-sm leading-6 text-gray-600">{text}</p>
      <Link
        href={href}
        className="mt-3 inline-flex items-center rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary/90"
      >
        {locale === "en" ? "Open the tool →" : "立即免费使用 →"}
      </Link>
    </div>
  );
}

export function GuideBlocks({
  blocks,
  locale,
}: {
  blocks: GuideBlock[];
  locale: GuideLocale;
}) {
  return (
    <div className="space-y-4 text-[15px] leading-7 text-gray-600 sm:text-base sm:leading-8">
      {blocks.map((block, index) => {
        switch (block.type) {
          case "h2":
            return (
              <h2
                key={index}
                className="pt-6 text-xl font-bold text-gray-900 sm:text-2xl"
              >
                {block.text}
              </h2>
            );
          case "p":
            return (
              <p key={index}>
                <Inline text={block.text} />
              </p>
            );
          case "ul":
            return (
              <ul key={index} className="list-disc space-y-2 pl-5">
                {block.items.map((item, i) => (
                  <li key={i}>
                    <Inline text={item} />
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={index} className="list-decimal space-y-2 pl-5">
                {block.items.map((item, i) => (
                  <li key={i}>
                    <Inline text={item} />
                  </li>
                ))}
              </ol>
            );
          case "code":
            return (
              <pre
                key={index}
                className="overflow-x-auto rounded-xl bg-slate-950 p-4 text-xs leading-6 text-slate-100 sm:text-sm"
              >
                <code>{block.text}</code>
              </pre>
            );
          case "cta":
            return (
              <GuideCta
                key={index}
                href={block.href}
                label={block.label}
                text={block.text}
                locale={locale}
              />
            );
          default:
            return null;
        }
      })}
    </div>
  );
}
