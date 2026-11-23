/** 教程正文块：纯数据，中英共用同一个渲染器 */
export type GuideBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "code"; text: string }
  | { type: "cta"; href: string; label: string; text: string };

export type GuideLocale = "zh" | "en";

export interface GuideContent {
  /** H1 与页面标题（不含站点后缀） */
  title: string;
  /** meta description，150 字以内 */
  description: string;
  /** 列表页卡片摘要 */
  summary: string;
  blocks: GuideBlock[];
  faq: { q: string; a: string }[];
}

export interface Guide {
  slug: string;
  /** 对应站内工具的路由 slug */
  toolSlug: string;
  toolName: Record<GuideLocale, string>;
  datePublished: string;
  dateModified: string;
  /** 相关教程 slug，必须存在于 GUIDES，避免死链 */
  related: string[];
  zh: GuideContent;
  en: GuideContent;
}
