import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "FilePomelo - 免费在线文件压缩器",
  description:
    "纯浏览器端运行的全格式文件压缩工具站：图片、PDF、视频、音频本地压缩，文件不上传服务器。",
};

const ORG_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://aixuno.com/#organization",
  name: "Aixuno",
  url: "https://aixuno.com/",
  logo: {
    "@type": "ImageObject",
    url: "https://aixuno.com/apple-touch-icon.png",
    width: 180,
    height: 180,
  },
  sameAs: ["https://github.com/zhltzh/filepomelo"],
  subOrganization: {
    "@type": "Organization",
    name: "FilePomelo",
    url: "https://compress.aixuno.com/",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN">
      <head>
        {/* 性能：提前建立百度统计连接，缩短首屏第三方请求延迟 */}
        <link rel="preconnect" href="https://hm.baidu.com" />
        <link rel="dns-prefetch" href="https://hm.baidu.com" />
      </head>
      <body className="font-sans antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_SCHEMA) }}
        />
        {children}
        {/* 百度统计 */}
        <script
          dangerouslySetInnerHTML={{
            __html: `var _hmt=_hmt||[];(function(){var hm=document.createElement("script");hm.src="https://hm.baidu.com/hm.js?ef887868142b18a0c32bd9e20da7d91f";var s=document.getElementsByTagName("script")[0];s.parentNode.insertBefore(hm,s);})();`,
          }}
        />
      </body>
    </html>
  );
}
