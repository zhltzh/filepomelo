import type { MetadataRoute } from "next";

const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "ClaudeBot",
  "Claude-SearchBot",
  "Claude-User",
  "PerplexityBot",
  "Perplexity-User",
  "Google-Extended",
  "Applebot-Extended",
  "CCBot",
  "Amazonbot",
  "Meta-ExternalAgent",
];

const CN_CRAWLERS = [
  "Baiduspider",
  "Baiduspider-mobile",
  "Baiduspider-image",
  "Baiduspider-video",
  "Baiduspider-news",
  "360Spider",
  "HaosouSpider",
  "Sogou web spider",
  "Sogou inst spider",
  "Sogou Pic Spider",
  "YisouSpider",
  "Bytespider",
  "Bingbot",
  "msnbot",
  "Googlebot",
  "Googlebot-Image",
];

const DISALLOWS = ["/api/", "/*?*utm_", "/*?*from="];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: DISALLOWS },
      ...AI_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow: DISALLOWS })),
      ...CN_CRAWLERS.map((userAgent) => ({ userAgent, allow: "/", disallow: DISALLOWS })),
    ],
    sitemap: "https://compress.aixuno.com/sitemap.xml",
  };
}
