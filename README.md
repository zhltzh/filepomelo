# FilePomelo

纯浏览器端运行的全格式文件压缩工具站。文件不上传服务器（隐私卖点），GitHub Pages 免费托管。

## 技术栈

- Next.js 14 (App Router) + TypeScript + Tailwind CSS
- 静态导出（`output: export`）→ GitHub Pages
- i18n：next-intl（中/英双语，`[locale]` 段 + 静态导出）

## 压缩引擎

| 格式 | 引擎 | 状态 |
|---|---|---|
| JPG | @jsquash/jpeg (MozJPEG) | ✅ P2 已接入 |
| PNG | @jsquash/png (OxiPNG) | ✅ P2 已接入 |
| WebP | @jsquash/webp | ✅ P2 已接入 |
| SVG | SVGO | ✅ P2 已接入 |
| AVIF | @jsquash/avif | ✅ P3 已接入 |
| GIF | gifsicle-wasm-browser | ✅ P3 已接入 |
| PDF | 结构压缩(pdf-lib) → 回退 Ghostscript | ✅ P5 已接入 |
| 视频 mp4/mov/mkv/webm | mediabunny + WebCodecs | ✅ P4 已接入 |
| 音频 aac/ogg | mediabunny + WebCodecs | ✅ P4 已接入 |
| flv/3gp/ogv/mp3/wma | FFmpeg 兜底（Worker） | ✅ P5 已接入 |
| ZIP（打包） | fflate（独立工具页） | ✅ P5 已接入 |
| 图片格式转换 | canvas + jsquash（独立工具页） | ✅ P5 已接入 |
| ZIP 解压 | fflate 流式 Unzip（独立工具页） | ✅ P5 已接入 |
| 字体 TTF/OTF→WOFF2 | woff2-encode-wasm（独立工具页） | ✅ P5 已接入 |

> 已接入引擎以懒加载方式注册于 `src/lib/engines/index.ts`（覆盖桩引擎）；
> 首次压缩该格式时才动态加载 wasm 胶水，首页体积不受影响。
> 压缩结果不小于原文件时自动回退为原文件（避免"压缩后变大"误导）。
> PDF 结构压缩（P5）通过 pdf-lib 遍历 XObject 图像重采样/重编码为 JPEG（文本与矢量不动，
> `useObjectStreams` 打包），无嵌入图/未变小/加密时自动回退 Ghostscript
> （`public/ghostscript-worker.mjs` Web Worker 运行）。
> 音视频（P4）走 **WebCodecs 硬件编码**（mediabunny 封装）：免 COOP/COEP，适配 GitHub Pages；
> 运行时探测编码能力（`getFirstEncodableVideoCodec`），Chrome/Edge/Safari 走 H.264→MP4 主路径。
> FFmpeg 兜底（P5）处理 WebCodecs 不支持的格式：mp3/wma 音频 → MP3 重编码、
> flv/3gp/ogv 视频 → H.264 MP4，单线程 core 经 `public/ffmpeg-worker.mjs` Web Worker 运行。
> 目标尺寸模式（P5c）：首页填"目标大小(KB)"后，对全部待处理任务二分搜索 quality
> （≤6 次压缩尝试）自动逼近目标体积，输出 ≤ 目标即达标，任务行显示绿色"≤ 目标"徽标。
> ZIP 压缩（P5）：独立工具页 `/zip-compressor`，fflate 多文件本地打包（可选压缩级别），
> 支持拖入文件/文件夹，展示打包前后体积与压缩率。
> 工具页含各工具专属 FAQ（5 工具 × 3 条，中英双语）与 HowTo/FAQPage 结构化数据。
> 新增扩展工具（第 5 阶段追加）：
> - 图片格式转换 `/image-converter`：JPG/PNG/WebP/AVIF 两两互转（canvas 编解码 + jsquash AVIF），可调质量，批量处理
> - ZIP 解压 `/unzip`：fflate 流式解压，中文文件名支持，逐文件/全部下载
> - 字体压缩 `/font-compressor`：TTF/OTF → WOFF2（google/woff2 官方编码器 WASM，实测 −58%），懒加载 wasm

## SEO 基础设施

- `sitemap.xml`：中英双语全部静态路由（自动生成）
- `robots.txt`：允许全站 + 指向 sitemap
- Open Graph / Twitter 卡片（含 `og-image.png` 1200×630 分享图）
- hreflang 双语声明（`zh-CN` / `en-US` / `x-default`）+ canonical
- PWA `manifest.webmanifest`（桌面安装图标，theme #2563eb）

## 开发

```bash
npm install
npm run setup:vendor   # 复制 wasm 运行库到 public/vendor/
npm run dev            # 开发
npm run build          # 构建（静态导出到 out/）
```

## 目录

- `src/app/[locale]/` — 各语言路由（首页、工具页）
- `src/components/home/` — 首页拖拽区、任务队列、工具卡片
- `src/components/tools/` — 工具页布局（SEO 骨架复用）
- `src/lib/engines/` — 压缩引擎实现（P1 为桩，P2+ 逐个接入）
- `scripts/setup-vendor.cjs` — wasm 静态资源复制
