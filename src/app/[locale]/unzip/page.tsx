import { setRequestLocale } from "next-intl/server";
import { ToolLayout } from "@/components/tools/tool-layout";
import { UnzipCompressor } from "@/components/home/unzip";
import { getTool } from "@/config/tools";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function UnzipPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);
  const tool = getTool("unzip")!;
  return (
    <ToolLayout tool={tool}>
      <UnzipCompressor />
    </ToolLayout>
  );
}
