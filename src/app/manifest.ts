import type { MetadataRoute } from "next";
import { basePath } from "@/lib/base-path";

/** PWA / 安装清单（静态导出到 /manifest.webmanifest） */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "FilePomelo - Free Online File Compressor",
    short_name: "FilePomelo",
    description:
      "Compress images, PDF, video, audio and ZIP in your browser. 100% local, files never uploaded.",
    start_url: `${basePath}/zh/`,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: "#3b82f6",
    icons: [
      {
        src: `${basePath}/icon.svg`,
        sizes: "any",
        type: "image/svg+xml",
        purpose: "any",
      },
    ],
  };
}
