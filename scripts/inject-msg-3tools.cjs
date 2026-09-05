/**
 * 一次性注入 messages：新增 3 工具 + 专属 FAQ + 组件命名空间 + footer 工具名 + DropZone 按钮双语
 * 运行: node scripts/inject-msg-3tools.cjs
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");

function load(name) {
  return JSON.parse(fs.readFileSync(path.join(ROOT, "src", "messages", name), "utf8"));
}
function save(name, obj) {
  fs.writeFileSync(
    path.join(ROOT, "src", "messages", name),
    JSON.stringify(obj, null, 2) + "\n",
    "utf8"
  );
}

const zh = load("zh.json");
const en = load("en.json");

// ---------- Tool 命名空间 ----------
const zhTool = {
  imageConvert: "图片格式转换",
  imageConvertDesc: "在 JPG、PNG、WebP、AVIF 之间互转图片格式",
  unzip: "ZIP 解压",
  unzipDesc: "在浏览器本地解压 ZIP 压缩包并下载其中的文件",
  font: "字体压缩",
  fontDesc: "把 TTF、OTF 字体压缩为 WOFF2 网页字体格式",
  breadcrumbHome: "首页",
  breadcrumbTools: "全部工具",
  howToTitle: "如何使用",
  faqTitle: "常见问题",
  relatedTitle: "相关工具",
  "faq-imageConvert-1Q": "图片格式转换会降低画质吗？",
  "faq-imageConvert-1A": "转换本身不改变像素。但转成 JPG、WebP、AVIF 等有损格式时，画质会随压缩级别变化，建议保留原始无损文件备份。",
  "faq-imageConvert-2Q": "支持哪些格式之间的互转？",
  "faq-imageConvert-2A": "支持 JPG、PNG、WebP、AVIF 四种主流格式两两互转，全部在浏览器本地完成，不上传服务器。",
  "faq-imageConvert-3Q": "转换后的文件去哪里了？",
  "faq-imageConvert-3A": "文件不会上传，转换结果直接在你的浏览器中生成，点击下载即可保存到本地。",
  "faq-unzip-1Q": "解压 ZIP 需要安装软件吗？",
  "faq-unzip-1A": "不需要。所有解压都在浏览器本地完成，无需安装任何软件，也不会把文件上传到服务器。",
  "faq-unzip-2Q": "能解压中文文件名的 ZIP 吗？",
  "faq-unzip-2A": "可以。支持 UTF-8 编码的中文文件名，解压后会正确显示并可下载。",
  "faq-unzip-3Q": "解压大压缩包会卡顿吗？",
  "faq-unzip-3A": "采用流式解压逐文件处理，内存占用可控；超大压缩包建议分批处理。",
  "faq-font-1Q": "WOFF2 字体压缩能压多少？",
  "faq-font-1A": "WOFF2 是专为网页优化的字体格式，通常可比 TTF/OTF 减小 50%–70% 体积，且为无损压缩。",
  "faq-font-2Q": "支持哪些字体格式输入？",
  "faq-font-2A": "支持 TTF 和 OTF 字体文件，转换为 WOFF2 后可直接用于网页 @font-face。",
  "faq-font-3Q": "压缩后的字体文件怎么用？",
  "faq-font-3A": "把下载的 .woff2 文件放到网站目录，在 CSS 中通过 @font-face 声明即可，浏览器会按需加载。",
};
const enTool = {
  imageConvert: "Image Converter",
  imageConvertDesc: "Convert between JPG, PNG, WebP and AVIF formats",
  unzip: "Unzip",
  unzipDesc: "Extract ZIP archives locally in your browser",
  font: "Font Compressor",
  fontDesc: "Compress TTF/OTF fonts to WOFF2 web font format",
  breadcrumbHome: "Home",
  breadcrumbTools: "All Tools",
  howToTitle: "How to use",
  faqTitle: "FAQ",
  relatedTitle: "Related Tools",
  "faq-imageConvert-1Q": "Does format conversion reduce quality?",
  "faq-imageConvert-1A": "Conversion itself keeps pixels unchanged. But converting to lossy formats like JPG, WebP or AVIF will change quality depending on the level, so keep a backup of the original lossless file.",
  "faq-imageConvert-2Q": "Which formats can I convert between?",
  "faq-imageConvert-2A": "JPG, PNG, WebP and AVIF can be converted to each other. Everything runs locally in your browser, nothing is uploaded.",
  "faq-imageConvert-3Q": "Where does the converted file go?",
  "faq-imageConvert-3A": "Files are never uploaded. The result is generated in your browser and saved to your device when you click download.",
  "faq-unzip-1Q": "Do I need to install software to unzip?",
  "faq-unzip-1A": "No. Everything runs locally in your browser, no installation needed and no files are uploaded.",
  "faq-unzip-2Q": "Can it handle ZIP files with Chinese filenames?",
  "faq-unzip-2A": "Yes. UTF-8 encoded filenames are supported and displayed/downloaded correctly.",
  "faq-unzip-3Q": "Will large archives freeze the page?",
  "faq-unzip-3A": "We extract streaming file-by-file to keep memory usage low; process very large archives in batches.",
  "faq-font-1Q": "How much can WOFF2 compression save?",
  "faq-font-1A": "WOFF2 is the web-optimized font format, usually 50%–70% smaller than TTF/OTF with lossless quality.",
  "faq-font-2Q": "Which font formats are accepted?",
  "faq-font-2A": "TTF and OTF files are accepted and converted to WOFF2, ready for @font-face in web pages.",
  "faq-font-3Q": "How do I use the compressed font?",
  "faq-font-3A": "Put the downloaded .woff2 file in your site directory and declare it in CSS with @font-face; browsers load it on demand.",
};

// ---------- Home 命名空间（DropZone 按钮双语）----------
const zhHome = { selectFiles: "选择文件", selectFolder: "选择文件夹", paste: "Ctrl+V 粘贴" };
const enHome = { selectFiles: "Select files", selectFolder: "Select folder", paste: "Ctrl+V paste" };

// ---------- Footer.tool ----------
const zhFooterTool = {
  image: "图片压缩",
  pdf: "PDF 压缩",
  video: "视频压缩",
  audio: "音频压缩",
  zip: "ZIP 压缩",
  imageConvert: "图片转换",
  unzip: "ZIP 解压",
  font: "字体压缩",
};
const enFooterTool = {
  image: "Image",
  pdf: "PDF",
  video: "Video",
  audio: "Audio",
  zip: "ZIP",
  imageConvert: "Convert",
  unzip: "Unzip",
  font: "Font",
};

// ---------- 组件命名空间 ----------
const zhComponents = {
  ImageConvert: {
    targetLabel: "目标格式",
    quality: "质量",
    fileCount: "{count} 个文件",
    doneCount: "{count} 个已完成",
    clearAll: "清空",
    error: "转换失败",
    convertBtn: "全部转换",
    converting: "转换中…",
    download: "下载",
  },
  Unzip: {
    zipCount: "{count} 个压缩包",
    doneCount: "{count} 个已解压",
    clearAll: "清空",
    fileCount: "{count} 个文件",
    resultCount: "{count} 个文件",
    error: "解压失败",
    extractBtn: "开始解压",
    extracting: "解压中…",
    download: "下载",
    downloadAll: "全部下载",
  },
  Font: {
    fileCount: "{count} 个字体",
    doneCount: "{count} 个已完成",
    clearAll: "清空",
    error: "转换失败",
    convertBtn: "转换为 WOFF2",
    converting: "转换中…",
    download: "下载",
  },
};
const enComponents = {
  ImageConvert: {
    targetLabel: "Target format",
    quality: "Quality",
    fileCount: "{count} files",
    doneCount: "{count} done",
    clearAll: "Clear all",
    error: "Conversion failed",
    convertBtn: "Convert all",
    converting: "Converting…",
    download: "Download",
  },
  Unzip: {
    zipCount: "{count} archives",
    doneCount: "{count} extracted",
    clearAll: "Clear all",
    fileCount: "{count} files",
    resultCount: "{count} files",
    error: "Extract failed",
    extractBtn: "Extract",
    extracting: "Extracting…",
    download: "Download",
    downloadAll: "Download all",
  },
  Font: {
    fileCount: "{count} fonts",
    doneCount: "{count} done",
    clearAll: "Clear all",
    error: "Conversion failed",
    convertBtn: "Convert to WOFF2",
    converting: "Converting…",
    download: "Download",
  },
};

// 合并
for (const [k, v] of Object.entries(zhTool)) zh.Tool[k] = v;
for (const [k, v] of Object.entries(enTool)) en.Tool[k] = v;
for (const [k, v] of Object.entries(zhHome)) zh.Home[k] = v;
for (const [k, v] of Object.entries(enHome)) en.Home[k] = v;
zh.Footer.tool = zhFooterTool;
en.Footer.tool = enFooterTool;
for (const [k, v] of Object.entries(zhComponents)) zh[k] = v;
for (const [k, v] of Object.entries(enComponents)) en[k] = v;

// 校验
for (const [name, obj] of [
  ["zh", zh],
  ["en", en],
]) {
  JSON.stringify(obj);
  console.log(`${name} JSON 合法, Tool keys=${Object.keys(obj.Tool).length}`);
}
save("zh.json", zh);
save("en.json", en);
console.log("✅ messages 注入完成");
