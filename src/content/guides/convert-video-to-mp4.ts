import type { Guide } from "./types";

export const convertVideoToMp4: Guide = {
  slug: "convert-video-to-mp4",
  toolSlug: "video-compressor",
  toolName: { zh: "视频压缩", en: "Video Compressor" },
  datePublished: "2026-11-23",
  dateModified: "2026-11-23",
  related: ["video-compress-too-large", "compress-mp3-audio", "unzip-without-software"],
  zh: {
    title: "视频怎么转成 MP4？MOV、FLV、3GP 转码方法",
    description:
      "MOV 在安卓上打不开、FLV 网页播不了？讲清容器格式的兼容性问题，以及在浏览器里把 MOV、FLV、3GP、OGV 转成通用 MP4 的步骤和注意事项。",
    summary: "兼容性最好的 MP4，把老格式一次性转过来。",
    blocks: [
      {
        type: "p",
        text: "同事发来的 MOV 在 Windows 上没声音、下载的 FLV 课件只能靠老播放器、老手机拍的 3GP 导进剪辑软件直接报错——这些几乎都是容器和编码不兼容。把视频转成 MP4（H.264 + AAC）是兼容性最好的做法，手机、浏览器、剪辑软件基本都能直接打开。这篇说明怎么在浏览器里完成转换。",
      },
      { type: "h2", text: "先分清容器和编码" },
      {
        type: "p",
        text: "MP4、MOV、MKV、FLV 是容器，里面装的是 H.264、H.265、VP9 等编码。能不能播放，取决于播放器认不认识容器，以及有没有对应的解码器。MP4 容器加 H.264 编码的组合支持面最广，所以「转 MP4」实际上同时包含换容器和重新编码两件事。",
      },
      { type: "h2", text: "这个工具会输出什么" },
      {
        type: "ul",
        items: [
          "**MP4、MOV**：输出 MP4，使用浏览器硬件编码（H.264），速度最快。",
          "**FLV、3GP、OGV**：由 FFmpeg 兜底转成 H.264 MP4，老格式也能救回来。",
          "**MKV、WebM**：保持原容器重新编码，体积变小但格式不变。",
          "**AVI**：不在支持列表内，需要先用其他工具转成上述任一格式再处理。",
        ],
      },
      { type: "h2", text: "转 MP4 的操作步骤" },
      {
        type: "ol",
        items: [
          "打开[视频压缩页](/video-compressor/)。",
          "把 MOV、FLV、3GP 等文件拖进去，支持一次多选。",
          "压缩档位选「高质量」，转码场景优先保住画质。",
          "需要控制体积时填目标大小，比如发微信填 20000（KB）。",
          "点「开始压缩」，等待进度条走完。",
          "在结果里下载 MP4 文件，或打包成 zip 一次取回。",
        ],
      },
      {
        type: "cta",
        href: "/video-compressor/",
        label: "转换为 MP4（浏览器本地处理）",
        text: "MOV、FLV、3GP、OGV 统一输出 H.264 MP4，可批量处理并控制目标体积。",
      },
      { type: "h2", text: "转码后要注意的三件事" },
      {
        type: "ul",
        items: [
          "**音画同步**：重编码会重建时间轴，正常素材不会错位；原文件本身有问题的，转完依然异常。",
          "**字幕**：外挂字幕不会被烧进画面，内嵌字幕轨道在重编码后可能丢失，需要字幕请单独保留。",
          "**体积与画质**：H.264 重编码通常比原文件小，但 MOV 里的 ProRes 高质量素材转成 MP4 后画质会有损失，归档请保留原片。",
        ],
      },
      { type: "h2", text: "什么情况不需要转" },
      {
        type: "p",
        text: "如果只是在自己电脑上播放，装一个支持对应格式的播放器更省事。转 MP4 主要解决「发给别人」和「上传到平台」的兼容问题，比如投稿后台、在线课堂、剪辑软件导入。转完顺带压缩一次体积，往往比单独再做一遍更高效。",
      },
      {
        type: "p",
        text: "如果是纯音频的兼容问题，比如 WMA 在手机上放不了，可以看[音频压缩教程](/guides/compress-mp3-audio/)，MP3 和 WMA 会重编码输出 MP3。",
      },
      { type: "h2", text: "MOV 为什么在 Windows 上没声音" },
      {
        type: "p",
        text: "MOV 只是容器，音频可能是 AAC，也可能是苹果设备常用的 PCM、ALAC。Windows 播放器往往认识 MOV 容器，却缺少对应的音频解码器，于是出现「有画面没声音」。重编码成 MP4 时音频统一转成 AAC，这类问题自然消失。",
      },
      {
        type: "p",
        text: "同理，FLV 常见 VP6 编码、3GP 常见 H.263，现代浏览器和剪辑软件支持有限。转成 H.264 MP4 之后，不仅能播放，剪辑软件导入也不会再报错。",
      },
      { type: "h2", text: "转码要多久" },
      {
        type: "p",
        text: "MP4、MOV 走浏览器的硬件编码，十分钟素材一般几分钟完成，风扇噪音也不大。FLV、3GP 由 FFmpeg 软件转码，速度明显更慢，首次使用还要下载约 30MB 的编码引擎，之后会缓存在本地。批量处理时建议一次不超过十几个文件，避免浏览器内存吃紧。",
      },
      { type: "h2", text: "批量转码的顺序建议" },
      {
        type: "p",
        text: "一次处理几十个文件时，先按来源分组：MOV 一组，FLV、3GP 一组，分别用同一档位处理，结果更好核对。转完先抽查两三个文件确认能正常播放、声音正常，再批量下载，避免全部下完才发现某类文件有问题。",
      },
      {
        type: "ul",
        items: [
          "同一批文件用同一档位，方便比较体积和画质。",
          "文件名相近的素材，下载后按项目建文件夹归档。",
          "成片要分发时，转 MP4 的同时填目标大小，一次完成格式和体积两件事。",
        ],
      },
      { type: "h2", text: "MP4 也有解决不了的情况" },
      {
        type: "p",
        text: "MP4 加 H.264 兼容性最好，但不是所有问题都能解决。带 HDR 的 4K 素材转成普通 H.264 会丢失高动态范围，画面显得发灰；码率本来就很低的视频，再转一次也不会变清楚。剪辑流程里需要反复处理的素材，建议保留原始 MOV 或 ProRes，MP4 只作为成片和分发格式。",
      },
      {
        type: "p",
        text: "另外，视频平台在上传后还会再转码一次，所以投稿时不必把画质压到极限，留一点码率余量反而更稳。",
      },
    ],
    faq: [
      {
        q: "转 MP4 会损失画质吗？",
        a: "会。MP4 常用 H.264 有损编码，高质量档位下肉眼差别很小，但 ProRes、无损素材转完会明显缩水，原始文件务必保留。",
      },
      {
        q: "能批量转换吗？",
        a: "可以，一次拖入多个文件，全部按同一档位处理，结果可以打包成 ZIP 下载。",
      },
      {
        q: "支持 AVI 吗？",
        a: "暂不支持。可以先用其他工具把 AVI 转成 MP4 或 MOV，再用本站压缩体积。",
      },
      {
        q: "转换需要上传服务器吗？",
        a: "不需要，整个过程在浏览器本地完成，适合内部资料和未公开素材。",
      },
      {
        q: "转完为什么文件名变了？",
        a: "输出会沿用原文件名并标记压缩结果，方便和原始文件区分，下载后可以自行改名。",
      },
    ],
  },
  en: {
    title: "How to Convert Video to MP4 (MOV, FLV, 3GP)",
    description:
      "MOV that won't play on Android, FLV that browsers reject: here is why container formats break compatibility and how to convert MOV, FLV, 3GP and OGV to universal MP4 in the browser.",
    summary: "MP4 is the safest container; convert older formats in one pass.",
    blocks: [
      {
        type: "p",
        text: "A MOV file from a colleague plays without audio on Windows, a downloaded FLV lecture only opens in an old player, and a 3GP clip from an old phone refuses to import into an editor. These are container and codec mismatches. Converting to MP4 with H.264 and AAC is the most compatible option: phones, browsers and editors open it directly. This guide shows how to do the conversion in your browser.",
      },
      { type: "h2", text: "Container and codec are different things" },
      {
        type: "p",
        text: "MP4, MOV, MKV and FLV are containers; inside them live codecs such as H.264, H.265 or VP9. Playback depends on whether the player understands the container and has a decoder for the codec. MP4 plus H.264 has the widest support, so \"convert to MP4\" really means changing the container and re-encoding the stream.",
      },
      { type: "h2", text: "What this tool actually outputs" },
      {
        type: "ul",
        items: [
          "**MP4 and MOV**: output MP4 using the browser's hardware H.264 encoder; this is the fastest path.",
          "**FLV, 3GP, OGV**: fall back to FFmpeg and are converted to H.264 MP4, so legacy files can be rescued.",
          "**MKV and WebM**: re-encoded inside the same container; smaller, but the format does not change.",
          "**AVI**: not supported. Convert it to one of the formats above with another tool first.",
        ],
      },
      { type: "h2", text: "Step by step" },
      {
        type: "ol",
        items: [
          "Open the [video compressor](/video-compressor/).",
          "Drop in MOV, FLV or 3GP files; multiple files are allowed.",
          "Choose the \"High quality\" preset, since conversion should preserve the picture.",
          "Add a target size when size matters, for example 20000 KB for chat apps.",
          "Press start and wait for the progress bar.",
          "Download the MP4 results, or pack them into a ZIP.",
        ],
      },
      {
        type: "cta",
        href: "/video-compressor/",
        label: "Convert to MP4 in your browser",
        text: "MOV, FLV, 3GP and OGV are written as H.264 MP4, with batch support and a target size.",
      },
      { type: "h2", text: "Three things to check afterwards" },
      {
        type: "ul",
        items: [
          "**Audio sync**: re-encoding rebuilds the timeline. Healthy sources stay in sync; a broken original stays broken.",
          "**Subtitles**: external subtitle files are not burned in, and embedded subtitle tracks may be dropped. Keep them separately.",
          "**Size and quality**: H.264 output is usually smaller, but ProRes footage loses a lot of quality, so archive the original.",
        ],
      },
      { type: "h2", text: "When conversion is unnecessary" },
      {
        type: "p",
        text: "If you only watch the file on your own computer, installing a player that supports the format is simpler. MP4 conversion mainly solves sharing and uploading: submission portals, online classrooms and editor imports. Since the tool also compresses, one run usually handles both compatibility and size.",
      },
      {
        type: "p",
        text: "For pure audio compatibility problems, such as WMA that phones cannot play, see the [audio compression guide](/guides/compress-mp3-audio/); MP3 and WMA are re-encoded to MP3.",
      },
      { type: "h2", text: "Why a MOV file has no sound on Windows" },
      {
        type: "p",
        text: "MOV is only a container. Its audio track may be AAC, or the PCM and ALAC formats Apple devices commonly use. Windows players recognize the container but often lack the matching decoder, which is why you get video without sound. Re-encoding to MP4 normalizes audio to AAC and the problem disappears.",
      },
      {
        type: "p",
        text: "The same applies to FLV, which often carries VP6, and 3GP, which often uses H.263. Modern browsers and editors have limited support for both. H.264 MP4 plays almost everywhere and imports into editors without errors.",
      },
      { type: "h2", text: "How long conversion takes" },
      {
        type: "p",
        text: "MP4 and MOV use hardware encoding, so a ten-minute clip usually finishes in a few minutes. FLV and 3GP fall back to software FFmpeg, which is slower and needs a one-time engine download of about 30MB, cached afterwards. Keep batches to a dozen files so browser memory stays comfortable.",
      },
      { type: "h2", text: "A sensible order for batch jobs" },
      {
        type: "p",
        text: "Group by source format first: MOV in one run, FLV and 3GP in another, each with the same preset so results are easy to compare. Spot-check two or three outputs for picture and audio before downloading the rest, rather than discovering a problem after the whole batch is saved.",
      },
      {
        type: "ul",
        items: [
          "Use one preset per batch so sizes and quality stay comparable.",
          "Store similar files in a project folder after downloading.",
          "When the output will be sent on, add a target size in the same run to handle format and size at once.",
        ],
      },
      { type: "h2", text: "What MP4 cannot fix" },
      {
        type: "p",
        text: "MP4 with H.264 is the safest combination, but it does not solve everything. HDR 4K converted to ordinary H.264 loses its dynamic range and looks washed out, and a video that was already compressed too hard will not become sharper. For editing workflows, keep the original MOV or ProRes material and treat MP4 as the delivery format.",
      },
      {
        type: "p",
        text: "Video platforms re-encode uploads anyway, so there is no need to push quality to the edge; a little headroom usually survives the pipeline better.",
      },
    ],
    faq: [
      {
        q: "Will converting to MP4 lose quality?",
        a: "Yes. MP4 usually uses lossy H.264. At the high-quality preset the difference is hard to see, but ProRes or lossless sources will degrade noticeably, so keep the originals.",
      },
      {
        q: "Can I convert several files at once?",
        a: "Yes. Drop in multiple files, process them with the same preset, and download the results individually or as a ZIP.",
      },
      {
        q: "Is AVI supported?",
        a: "Not currently. Convert AVI to MP4 or MOV with another tool, then use this site to reduce the size.",
      },
      {
        q: "Does conversion upload my files?",
        a: "No. Everything runs locally in your browser, which makes it suitable for internal or unreleased material.",
      },
      {
        q: "Why did the file name change?",
        a: "Output names follow the original with a compression marker so you can tell them apart. Rename them after downloading if needed.",
      },
    ],
  },
};
