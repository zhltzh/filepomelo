import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FilePomelo - 免费在线文件压缩器",
  description:
    "纯浏览器端运行的全格式文件压缩工具站：图片、PDF、视频、音频本地压缩，文件不上传服务器。",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
