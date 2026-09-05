/**
 * 将压缩引擎的 WASM 运行库从 node_modules 复制到 public/vendor/
 * 运行: npm run setup:vendor
 *
 * 依赖体积较大（ffmpeg 单/多线程共约 65MB），未纳入 git，部署前需执行本脚本。
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const VENDOR = path.join(ROOT, "public", "vendor");

const SOURCES = [
  // Ghostscript (PDF 压缩)
  {
    src: path.join(ROOT, "node_modules", "@okathira", "ghostpdl-wasm", "dist", "gs.js"),
    dest: path.join(VENDOR, "ghostscript", "gs.js"),
  },
  {
    src: path.join(ROOT, "node_modules", "@okathira", "ghostpdl-wasm", "dist", "gs.wasm"),
    dest: path.join(VENDOR, "ghostscript", "gs.wasm"),
  },
  // ffmpeg 单线程 core（无需 COOP/COEP 隔离头）
  {
    src: path.join(ROOT, "node_modules", "@ffmpeg", "core", "dist", "esm", "ffmpeg-core.js"),
    dest: path.join(VENDOR, "ffmpeg", "core", "ffmpeg-core.js"),
  },
  {
    src: path.join(ROOT, "node_modules", "@ffmpeg", "core", "dist", "esm", "ffmpeg-core.wasm"),
    dest: path.join(VENDOR, "ffmpeg", "core", "ffmpeg-core.wasm"),
  },
  // ffmpeg 多线程 core-mt（需 COOP/COEP，配合 coi-serviceworker）
  {
    src: path.join(ROOT, "node_modules", "@ffmpeg", "core-mt", "dist", "esm", "ffmpeg-core.js"),
    dest: path.join(VENDOR, "ffmpeg", "core-mt", "ffmpeg-core.js"),
  },
  {
    src: path.join(ROOT, "node_modules", "@ffmpeg", "core-mt", "dist", "esm", "ffmpeg-core.wasm"),
    dest: path.join(VENDOR, "ffmpeg", "core-mt", "ffmpeg-core.wasm"),
  },
  {
    src: path.join(ROOT, "node_modules", "@ffmpeg", "core-mt", "dist", "esm", "ffmpeg-core.worker.js"),
    dest: path.join(VENDOR, "ffmpeg", "core-mt", "ffmpeg-core.worker.js"),
  },
  // jsquash 图片编码器
  {
    src: path.join(ROOT, "node_modules", "@jsquash", "jpeg", "codec", "enc", "mozjpeg_enc.wasm"),
    dest: path.join(VENDOR, "jsquash", "jpeg", "mozjpeg_enc.wasm"),
  },
  {
    src: path.join(ROOT, "node_modules", "@jsquash", "jpeg", "codec", "dec", "mozjpeg_dec.wasm"),
    dest: path.join(VENDOR, "jsquash", "jpeg", "mozjpeg_dec.wasm"),
  },
  {
    src: path.join(ROOT, "node_modules", "@jsquash", "png", "codec", "pkg", "squoosh_png_bg.wasm"),
    dest: path.join(VENDOR, "jsquash", "png", "squoosh_png_bg.wasm"),
  },
  {
    src: path.join(ROOT, "node_modules", "@jsquash", "webp", "codec", "enc", "webp_enc.wasm"),
    dest: path.join(VENDOR, "jsquash", "webp", "webp_enc.wasm"),
  },
  {
    src: path.join(ROOT, "node_modules", "@jsquash", "webp", "codec", "enc", "webp_enc_simd.wasm"),
    dest: path.join(VENDOR, "jsquash", "webp", "webp_enc_simd.wasm"),
  },
  {
    src: path.join(ROOT, "node_modules", "@jsquash", "webp", "codec", "dec", "webp_dec.wasm"),
    dest: path.join(VENDOR, "jsquash", "webp", "webp_dec.wasm"),
  },
  {
    src: path.join(ROOT, "node_modules", "@jsquash", "avif", "codec", "enc", "avif_enc.wasm"),
    dest: path.join(VENDOR, "jsquash", "avif", "avif_enc.wasm"),
  },
  {
    src: path.join(ROOT, "node_modules", "@jsquash", "avif", "codec", "enc", "avif_enc_mt.wasm"),
    dest: path.join(VENDOR, "jsquash", "avif", "avif_enc_mt.wasm"),
  },
  {
    src: path.join(ROOT, "node_modules", "@jsquash", "avif", "codec", "dec", "avif_dec.wasm"),
    dest: path.join(VENDOR, "jsquash", "avif", "avif_dec.wasm"),
  },
  // woff2 字体压缩（google/woff2 官方编码器 WASM）
  {
    src: path.join(ROOT, "node_modules", "woff2-encode-wasm", "dist", "encoder.wasm"),
    dest: path.join(VENDOR, "woff2", "encoder.wasm"),
  },
];

let copied = 0;
let missing = [];

function copyIfExists(src, dest) {
  if (!fs.existsSync(src)) {
    missing.push(path.relative(ROOT, src));
    return;
  }
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
  copied++;
  console.log(`  ✓ ${path.relative(ROOT, dest)}`);
}

console.log("复制 WASM 运行库到 public/vendor/\n");

for (const item of SOURCES) {
  copyIfExists(item.src, item.dest);
}

console.log(`\n完成：复制 ${copied} 个文件`);
if (missing.length > 0) {
  console.log(`\n以下依赖文件未找到（可忽略，对应功能可能受限）:`);
  missing.forEach((m) => console.log(`  - ${m}`));
}
