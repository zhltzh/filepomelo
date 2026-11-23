import type { Guide } from "./types";

export const unzipWithoutSoftware: Guide = {
  slug: "unzip-without-software",
  toolSlug: "unzip",
  toolName: { zh: "ZIP 解压", en: "ZIP Extractor" },
  datePublished: "2026-11-23",
  dateModified: "2026-11-23",
  related: ["files-to-zip", "video-compress-too-large", "compress-mp3-audio"],
  zh: {
    title: "ZIP 怎么解压？不装软件在浏览器里解压的方法",
    description:
      "收到 ZIP 却提示需要解压软件？本文说明在浏览器里直接打开 ZIP、查看文件列表并下载所需文件的步骤，以及中文文件名和安全方面的注意事项。",
    summary: "打开网页就能解压，公用电脑也不用装软件。",
    blocks: [
      {
        type: "p",
        text: "公司电脑装不了软件、手机上没有解压 App、临时借用别人的电脑——这些场景下收到一个 ZIP 很尴尬。其实解压完全可以在浏览器里完成：把压缩包拖进网页，工具读出里面的文件列表，再逐个下载。这篇用站内的 [ZIP 解压](/unzip/) 工具演示，压缩包不会上传到服务器。",
      },
      { type: "h2", text: "浏览器解压能做什么" },
      {
        type: "p",
        text: "工具读取 ZIP 的目录结构，在页面上列出每个文件的名字和大小，解压后可以单独下载某个文件，也可以全部下载。整个过程在本地完成，适合不方便安装软件的办公环境。",
      },
      { type: "h2", text: "操作步骤" },
      {
        type: "ol",
        items: [
          "打开 [ZIP 解压页](/unzip/)。",
          "把 ZIP 文件拖进页面，或点击选择文件。",
          "点「开始解压」，等待目录解析完成。",
          "在结果列表里查看文件，按需下载单个文件，或点「全部下载」。",
          "文件名过长或层级较深时，下载后自行整理目录即可。",
        ],
      },
      {
        type: "cta",
        href: "/unzip/",
        label: "在线解压 ZIP（本地解析，不上传）",
        text: "支持多包批量解压、中文文件名，解压后可单独或全部下载文件。",
      },
      { type: "h2", text: "中文文件名会不会乱码" },
      {
        type: "p",
        text: "老版本 Windows 打包的 ZIP 常用 GBK 编码保存文件名，部分工具解出来会变成乱码。本站按 UTF-8 解析，主流系统生成的压缩包一般正常；如果遇到乱码，用系统自带的解压功能打开原包再另存一次即可修正。",
      },
      { type: "h2", text: "安全提醒" },
      {
        type: "ul",
        items: [
          "只解压来源可信的压缩包，陌生人发来的「发票.zip」「照片.zip」可能是恶意程序。",
          "解压后不要直接双击运行 .exe、.bat、.scr 等可执行文件。",
          "带密码的压缩包无法在这里解密，需要向发送方索取无密码版本。",
          "超大压缩包建议分批处理，避免浏览器内存吃紧。",
        ],
      },
      { type: "h2", text: "需要自己打包时" },
      {
        type: "p",
        text: "如果是要把多个文件发给别人，用站内的 [ZIP 压缩](/zip-compressor/) 工具打包成标准 ZIP，对方在任何系统上都能打开，具体步骤见[打包成 ZIP 教程](/guides/files-to-zip/)。",
      },
      { type: "h2", text: "解压后怎么整理文件" },
      {
        type: "p",
        text: "浏览器下载默认进入同一个下载目录，几十个文件堆在一起很难找。建议解压前先建一个以压缩包命名的文件夹，下载时按类型分批处理：图片、文档、表格分开下，全部完成后再统一移动归档。文件名重复时浏览器会自动加序号，整理时留意不要误删。",
      },
      { type: "h2", text: "手机和公用电脑上的注意事项" },
      {
        type: "p",
        text: "手机上解压大压缩包容易因为内存不足中断，建议一次只处理一个包，并保持屏幕常亮。公用电脑上解压后，记得清理下载目录，尤其是包含身份证件、合同扫描件的文件，不要留在别人能打开的路径里。",
      },
      { type: "h2", text: "什么时候该换工具" },
      {
        type: "p",
        text: "如果压缩包带密码，或者包含分卷文件（.z01、.z02），在线解压无法处理，需要回到系统自带的解压软件。解压后文件损坏，多半是压缩包本身传输不完整，重新下载一次通常就能解决。",
      },
      { type: "h2", text: "解压前先看一眼目录" },
      {
        type: "p",
        text: "正常的压缩包在解压前后都能看到文件列表和大小。先扫一遍：有没有不该出现的 .exe、.scr 文件，总体积是否和对方描述相符，文件数量是不是明显异常。确认没问题再下载，能省掉很多事后处理。",
      },
      {
        type: "p",
        text: "只需要其中一两个文件时，不必全部下载。按文件名定位后单独下载即可，速度和流量都更省，也避免把无关文件放进自己的电脑。",
      },
      { type: "h2", text: "几个 GB 的超大压缩包" },
      {
        type: "p",
        text: "几个 GB 的压缩包更适合用桌面端解压软件处理。浏览器解压要把目录和文件数据读进内存，建议控制在几百 MB 以内，同时关闭其他占用内存的标签页。如果中途失败，先确认压缩包完整，再考虑拆分处理。",
      },
      {
        type: "p",
        text: "日常收到的简历包、素材包通常只有几十 MB，浏览器完全够用；真正的大体积备份适合同步盘或桌面工具，不必勉强在网页里处理。",
      },
    ],
    faq: [
      {
        q: "解压需要安装软件吗？",
        a: "不需要，网页内完成，适合公司电脑或手机等不方便安装软件的环境。",
      },
      {
        q: "中文文件名会乱码吗？",
        a: "一般不会。工具按 UTF-8 解析，少数老式 GBK 压缩包可能出现乱码，可用系统自带解压另存修正。",
      },
      {
        q: "压缩包会上传服务器吗？",
        a: "不会，解析和下载都在浏览器本地完成。",
      },
      {
        q: "能解压 RAR 或 7z 吗？",
        a: "目前只支持 ZIP 格式，其他格式需要先转换成 ZIP。",
      },
      {
        q: "手机能用吗？",
        a: "可以，页面适配手机浏览器，解压后文件会保存到浏览器的下载目录。",
      },
      {
        q: "解压后的文件在哪？",
        a: "在你本机的下载目录里，本站不留存任何副本，关闭页面即全部释放。",
      },
      {
        q: "压缩包里的文件名变成乱码或问号怎么办？",
        a: "先确认压缩包来源系统。Windows 生成的老压缩包可能是 GBK 编码，可以用系统自带解压软件解压后重新打包为 UTF-8，或直接在原系统里打开；本站按 UTF-8 解析，无法自动猜出其他编码。",
      },
    ],
  },
  en: {
    title: "How to Unzip a ZIP File Without Installing Software",
    description:
      "Received a ZIP but your computer asks for extraction software? Learn how to open a ZIP in the browser, inspect the file list and download what you need, plus notes on Chinese file names and safety.",
    summary: "Open a web page to extract; no software needed on a shared computer.",
    blocks: [
      {
        type: "p",
        text: "A locked-down work laptop, a phone without an extraction app, a borrowed computer — receiving a ZIP in these situations is awkward. Extraction can happen in the browser: drop the archive into a page, the tool reads its file list, and you download what you need. This guide uses the [ZIP extractor](/unzip/) on this site, and the archive is never uploaded.",
      },
      { type: "h2", text: "What browser extraction can do" },
      {
        type: "p",
        text: "The tool reads the ZIP directory and lists each file with its name and size. After extraction you can download a single file or all of them. Everything happens locally, which suits office machines where installing software is not allowed.",
      },
      { type: "h2", text: "Step by step" },
      {
        type: "ol",
        items: [
          "Open the [ZIP extractor](/unzip/).",
          "Drop the ZIP into the page or click to select a file.",
          "Press start and wait for the archive to be parsed.",
          "Review the file list, then download a single file or use download-all.",
          "Tidy long names or deep folders locally after downloading.",
        ],
      },
      {
        type: "cta",
        href: "/unzip/",
        label: "Extract ZIP files locally",
        text: "Batch extraction, Chinese file names supported, download files individually or all at once.",
      },
      { type: "h2", text: "Will Chinese file names break?" },
      {
        type: "p",
        text: "Older Windows tools stored names as GBK, which some extractors show as garbled text. This tool reads UTF-8, so archives from current systems are fine. If a name looks wrong, open the archive with the system extractor and re-save it once.",
      },
      { type: "h2", text: "Safety notes" },
      {
        type: "ul",
        items: [
          "Only extract archives from sources you trust; an unexpected \"invoice.zip\" or \"photos.zip\" may carry malware.",
          "Do not double-click .exe, .bat or .scr files that come out of an archive.",
          "Password-protected ZIP files cannot be decrypted here; ask the sender for an unprotected copy.",
          "Process very large archives in batches so browser memory stays comfortable.",
        ],
      },
      { type: "h2", text: "When you need to pack files yourself" },
      {
        type: "p",
        text: "To send multiple files to someone, use the [ZIP compressor](/zip-compressor/) to build a standard archive that opens on any system. The steps are in the [pack files into a ZIP guide](/guides/files-to-zip/).",
      },
      { type: "h2", text: "Organizing what you extract" },
      {
        type: "p",
        text: "Browser downloads all land in the same folder, and dozens of files quickly become hard to find. Create a folder named after the archive first, download in batches by type — images, documents, spreadsheets — then move the results together. Browsers append numbers to duplicate names, so check before deleting anything.",
      },
      { type: "h2", text: "Phones and shared computers" },
      {
        type: "p",
        text: "Large archives can run out of memory on a phone. Process one at a time and keep the screen awake. On a shared computer, clear the download folder afterwards, especially for scanned IDs or contracts that should not be left where the next person can open them.",
      },
      { type: "h2", text: "When to use another tool" },
      {
        type: "p",
        text: "Password-protected or split archives (.z01, .z02) cannot be handled online; use the system extractor instead. If the output looks corrupted, the archive was probably downloaded incompletely — fetch it again before suspecting the tool.",
      },
      { type: "h2", text: "Look at the listing before extracting" },
      {
        type: "p",
        text: "A normal archive shows its file list and sizes before extraction. Scan it for unexpected .exe or .scr files, a total size that does not match what the sender described, or an odd file count. Confirming first saves cleanup later.",
      },
      {
        type: "p",
        text: "When you only need one or two files, download them individually instead of everything. It is faster, uses less data, and keeps unrelated files off your machine.",
      },
      { type: "h2", text: "Multi-gigabyte archives" },
      {
        type: "p",
        text: "Archives of several gigabytes are better handled by a desktop extractor. Browser extraction holds the directory and file data in memory, so stay within a few hundred megabytes and close other heavy tabs. If a run fails halfway, verify the archive is complete before splitting it. The tool is built for everyday attachments, not media archives.",
      },
      { type: "h2", text: "Preview before you download" },
      {
        type: "p",
        text: "The listing also tells you what kind of archive you received. A folder of screenshots where a PDF was promised, or a single executable inside an otherwise normal document pack, is worth questioning before downloading anything. A preview costs a few seconds and avoids surprises.",
      },
    ],
    faq: [
      {
        q: "Do I need to install anything?",
        a: "No. Extraction runs in the web page, which is useful on managed work computers and phones.",
      },
      {
        q: "Will Chinese file names be garbled?",
        a: "Usually not. The tool reads UTF-8; rare legacy GBK archives may need a re-save with the system extractor.",
      },
      {
        q: "Is the archive uploaded?",
        a: "No. Parsing and downloading happen locally in your browser.",
      },
      {
        q: "Can it open RAR or 7z?",
        a: "Only ZIP is supported. Convert other formats to ZIP first.",
      },
      {
        q: "Does it work on phones?",
        a: "Yes, the page fits mobile browsers and extracted files go to the browser download folder.",
      },
      {
        q: "Where do the extracted files go?",
        a: "To your local download folder. No copy is kept by this site, and everything is released when you close the page.",
      },
      {
        q: "The file names look garbled — what now?",
        a: "Legacy Windows archives may store names as GBK. Re-save the archive as UTF-8 with a system extractor, or open it on the original system. This tool reads UTF-8 and cannot guess other encodings.",
      },
      {
        q: "Does extraction modify the files?",
        a: "No. Files come out byte for byte; the tool only reads the archive and hands you the contents.",
      },
      {
        q: "Can I extract only one subfolder?",
        a: "Yes. The listing shows paths, so download only the files inside the folder you need instead of taking everything.",
      },
      {
        q: "Is there a size limit?",
        a: "Very large single files can exceed browser memory. If a download stalls, close other tabs and try a smaller archive.",
      },
      {
        q: "Can I extract several archives at once?",
        a: "Yes. Drop multiple ZIP files and each is parsed separately; results are grouped per archive so downloads stay easy to follow.",
      },
      {
        q: "Do I need to keep the page open?",
        a: "Only while extracting. Once the files are downloaded, closing the page is safe and nothing is retained.",
      },
    ],
  },
};
