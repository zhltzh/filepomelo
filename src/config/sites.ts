export type AixunoSiteId = "markdown" | "image" | "compress" | "pdf" | "bg" | "scan" | "idphoto" | "restore" | "watermark";

export type AixunoSite = {
  id: AixunoSiteId;
  href: string;
  label: Record<"zh" | "en", string>;
};

/** Shared Aixuno network. Links always point at the root path of each site. */
export const AIXUNO_SITES: AixunoSite[] = [
  { id: "markdown", href: "https://aixuno.com/", label: { zh: "Markdown 转换", en: "Markdown" } },
  { id: "image", href: "https://image.aixuno.com/", label: { zh: "图片批量处理", en: "Image Batch Processing" } },
  { id: "compress", href: "https://compress.aixuno.com/", label: { zh: "文件压缩", en: "File Compression" } },
  { id: "pdf", href: "https://pdf.aixuno.com/", label: { zh: "PDF 工具", en: "PDF Tools" } },
  { id: "bg", href: "https://bg.aixuno.com/", label: { zh: "AI 抠图", en: "AI Cutout" } },
  { id: "scan", href: "https://scan.aixuno.com/", label: { zh: "文档扫描", en: "Document Scan" } },
  { id: "idphoto", href: "https://idphoto.aixuno.com/", label: { zh: "证件照制作", en: "ID Photo Maker" } },
  { id: "restore", href: "https://restore.aixuno.com/", label: { zh: "老照片修复", en: "Photo Restore" } },
  { id: "watermark", href: "https://watermark.aixuno.com/", label: { zh: "视频去水印", en: "Watermark Remover" } },
];

export const CURRENT_SITE: AixunoSiteId = "compress";
