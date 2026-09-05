import { setRequestLocale } from "next-intl/server";
import { ToolPage } from "@/components/tools/tool-page";
import { getTool } from "@/config/tools";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function PdfCompressorPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);
  return <ToolPage tool={getTool("pdf")!} />;
}
