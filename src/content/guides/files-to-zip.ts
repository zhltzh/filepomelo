import type { Guide } from "./types";

export const filesToZip: Guide = {
  slug: "files-to-zip",
  toolSlug: "zip-compressor",
  toolName: { zh: "ZIP 压缩", en: "ZIP Compressor" },
  datePublished: "2026-11-23",
  dateModified: "2026-11-23",
  related: ["unzip-without-software", "video-compress-too-large", "font-to-woff2"],
  zh: {
    title: "多个文件怎么压缩成一个 ZIP？文件夹打包完整步骤",
    description:
      "几十份简历、一整套素材、交作业要打包发送？说明怎么把多个文件和整个文件夹压缩成一个 ZIP，压缩级别怎么选，以及打包后的检查清单。",
    summary: "一次选文件或整个文件夹，打包成一个 ZIP 再发送。",
    blocks: [
      {
        type: "p",
        text: "发几十个文件时，逐个上传既慢又容易漏。把它们压缩成一个 ZIP，既减少附件数量，也方便对方一次接收和归档。这篇用站内的 [ZIP 压缩](/zip-compressor/) 工具演示打包流程，全程在浏览器本地完成，文件不会上传到服务器。",
      },
      { type: "h2", text: "ZIP 解决的是「数量」和「体积」两个问题" },
      {
        type: "p",
        text: "打包把多个文件收进一个档案，同时用压缩算法减小总体积。对文档、表格、代码、文本类文件效果最好；对 JPG、MP4、MP3 这类已经是压缩格式的文件，体积基本不会变小，但打包带来的「一个文件」仍然有价值。",
      },
      { type: "h2", text: "压缩级别怎么选" },
      {
        type: "ul",
        items: [
          "**快速**：压缩率一般，速度最快，适合几十 MB 的普通文档。",
          "**推荐**：默认选项，压缩率和速度平衡，多数场景用这个。",
          "**最大压缩**：体积极限，耗时更长，适合需要严格控制附件大小的场合。",
        ],
      },
      { type: "h2", text: "操作步骤" },
      {
        type: "ol",
        items: [
          "打开 [ZIP 压缩页](/zip-compressor/)。",
          "把文件拖进去，或点「选择文件夹」递归收集整个目录。",
          "确认列表里的文件数量，同名文件会自动去重。",
          "选压缩级别，一般用「推荐」。",
          "点「打包压缩」，等待处理完成。",
          "下载生成的 ZIP 文件。",
        ],
      },
      {
        type: "cta",
        href: "/zip-compressor/",
        label: "打包成 ZIP（本地压缩，不上传）",
        text: "支持多文件和整个文件夹，自动保留目录结构，三档压缩级别可选。",
      },
      { type: "h2", text: "打包前检查这几项" },
      {
        type: "ul",
        items: [
          "**文件夹结构**：选择文件夹时会保留目录层级，解压后仍是原来的结构。",
          "**同名文件**：不同目录下的同名文件会被去重，打包前留意是否有覆盖风险。",
          "**敏感内容**：ZIP 不支持设置密码，涉及证件、合同等材料时不要用公开渠道传输。",
          "**体积预期**：图片和视频压缩后变化不大，别期待 ZIP 能把它们变小一半。",
        ],
      },
      { type: "h2", text: "对方怎么打开" },
      {
        type: "p",
        text: "生成的是标准 ZIP 格式，Windows 资源管理器、macOS 访达、手机文件管理器都能直接打开。如果对方电脑没有解压软件，可以让他用站内的[在线解压工具](/unzip/)，不需要安装任何程序。",
      },
      {
        type: "p",
        text: "如果打包是为了发送大体积视频，先压缩视频再打包更划算，具体做法见[视频压缩教程](/guides/video-compress-too-large/)。",
      },
      { type: "h2", text: "给压缩包起一个能看懂的名字" },
      {
        type: "p",
        text: "文件名叫「新建文件夹.zip」或者「压缩包 (3).zip」，对方解压后很难判断内容是什么。建议用「项目-日期-版本」的格式，例如「报价单-20261123-终稿.zip」，既方便检索，也能避免同名覆盖。同一项目多次发送时，把版本号放在最后，文件排序时自然按时间排列。",
      },
      { type: "h2", text: "和网盘链接怎么选" },
      {
        type: "p",
        text: "ZIP 适合几十到几百 MB、对方需要下载归档的场景；超过一两 GB，或者需要多人同时访问，网盘链接更合适。邮件附件被拦截时，也可以先打包再上传网盘，把链接发给对方，既保留了目录结构，也绕开了附件限制。",
      },
      { type: "h2", text: "打包后的体积为什么和预期不同" },
      {
        type: "p",
        text: "ZIP 的压缩率取决于内容冗余度。纯文本、日志、CSV 能压到三成左右；DOCX、XLSX、PPTX 本身就是压缩包，几乎压不动；视频和图片更是如此。看到体积只减了一点，不代表打包失败，只是文件类型决定了上限。想真正减小体积，应该先处理里面的视频和图片，再来打包。",
      },
      { type: "h2", text: "这些情况不需要 ZIP" },
      {
        type: "p",
        text: "只有一个文件时，打包不会带来任何好处，直接发送即可。需要保留文件权限、符号链接或完整的目录结构时，ZIP 也不是最合适的选择，应该用 tar 或直接压缩目录。至于保密需求，ZIP 没有密码功能，应该先用专门的加密工具处理，再传输。",
      },
      {
        type: "p",
        text: "最后提醒一个顺序问题：先压缩体积再打包，比先打包再压缩有效得多。ZIP 无法充分压缩已经打包过的内容，而视频、图片单独压过之后，再打进 ZIP 就不会重复劳动。",
      },
    ],
    faq: [
      {
        q: "ZIP 和 RAR 有什么区别？",
        a: "两者都是压缩归档格式。ZIP 兼容性更好，主流系统自带支持；RAR 需要专门软件，压缩率略高。",
      },
      {
        q: "能设置密码吗？",
        a: "目前不支持加密。需要保密的文件建议先单独加密，或通过可信的私有渠道发送。",
      },
      {
        q: "能保留文件夹结构吗？",
        a: "可以。选择文件夹时会按原目录层级打包，解压后结构与原目录一致。",
      },
      {
        q: "为什么打包后体积没小多少？",
        a: "如果里面主要是 JPG、MP4、MP3、DOCX 等已压缩格式，ZIP 很难再压小，打包的主要作用是合并成一个文件。",
      },
      {
        q: "文件会上传吗？",
        a: "不会，压缩和打包全部在浏览器本地完成。",
      },
      {
        q: "打包数量有上限吗？",
        a: "页面会提示单次可处理的文件上限，超过时建议分批打包，避免浏览器内存吃紧。",
      },
    ],
  },
  en: {
    title: "How to Compress Multiple Files into One ZIP",
    description:
      "Sending dozens of resumes, a full asset folder or an assignment? Learn how to pack files and whole directories into one ZIP, which compression level to pick, and what to check before sending.",
    summary: "Select files or a whole folder, pack them into one ZIP, then send.",
    blocks: [
      {
        type: "p",
        text: "Uploading dozens of files one by one is slow and easy to get wrong. Packing them into a single ZIP reduces the attachment count and gives the recipient one archive to keep. This guide uses the [ZIP compressor](/zip-compressor/) on this site; everything runs locally in the browser and nothing is uploaded.",
      },
      { type: "h2", text: "ZIP solves count and size" },
      {
        type: "p",
        text: "Packing collects many files into one archive and applies compression to reduce the total size. Documents, spreadsheets, code and text shrink the most. JPEG, MP4 and MP3 files are already compressed, so the size barely changes, but the single-file convenience is still worth it.",
      },
      { type: "h2", text: "Choosing a compression level" },
      {
        type: "ul",
        items: [
          "**Fast**: modest compression at the highest speed, good for ordinary documents.",
          "**Recommended**: the default balance of size and speed; right for most cases.",
          "**Max compression**: smallest output, longer runtime, useful when an attachment limit is strict.",
        ],
      },
      { type: "h2", text: "Step by step" },
      {
        type: "ol",
        items: [
          "Open the [ZIP compressor](/zip-compressor/).",
          "Drop files in, or click \"Select folder\" to collect an entire directory recursively.",
          "Check the file count in the list; duplicate names are merged automatically.",
          "Pick a compression level, usually \"Recommended\".",
          "Click pack and wait for the process to finish.",
          "Download the generated ZIP.",
        ],
      },
      {
        type: "cta",
        href: "/zip-compressor/",
        label: "Pack files into a ZIP locally",
        text: "Multiple files or a whole folder, directory structure preserved, three compression levels.",
      },
      { type: "h2", text: "Check these before sending" },
      {
        type: "ul",
        items: [
          "**Folder structure**: selecting a folder keeps the directory levels, so it unpacks the same way.",
          "**Duplicate names**: files with the same name in different folders are merged; confirm nothing important is overwritten.",
          "**Sensitive content**: ZIP here has no password option, so avoid public channels for IDs or contracts.",
          "**Size expectations**: photos and videos will not shrink much; do not expect a 50 percent saving.",
        ],
      },
      { type: "h2", text: "How the recipient opens it" },
      {
        type: "p",
        text: "The output is a standard ZIP that Windows Explorer, macOS Finder and phone file managers open natively. If the recipient has no extraction software, point them to the [online ZIP extractor](/unzip/), which needs no installation.",
      },
      {
        type: "p",
        text: "If the goal is to send large videos, compress them first and then pack; see the [video compression guide](/guides/video-compress-too-large/).",
      },
      { type: "h2", text: "Name the archive so people can find it" },
      {
        type: "p",
        text: "Names such as \"New folder.zip\" or \"archive (3).zip\" tell the recipient nothing. Use project-date-version, for example quote-20261123-final.zip. Keep the version last so files sort chronologically and nothing gets overwritten. When you send several rounds, this habit saves a surprising amount of back-and-forth.",
      },
      { type: "h2", text: "ZIP or a cloud link?" },
      {
        type: "p",
        text: "ZIP suits files from tens to a few hundred megabytes that the recipient wants to download and archive. Above one or two gigabytes, or when several people need access, a cloud link is better. If email blocks the attachment, pack the files, upload the ZIP and send the link — you keep the folder structure and avoid attachment limits.",
      },
      { type: "h2", text: "Why the size barely changed" },
      {
        type: "p",
        text: "Compression depends on redundancy. Plain text, logs and CSV files may shrink by 70 percent; DOCX, XLSX and PPTX are already compressed and barely move, and video or images even less. A small reduction is not a failed pack; it reflects the file types. To really cut the size, compress the videos and images first, then pack.",
      },
      { type: "h2", text: "A quick pre-send checklist" },
      {
        type: "p",
        text: "Open the archive once and confirm the folder structure, the file count and that no important file was overwritten by a duplicate name. Check the final size against the destination limit, and make sure nothing confidential is inside, since ZIP here cannot be password protected.",
      },
      { type: "h2", text: "When ZIP is the wrong choice" },
      {
        type: "p",
        text: "Packing a single file adds nothing, so send it directly. If you need to preserve permissions, symbolic links or a repository layout, ZIP is not the right format; use tar or compress the directory. For confidentiality, this ZIP has no password option, so encrypt the file with a dedicated tool before sending.",
      },
      {
        type: "p",
        text: "One ordering tip: shrink first, pack second. ZIP cannot compress content that is already archived, while videos and images compressed on their own before packing save real space without duplicate work.",
      },
      {
        type: "p",
        text: "If dates matter, verify the archive right after packing instead of waiting for feedback. Content and names are what recipients check first, and a quick look catches most mistakes.",
      },
    ],
    faq: [
      {
        q: "What is the difference between ZIP and RAR?",
        a: "Both are compressed archives. ZIP has broader built-in support across operating systems; RAR needs dedicated software and usually compresses slightly better.",
      },
      {
        q: "Can I add a password?",
        a: "Not currently. Encrypt sensitive files separately or share them over a trusted private channel.",
      },
      {
        q: "Is the folder structure preserved?",
        a: "Yes. Selecting a folder packs it with its directory levels, so it extracts identically.",
      },
      {
        q: "Why did the size barely change?",
        a: "If the archive is mostly JPEG, MP4, MP3 or DOCX files, there is little left to compress. The main benefit is having one file.",
      },
      {
        q: "Are files uploaded?",
        a: "No. Compression and packing happen entirely in your browser.",
      },
      {
        q: "Is there a file count limit?",
        a: "The page shows the per-run limit. Split large jobs into batches to keep browser memory comfortable.",
      },
      {
        q: "Can I pack files from a phone?",
        a: "Mobile browsers allow multiple file selection but usually cannot pick a whole directory. Pack the folder on a computer, or add files in batches; the archive opens anywhere.",
      },
      {
        q: "Are original modification times kept?",
        a: "File content is preserved, but browsers may reset timestamps to the packing time. Download and check the archive before delivery if dates matter.",
      },
    ],
  },
};
