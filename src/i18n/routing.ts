import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  // 支持的语言，zh 为默认
  locales: ["zh", "en"],
  defaultLocale: "zh",
  // 始终使用语言前缀（/zh/xxx, /en/xxx），根路径由独立 landing 处理
  localePrefix: "always",
});

export type Locale = (typeof routing.locales)[number];
