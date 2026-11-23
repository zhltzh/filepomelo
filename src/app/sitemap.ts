import type { MetadataRoute } from "next";
import { GUIDES, GUIDE_LIST_PATH } from "@/content/guides";

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

const GUIDE_PATHS = [GUIDE_LIST_PATH, ...GUIDES.map((guide) => `${GUIDE_LIST_PATH}/${guide.slug}`)];

/** 站点地图：中英双语全部静态路由（配合 [locale] 静态导出） */
export default function sitemap(): MetadataRoute.Sitemap {
  // 固定发布日期，避免每次构建抖动；内容变更时手动更新
  const toolLastModified = new Date("2026-11-01");
  const guideLastModified = new Date("2026-11-23");
  const paths = [
    ...TOOL_PATHS.map((path) => ({ path, lastModified: toolLastModified, priority: path === "" ? 1 : 0.8 })),
    ...GUIDE_PATHS.map((path) => ({ path, lastModified: guideLastModified, priority: 0.7 })),
  ];
  const urls: MetadataRoute.Sitemap = [];
  for (const locale of ["zh", "en"]) {
    for (const { path, lastModified, priority } of paths) {
      urls.push({
        url: `${BASE}/${locale}${path}/`,
        lastModified,
        changeFrequency: "weekly",
        priority,
        // 根 landing 为跳转页，不做双语 hreflang；其余路径标注 zh/en
        ...(path === ""
          ? {}
          : {
              alternates: {
                languages: {
                  "zh-CN": `${BASE}/zh${path}/`,
                  "en-US": `${BASE}/en${path}/`,
                  "x-default": `${BASE}/zh${path}/`,
                },
              },
            }),
      });
    }
  }
  return urls;
}
