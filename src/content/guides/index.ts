import type { Guide, GuideLocale } from "./types";
import { videoCompressTooLarge } from "./video-compress-too-large";
import { convertVideoToMp4 } from "./convert-video-to-mp4";
import { compressMp3Audio } from "./compress-mp3-audio";
import { filesToZip } from "./files-to-zip";
import { unzipWithoutSoftware } from "./unzip-without-software";
import { fontToWoff2 } from "./font-to-woff2";

/** 教程列表页路由（配合 [locale] 前缀） */
export const GUIDE_LIST_PATH = "/guides";

/** 教程顺序即列表页展示顺序 */
export const GUIDES: Guide[] = [
  videoCompressTooLarge,
  convertVideoToMp4,
  compressMp3Audio,
  filesToZip,
  unzipWithoutSoftware,
  fontToWoff2,
];

export function getGuide(slug: string): Guide | undefined {
  return GUIDES.find((guide) => guide.slug === slug);
}

/** 教程详情路径，带尾斜杠（trailingSlash: true） */
export function guidePath(slug: string): string {
  return `${GUIDE_LIST_PATH}/${slug}/`;
}

/** 按 locale 取对应语言内容，未知 locale 回退中文 */
export function guideContent(guide: Guide, locale: string) {
  return locale === "en" ? guide.en : guide.zh;
}

export type { Guide, GuideContent, GuideBlock, GuideLocale } from "./types";
