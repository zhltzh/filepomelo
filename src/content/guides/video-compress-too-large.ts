import type { Guide } from "./types";

export const videoCompressTooLarge: Guide = {
  slug: "video-compress-too-large",
  toolSlug: "video-compressor",
  toolName: { zh: "视频压缩", en: "Video Compressor" },
  datePublished: "2026-11-23",
  dateModified: "2026-11-23",
  related: ["convert-video-to-mp4", "compress-mp3-audio", "files-to-zip"],
  zh: {
    title: "视频太大怎么压缩变小？发微信和邮件的处理方法",
    description:
      "视频超过邮箱或聊天工具的大小限制发不出去？本文讲清影响体积的因素，以及在浏览器里用压缩档位加目标大小把视频压到几十 MB 的具体步骤。",
    summary: "目标大小 + 压缩档位两步走，发微信、发邮件都不被拦。",
    blocks: [
      {
        type: "p",
        text: "一段 4K 手机视频动辄 300MB 以上，想发给同事、传进微信群或者当邮件附件，经常卡在「文件过大」这一步。视频压缩并不神秘：在不明显损失观感的前提下把码率降下来，体积就会成比例变小。这篇文章用站内的[视频压缩](/video-compressor/)工具做示范，讲清楚压到多少合适、怎么一次压到位。",
      },
      { type: "h2", text: "视频体积由三个因素决定" },
      {
        type: "p",
        text: "一段视频的体积约等于视频码率乘以时长，再加上音频码率乘以时长。所以同样一分钟的素材，4K 60fps 可能比 1080p 30fps 大四倍。压缩工具实际能动的参数是码率：重新编码时把每秒的数据量降下来，画质随之轻微下降。",
      },
      {
        type: "ul",
        items: [
          "**时长**：剪掉片头片尾和无关片段，往往比压码率更立竿见影。",
          "**分辨率**：1080p 对手机播放已经足够，4K 只有在电视或大屏上才看得出差别。",
          "**帧率**：60fps 与 30fps 的体积差距接近一倍，聊天场景 30fps 完全够用。",
        ],
      },
      { type: "h2", text: "先确认目标平台的上限" },
      {
        type: "p",
        text: "不同渠道的限制差别很大：多数邮箱的附件上限在 20–50MB 之间；聊天工具会对视频二次转码，原文件太大时甚至无法发送；网盘和投稿后台常见上限是 100MB、200MB 或 500MB。先查清你要发的渠道，再决定压到多少，可以少压好几轮。",
      },
      { type: "h2", text: "用目标大小一次压到位" },
      {
        type: "p",
        text: "站内工具除了三档压缩档位，还可以直接填「目标大小」。想发 20MB 就填 20000KB，工具会自动尝试不同码率，输出最接近目标体积的结果。因为可能重编码多次，耗时会比单次压缩长一些。",
      },
      {
        type: "ol",
        items: [
          "打开[视频压缩页](/video-compressor/)，把视频拖进去，支持一次多选。",
          "压缩档位选「推荐」，作为默认起点。",
          "在目标大小里填写渠道上限，比如发邮件填 20000（KB）。",
          "点「开始压缩」，页面会显示每段视频的原始大小和压缩后大小。",
          "结果仍超过目标时，把目标值调低 5%–10% 再压一次。",
          "单条视频直接下载，多条可以打包成 zip 一次取回。",
        ],
      },
      {
        type: "cta",
        href: "/video-compressor/",
        label: "压缩视频（本地处理，不上传服务器）",
        text: "支持 MP4、MOV、MKV、WebM、FLV、3GP，可批量处理并按目标大小输出。",
      },
      { type: "h2", text: "不同场景的推荐设置" },
      {
        type: "ul",
        items: [
          "**微信、QQ 聊天发送**：压到 20MB 以内，推荐档位，手机上看不出差别。",
          "**邮件附件**：按邮箱上限压到 20MB 或 50MB 以内，超过就改用[打包成 ZIP](/zip-compressor/)或网盘链接。",
          "**课件、会议录像**：以文字和 PPT 画面为主，选「最大压缩」，体积能降 70% 以上，文字依然清晰。",
          "**存档、二次剪辑**：保留原文件，压缩结果只用于传输，不要覆盖母版。",
        ],
      },
      {
        type: "p",
        text: "工具使用浏览器的硬件编码（WebCodecs）重新编码，多数 MP4、MOV 视频在相近观感下体积减少 60%–80%，速度快且不占满 CPU。FLV、3GP、OGV 这类老格式会由 FFmpeg 兜底转成 H.264 MP4，顺便完成格式统一。",
      },
      { type: "h2", text: "压缩后怎么检查画质" },
      {
        type: "p",
        text: "别只看体积。打开压缩结果，重点看快速运动画面、镜头切换处和夜景：出现明显色块、拖影或糊成一片，说明码率压过头了，回到工具提高一档重压。文档、屏幕录制类视频对码率更敏感，文字边缘发虚就要提高档位。",
      },
      {
        type: "p",
        text: "另外，压缩生成的是新文件，原视频不会被修改。需要对比效果时，把两个文件并排播放即可，确认满意再删原片。",
      },
      { type: "h2", text: "想少压几次，先做好这两件事" },
      {
        type: "p",
        text: "工具能压的是码率，压不了拍摄时的选择。动手前先做两件事，往往能把压缩轮次减到一次：一是回到相册或剪辑软件重新导出，分辨率选 1080p、帧率 30fps，导出的文件通常已经比原片小一半；二是剪掉开头结尾的空白和无关片段，会议录像尤其明显，十分钟的空等画面和十分钟的内容体积完全一样。",
      },
      {
        type: "p",
        text: "还有一点容易被忽略：在微信里直接点「发送视频」，平台会再压一次，画质和体积都不受你控制。想保住观感，应该先用工具压到目标大小，再以「文件」形式发送。",
      },
      { type: "h2", text: "压完还是发不出去怎么办" },
      {
        type: "p",
        text: "常见原因有三个。第一是目标大小的单位填错了，页面按 KB 计算，填 20 会被当成 20KB，正确写法是 20000。第二是渠道限制比想象中更严，比如某些系统只允许 10MB 附件，或者对单次上传总量有要求。第三是视频本身太长，压到画质不能接受的程度仍然超标。",
      },
      {
        type: "ul",
        items: [
          "确认目标大小按 KB 填写，再压一次。",
          "把长视频拆成上下两段，分别压缩后发送。",
          "邮件实在发不出时，改用网盘链接，或[打包成 ZIP](/zip-compressor/)后用文件传输工具发送。",
          "需要反复发送的素材，直接导出 720p 版本，比反复压缩更可控。",
        ],
      },
    ],
    faq: [
      {
        q: "视频压缩会上传服务器吗？",
        a: "不会。解码、重编码和导出都在浏览器本地完成，文件不会离开你的设备，适合内部会议、合同附件这类不便外传的素材。",
      },
      {
        q: "为什么压缩时间比较长？",
        a: "视频要逐帧重新编码，一段 10 分钟的视频通常需要几分钟；填写目标大小时工具可能尝试多次编码，耗时更长。首次使用还要下载编码引擎，之后会缓存在本地。",
      },
      {
        q: "能只压画面不压声音吗？",
        a: "工具会同时重编码音频，码率随档位一起降低。聊天和教学场景听感基本不受影响。",
      },
      {
        q: "压缩后能转成别的格式吗？",
        a: "可以。MOV、FLV、3GP、OGV 都会输出 MP4；MKV 保持 MKV、WebM 保持 WebM。需要统一成 MP4 时，参考[视频转 MP4 教程](/guides/convert-video-to-mp4/)。",
      },
    ],
  },
  en: {
    title: "How to Compress a Large Video for WeChat and Email",
    description:
      "A 4K phone clip can exceed 300MB and fail to send. Here is how bitrate, resolution and duration drive file size, and how to hit a target size in the browser.",
    summary: "Set a target size, compress locally, and send without hitting upload limits.",
    blocks: [
      {
        type: "p",
        text: "A few minutes of 4K phone footage easily passes 300MB, which is more than most email attachments or chat uploads will accept. Compressing video is mostly about bitrate: re-encode at a lower data rate and the file shrinks in proportion, with a small loss in visual quality. This guide uses the [video compressor](/video-compressor/) on this site as an example and explains how small the file actually needs to be.",
      },
      { type: "h2", text: "File size is bitrate times duration" },
      {
        type: "p",
        text: "A clip's size is roughly video bitrate plus audio bitrate, multiplied by duration. A one-minute 4K 60fps clip can be four times larger than a 1080p 30fps clip of the same scene. The tool changes bitrate; resolution and frame rate stay as they are, so export at a lower resolution first if you need a dramatic reduction.",
      },
      {
        type: "ul",
        items: [
          "**Duration** — cutting intros and dead air often saves more than lowering quality.",
          "**Resolution** — 1080p is plenty on a phone; 4K only matters on a large screen.",
          "**Frame rate** — 60fps roughly doubles the data of 30fps, and 30fps is fine for chat.",
        ],
      },
      { type: "h2", text: "Check the limit of the destination" },
      {
        type: "p",
        text: "Most mail servers cap attachments between 20 and 50MB. Chat apps re-encode video and may refuse very large originals. Cloud drives and submission portals commonly allow 100MB, 200MB or 500MB. Find the number before you compress, otherwise you waste several rounds guessing.",
      },
      { type: "h2", text: "Use the target-size field" },
      {
        type: "p",
        text: "Besides the three quality presets, the tool accepts a target size in kilobytes. Enter 20000 for 20MB and it tries several bitrates to land just under that number. Since it may re-encode up to six times, expect a longer wait than a single-pass compression.",
      },
      {
        type: "ol",
        items: [
          "Open the [video compressor](/video-compressor/) and drop in one or more files.",
          "Keep the quality preset on \"Recommended\" as a starting point.",
          "Type the destination limit into the target size field, for example 20000 KB.",
          "Press start and watch the original and compressed sizes per file.",
          "If the result still exceeds the target, lower it by 5–10 percent and run again.",
          "Download files individually, or pack several results into a ZIP.",
        ],
      },
      {
        type: "cta",
        href: "/video-compressor/",
        label: "Compress videos locally (no upload)",
        text: "Supports MP4, MOV, MKV, WebM, FLV and 3GP, with batch processing and target-size output.",
      },
      { type: "h2", text: "Recommended settings by scenario" },
      {
        type: "ul",
        items: [
          "**WeChat / QQ chat**: target 20MB with the recommended preset; it looks identical on a phone.",
          "**Email attachment**: match the mailbox limit, usually 20MB. Above that, [pack files into a ZIP](/zip-compressor/) or share a link.",
          "**Lectures and screen recordings**: choose max compression; text stays sharp while the file drops by 70 percent or more.",
          "**Archive or re-editing**: keep the original untouched and use the compressed file only for sending.",
        ],
      },
      {
        type: "p",
        text: "MP4, MOV, MKV and WebM use the browser's hardware encoder (WebCodecs), so a ten-minute clip finishes in a few minutes without pinning your CPU. FLV, 3GP and OGV fall back to FFmpeg and are converted to H.264 MP4.",
      },
      { type: "h2", text: "Check the quality afterwards" },
      {
        type: "p",
        text: "Do not judge by file size alone. Open the result and look at fast motion, scene cuts and dark areas: blocky artifacts or smearing mean the bitrate went too low, so go back and pick a higher preset. Screen recordings and documents are the most sensitive; raise the preset if text edges look fuzzy.",
      },
      {
        type: "p",
        text: "The tool always writes a new file, so your original stays unchanged. Play both side by side to compare, and only delete the source once you are satisfied.",
      },
      { type: "h2", text: "Two steps that save a compression round" },
      {
        type: "p",
        text: "The tool changes bitrate, but it cannot undo how the footage was shot. Re-export from your gallery or editor at 1080p and 30fps first; the export is often half the original size already. Then trim dead air and unrelated footage. A meeting recording benefits most, because ten minutes of an empty room takes exactly as much space as ten minutes of content.",
      },
      {
        type: "p",
        text: "One detail people miss: sending a video through WeChat's in-app video option lets the platform re-encode it, so neither quality nor size is under your control. Compress to your target first, then send it as a file.",
      },
      { type: "h2", text: "Still can't send the file?" },
      {
        type: "p",
        text: "Three causes are common. The target size may be in the wrong unit: the field is in kilobytes, so 20 means 20KB where you want 20000. The destination may be stricter than expected, such as a 10MB attachment cap or a limit on the total upload. Or the clip is simply too long to fit at a quality you can accept.",
      },
      {
        type: "ul",
        items: [
          "Confirm the target is in kilobytes and run it again.",
          "Split a long video into two parts and compress each separately.",
          "When email refuses, share a cloud link or [pack the file into a ZIP](/zip-compressor/).",
          "For material you send often, export a 720p copy; it is more predictable than repeated compression.",
        ],
      },
    ],
    faq: [
      {
        q: "Are my videos uploaded?",
        a: "No. Decoding, encoding and export all happen in your browser, so the file never leaves your device. That makes it safe for internal meetings and contract attachments.",
      },
      {
        q: "Why does compression take so long?",
        a: "Video is re-encoded frame by frame, so a ten-minute clip typically needs a few minutes. A target size may trigger several encodes, and the first run also downloads the encoder, which is cached afterwards.",
      },
      {
        q: "Can I keep the audio untouched?",
        a: "Audio is re-encoded too, at a lower bitrate. For speech and lectures the difference is rarely noticeable.",
      },
      {
        q: "Can I convert the format as well?",
        a: "Yes. MOV, FLV, 3GP and OGV output MP4, while MKV and WebM keep their container. See the [video to MP4 guide](/guides/convert-video-to-mp4/).",
      },
    ],
  },
};
