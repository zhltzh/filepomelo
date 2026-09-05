/** @type {import('next').NextConfig} */
const createNextIntlPlugin = require("next-intl/plugin");

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig = {
  // 静态导出（GitHub Pages 等任意静态托管）
  output: "export",
  images: { unoptimized: true },
  trailingSlash: true,
  // GitHub Pages 子路径部署：CI 设置 NEXT_PUBLIC_BASE_PATH=/filepomelo；
  // 本地开发/绑定根域名时不设，前缀为空
  ...(process.env.NEXT_PUBLIC_BASE_PATH
    ? { basePath: process.env.NEXT_PUBLIC_BASE_PATH }
    : {}),
};

module.exports = withNextIntl(nextConfig);
