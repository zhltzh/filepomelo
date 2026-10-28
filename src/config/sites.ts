export type AixunoSiteId = "markdown" | "image" | "compress" | "pdf" | "bg";

export type AixunoSite = {
  id: AixunoSiteId;
  href: string;
  label: Record<"zh" | "en", string>;
};

/** Shared Aixuno network. Links always point at the root path of each site. */
export const AIXUNO_SITES: AixunoSite[] = [
  { id: "markdown", href: "https://aixuno.com/", label: { zh: "Markdown 转换", en: "Markdown" } },
  { id: "image", href: "https://image.aixuno.com/", label: { zh: "Pixkit 图片", en: "Pixkit Images" } },
  { id: "compress", href: "https://compress.aixuno.com/", label: { zh: "文件压缩", en: "File Compress" } },
  { id: "pdf", href: "https://pdf.aixuno.com/", label: { zh: "PDF 工具", en: "PDF Tools" } },
  { id: "bg", href: "https://bg.aixuno.com/", label: { zh: "AI 抠图", en: "AI Cutout" } },
];

export const CURRENT_SITE: AixunoSiteId = "compress";
