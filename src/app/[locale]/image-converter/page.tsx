import { setRequestLocale } from "next-intl/server";
import { ToolLayout } from "@/components/tools/tool-layout";
import { ImageConverter } from "@/components/home/image-converter";
import { getTool } from "@/config/tools";
import { routing } from "@/i18n/routing";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function ImageConverterPage({
  params,
}: {
  params: { locale: string };
}) {
  const { locale } = params;
  setRequestLocale(locale);
  const tool = getTool("imageConvert")!;
  return (
    <ToolLayout tool={tool}>
      <ImageConverter />
    </ToolLayout>
  );
}
