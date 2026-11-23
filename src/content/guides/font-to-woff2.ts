import type { Guide } from "./types";

export const fontToWoff2: Guide = {
  slug: "font-to-woff2",
  toolSlug: "font-compressor",
  toolName: { zh: "字体压缩", en: "Font Compressor" },
  datePublished: "2026-11-23",
  dateModified: "2026-11-23",
  related: ["files-to-zip", "compress-mp3-audio", "unzip-without-software"],
  zh: {
    title: "字体文件怎么压缩成 WOFF2？网页字体加载优化",
    description:
      "中文字体 TTF 动辄十几 MB，网页首屏被拖慢？说明 WOFF2 为何能省一半以上体积，以及在浏览器里本地转换、接入 @font-face 的完整步骤。",
    summary: "TTF、OTF 转 WOFF2，无损压缩 50%–70%，直接用于网页。",
    blocks: [
      {
        type: "p",
        text: "网页里放一个中文字体，TTF 常常 8–15MB，用户要等好几秒才能看到正确字形。WOFF2 是专为网页设计的字体格式，压缩后通常只有原文件的一半甚至三成，而且是无损的——字形不会有任何变化。这篇用站内的 [字体压缩](/font-compressor/) 工具把 TTF、OTF 转成 WOFF2，转换在浏览器本地完成。",
      },
      { type: "h2", text: "WOFF2 为什么更小" },
      {
        type: "p",
        text: "TTF 和 OTF 保存的是完整字形轮廓和大量元数据，WOFF2 用 Brotli 重新压缩字形数据，并采用更适合网络传输的结构。体积下降来自编码方式，与删字无关，所以不会出现某些字变成方框的情况。",
      },
      { type: "h2", text: "操作步骤" },
      {
        type: "ol",
        items: [
          "打开 [字体压缩页](/font-compressor/)，支持 TTF 和 OTF。",
          "把字体文件拖进页面，可一次多选。",
          "点「转换为 WOFF2」，等待编码完成。",
          "页面显示原始大小和转换后大小。",
          "点击下载，得到 .woff2 文件。",
        ],
      },
      {
        type: "cta",
        href: "/font-compressor/",
        label: "转换为 WOFF2（本地编码，不上传字体）",
        text: "支持 TTF、OTF 批量转换，适合未公开或付费授权的字体文件。",
      },
      { type: "h2", text: "接入网页" },
      {
        type: "p",
        text: "把 .woff2 放到站点静态资源目录，用 @font-face 声明，再把 font-family 应用到需要的元素上：",
      },
      {
        type: "code",
        text: `@font-face {
  font-family: "MyFont";
  src: url("/fonts/myfont.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}

body {
  font-family: "MyFont", system-ui, sans-serif;
}`,
      },
      {
        type: "p",
        text: "font-display: swap 让文字先用系统字体显示，字体加载完再替换，避免首屏空白。如果字体只用于标题，也可以只加载需要的字重，进一步减少请求。",
      },
      { type: "h2", text: "还能更小吗" },
      {
        type: "ul",
        items: [
          "**子集化**：把字体裁剪成只包含页面实际用到的字符，中文站点常能把十几 MB 压到几百 KB；本站做的是整字体转换，不删字符，需要子集化请配合其他工具。",
          "**只转需要的字重**：Regular 和 Bold 各转一个文件，不要把所有字重都打包。",
          "**缓存**：字体文件设置长缓存头，配合 font-display 使用体验更好。",
        ],
      },
      { type: "h2", text: "注意授权" },
      {
        type: "p",
        text: "商业字体通常有授权范围，网页使用（Web font）可能需要单独授权。转换格式本身不改变授权，上线前请确认字体许可允许网页嵌入。",
      },
      {
        type: "p",
        text: "多个字体文件需要一起交付时，可以先用 [ZIP 压缩](/zip-compressor/) 打包，下载更方便。",
      },
      { type: "h2", text: "中文字体为什么特别大" },
      {
        type: "p",
        text: "常用汉字三千多个，一个完整字库往往包含两万多个字形，每个字形又有多条轮廓曲线，加起来就是 8–15MB。英文字体只有几十到几百个字符，所以通常不到 1MB。这也解释了为什么中文网页字体必须压缩，而且往往还需要子集化——只靠换格式，降不到几百 KB 的量级。",
      },
      { type: "h2", text: "首屏字体闪烁怎么办" },
      {
        type: "p",
        text: "字体加载完成前，浏览器要么不显示文字（FOIT），要么先用回退字体显示再替换（FOUT）。font-display: swap 属于后者，内容能立即阅读，代价是字形切换时有一次轻微跳变。对品牌要求高的标题字体，可以用 preload 让浏览器更早开始下载；正文保持 swap 即可。",
      },
      { type: "h2", text: "转换效果的合理预期" },
      {
        type: "p",
        text: "一个 10MB 的 TTF 中文字体，转成 WOFF2 后通常在 3–5MB 之间，具体取决于字形数量。页面在转换前后都会显示体积，先看一眼数字，再决定是否需要继续子集化。不要期待无损压缩能单独解决所有加载问题，格式转换只是第一步。",
      },
      { type: "h2", text: "图标字体还要不要用" },
      {
        type: "p",
        text: "图标字体本质上也是字体文件，同样受加载体积影响。现在更推荐用 SVG 图标，按需引入、体积可控，还能单独修改颜色和尺寸。如果项目里仍在用图标字体，转成 WOFF2 能减少一部分体积，但要接受首次加载仍需下载整个字库。",
      },
      {
        type: "p",
        text: "另一个方向是可变字体：一个文件包含多个字重，转成 WOFF2 后比分别加载 Regular、Bold 两个文件更省请求。是否值得用，取决于页面实际用到的字重数量。",
      },
    ],
    faq: [
      {
        q: "转换会损失字形吗？",
        a: "不会。WOFF2 是无损压缩，轮廓和字符集完整保留，渲染效果和原字体一致。",
      },
      {
        q: "支持哪些输入格式？",
        a: "目前支持 TTF 和 OTF，输出统一为 WOFF2。",
      },
      {
        q: "能只保留部分字符吗？",
        a: "本站是整字体转换，不做子集化。中文字体想进一步瘦身，需要用子集化工具按用字表裁剪。",
      },
      {
        q: "文件会上传吗？",
        a: "不会。字体在浏览器本地编码，适合未公开或付费授权的字体。",
      },
      {
        q: "浏览器都支持 WOFF2 吗？",
        a: "Chrome、Edge、Firefox、Safari 等主流浏览器都支持。IE 不支持，如需兼容老浏览器可另外保留 TTF。",
      },
      {
        q: "WOFF2 能再转回 TTF 吗？",
        a: "可以，用字体编辑工具打开后另存为 TTF 即可。不过转回去体积会变大，网页使用没有必要绕这一圈。",
      },
      {
        q: "WOFF2 比 TTF 小多少？",
        a: "英文字体通常小 50%–70%，中文字体因为字形多，节省比例往往更高，实测常见 60%–75%。具体取决于字体本身和字形数量，转换前后页面上都有体积对比。",
      },
    ],
  },
  en: {
    title: "How to Compress Fonts to WOFF2 for Faster Web Loading",
    description:
      "Chinese TTF fonts often reach 15MB and delay the first screen. Learn why WOFF2 cuts 50–70 percent with no quality loss, and how to convert locally in the browser and wire up @font-face.",
    summary: "Convert TTF and OTF to WOFF2 with 50–70 percent lossless savings.",
    blocks: [
      {
        type: "p",
        text: "A Chinese web font as TTF is often 8–15MB, so users wait seconds before glyphs render correctly. WOFF2 is built for the web: it usually shrinks a font to half or even a third of its original size, and the compression is lossless, so glyph shapes do not change. This guide uses the [font compressor](/font-compressor/) on this site; conversion happens locally in your browser.",
      },
      { type: "h2", text: "Why WOFF2 is smaller" },
      {
        type: "p",
        text: "TTF and OTF store full outlines and a lot of metadata. WOFF2 re-compresses glyph data with Brotli and uses a container designed for network transfer. The savings come from encoding, not from deleting characters, so no glyph turns into a placeholder box.",
      },
      { type: "h2", text: "Step by step" },
      {
        type: "ol",
        items: [
          "Open the [font compressor](/font-compressor/); TTF and OTF are supported.",
          "Drop the font files into the page; multiple files are allowed.",
          "Click convert and wait for encoding to finish.",
          "Compare the original and converted sizes shown on the page.",
          "Download the .woff2 files.",
        ],
      },
      {
        type: "cta",
        href: "/font-compressor/",
        label: "Convert fonts to WOFF2 locally",
        text: "Batch convert TTF and OTF; suitable for unreleased or commercially licensed fonts.",
      },
      { type: "h2", text: "Using the font on a site" },
      {
        type: "p",
        text: "Put the .woff2 file in your static assets folder, declare it with @font-face, then apply the family to the elements that need it:",
      },
      {
        type: "code",
        text: `@font-face {
  font-family: "MyFont";
  src: url("/fonts/myfont.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}

body {
  font-family: "MyFont", system-ui, sans-serif;
}`,
      },
      {
        type: "p",
        text: "font-display: swap shows system text first and swaps in the font when it loads, avoiding a blank first screen. If the font is only used for headings, load just the weights you need.",
      },
      { type: "h2", text: "Can it get even smaller?" },
      {
        type: "ul",
        items: [
          "**Subsetting**: trim the font to the characters the page actually uses; this often takes a Chinese font from 15MB to a few hundred KB. This site converts the whole font and keeps every glyph, so use a subsetting tool for that step.",
          "**Only the weights you use**: convert Regular and Bold separately instead of shipping every weight.",
          "**Caching**: serve fonts with long cache headers and pair them with font-display.",
        ],
      },
      { type: "h2", text: "Check the license" },
      {
        type: "p",
        text: "Commercial fonts usually come with license terms, and web usage may require a separate web license. Converting the format does not change the license, so confirm that web embedding is allowed before going live.",
      },
      {
        type: "p",
        text: "If you need to deliver several font files together, [pack them into a ZIP](/zip-compressor/) for easier download.",
      },
      { type: "h2", text: "Why Chinese fonts are so large" },
      {
        type: "p",
        text: "A complete Chinese font usually contains more than 20,000 glyphs, and each glyph stores several outline curves, which adds up to 8–15MB. Latin fonts hold a few hundred characters and stay under a megabyte. That is why Chinese web fonts always need compression, and often subsetting too — changing the format alone cannot bring the file down to a few hundred kilobytes.",
      },
      { type: "h2", text: "Handling the first-screen flash" },
      {
        type: "p",
        text: "Before a font loads, browsers either hide text (FOIT) or show a fallback and swap later (FOUT). font-display: swap chooses the second, so content is readable immediately at the cost of one small visual shift. For brand-critical headings, preload the font so the download starts earlier; body text can stay on swap.",
      },
      { type: "h2", text: "What to expect from conversion" },
      {
        type: "p",
        text: "A 10MB TTF usually becomes 3–5MB as WOFF2, depending on the glyph count. The page shows sizes before and after, so check the numbers before deciding whether subsetting is needed. Lossless conversion solves part of the loading problem, not all of it. If the result is still too heavy, using system fonts for body text is often the cheaper fix.",
      },
      { type: "h2", text: "Do you still need icon fonts?" },
      {
        type: "p",
        text: "Icon fonts are font files too and carry the same loading cost. SVG icons are usually a better choice today: they load on demand, keep the size under control, and let you change color and size individually. If a project still uses an icon font, WOFF2 trims some weight, but the whole set still downloads on first use.",
      },
      {
        type: "p",
        text: "Variable fonts are the other direction: one file covers several weights and, as WOFF2, often beats loading Regular and Bold separately. Whether it pays off depends on how many weights the page truly uses.",
      },
    ],
    faq: [
      {
        q: "Does conversion damage the glyphs?",
        a: "No. WOFF2 is lossless; outlines and the character set are preserved, and rendering matches the original font.",
      },
      {
        q: "Which input formats are supported?",
        a: "TTF and OTF, with WOFF2 as the output format.",
      },
      {
        q: "Can I keep only some characters?",
        a: "This tool converts the whole font and does not subset. Use a subsetting tool with a character list to shrink Chinese fonts further.",
      },
      {
        q: "Are font files uploaded?",
        a: "No. Encoding runs in your browser, so unreleased or licensed fonts stay private.",
      },
      {
        q: "Do all browsers support WOFF2?",
        a: "Chrome, Edge, Firefox and Safari do. Internet Explorer does not, so keep a TTF fallback if you must support legacy browsers.",
      },
      {
        q: "Does WOFF2 work for Chinese fonts?",
        a: "Yes, CJK fonts convert the same way. Expect a smaller percentage saving than for Latin fonts because the glyph data is far larger, and subsetting remains the biggest win.",
      },
      {
        q: "Can I convert WOFF2 back to TTF?",
        a: "Yes, with a font editor. There is rarely a reason to do so for the web, and the TTF will be larger; keep the original as the master.",
      },
      {
        q: "How much smaller is WOFF2 than TTF?",
        a: "Typically 50–70 percent for Latin fonts and 60–75 percent for CJK fonts in our tests; the actual numbers depend on the font and its glyph count.",
      },
    ],
  },
};
