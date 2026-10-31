import type { MetadataRoute } from "next";

const BASE = "https://compress.aixuno.com";

const TOOL_PATHS = [
  "",
  "/tools",
  "/image-compressor",
  "/pdf-compressor",
  "/video-compressor",
  "/audio-compressor",
  "/zip-compressor",
  "/image-converter",
  "/unzip",
  "/font-compressor",
  "/privacy",
];

/** 站点地图：中英双语全部静态路由（配合 [locale] 静态导出） */
export default function sitemap(): MetadataRoute.Sitemap {
  const urls: MetadataRoute.Sitemap = [];
  for (const locale of ["zh", "en"]) {
    for (const p of TOOL_PATHS) {
      urls.push({
        url: `${BASE}/${locale}${p}/`,
        lastModified: new Date(),
        changeFrequency: "weekly",
        priority: p === "" ? 1 : 0.8,
      });
    }
  }
  return urls;
}
