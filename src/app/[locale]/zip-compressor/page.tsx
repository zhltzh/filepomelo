import { setRequestLocale } from "next-intl/server";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ZipCompressor } from "@/components/home/zip-compressor";
import { getTool } from "@/config/tools";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ZipCompressorPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);
  const tool = getTool("zip")!;
  return (
    <ToolLayout tool={tool}>
      <ZipCompressor />
    </ToolLayout>
  );
}
