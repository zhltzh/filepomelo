import { setRequestLocale } from "next-intl/server";
import { ToolLayout } from "@/components/tools/tool-layout";
import { FontCompressor } from "@/components/home/font-compressor";
import { getTool } from "@/config/tools";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function FontCompressorPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);
  const tool = getTool("font")!;
  return (
    <ToolLayout tool={tool}>
      <FontCompressor />
    </ToolLayout>
  );
}
