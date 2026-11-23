import type { Guide } from "./types";

export const compressMp3Audio: Guide = {
  slug: "compress-mp3-audio",
  toolSlug: "audio-compressor",
  toolName: { zh: "音频压缩", en: "Audio Compressor" },
  datePublished: "2026-11-23",
  dateModified: "2026-11-23",
  related: ["video-compress-too-large", "convert-video-to-mp4", "files-to-zip"],
  zh: {
    title: "MP3 音频太大怎么压缩？播客和录音减小体积的方法",
    description:
      "一段会议录音 80MB、播客单集 120MB？说明音频码率与音质的关系，以及把 MP3、WMA、OGG、AAC 文件压缩变小、方便发送的具体步骤。",
    summary: "码率降一半，体积降一半，语音几乎听不出差别。",
    blocks: [
      {
        type: "p",
        text: "会议录音、播客、采访素材经常一录就是一两个小时，文件动辄上百 MB，邮件发不出、微信传得慢。音频压缩的原理很简单：把码率降下来，体积按时长成比例减小。这篇用站内的[音频压缩](/audio-compressor/)工具演示怎么压得又小又能听。",
      },
      { type: "h2", text: "音频体积就是码率乘以时长" },
      {
        type: "p",
        text: "128kbps 的 MP3 每分钟约 1MB，320kbps 则约 2.4MB。一小时的 320kbps 录音接近 140MB，改成 128kbps 就只有 55MB 左右。所以压缩音频的关键是选一个和内容匹配的码率，而不是一味追求最小。",
      },
      { type: "h2", text: "语音和音乐要用不同标准" },
      {
        type: "ul",
        items: [
          "**人声录音**（会议、课程、访谈）：96–128kbps 足够，齿音和呼吸声不会明显失真。",
          "**音乐、带伴奏的内容**：建议 128kbps 以上，再低会出现高频发闷。",
          "**需要后期剪辑的素材**：保留原始无损或高码率文件，压缩版只用于分发。",
        ],
      },
      { type: "h2", text: "操作步骤" },
      {
        type: "ol",
        items: [
          "打开[音频压缩页](/audio-compressor/)，支持 MP3、OGG、AAC、WMA。",
          "把音频文件拖入页面，可一次多选。",
          "压缩档位选「推荐」（约 128kbps）；纯语音内容可以选「最大压缩」（约 96kbps）。",
          "点「开始压缩」，查看原始大小和压缩后大小。",
          "单条下载，或打包成 zip 一次取回。",
        ],
      },
      {
        type: "cta",
        href: "/audio-compressor/",
        label: "压缩音频（本地处理，不上传服务器）",
        text: "支持 MP3、WMA、OGG、AAC，按档位降低码率，批量压缩后可直接下载。",
      },
      { type: "h2", text: "压缩后格式会变吗" },
      {
        type: "p",
        text: "MP3 和 WMA 会重新编码输出 MP3；OGG 和 AAC 使用浏览器原生编码，输出保持 OGG、AAC。也就是说，想统一成 MP3，源文件是 MP3 或 WMA 时最直接；如果你手里是 OGG，压缩后依然是 OGG。工具不会自动做格式互转，需要严格 MP3 时请先确认来源格式。",
      },
      { type: "h2", text: "什么时候别再压" },
      {
        type: "p",
        text: "已经压过的低码率文件再压一次，只会叠加损失。判断方法：如果原文件码率已经低于 96kbps，压缩收益很小，音质却会明显变差，不如直接发送原文件或改用网盘链接。",
      },
      {
        type: "p",
        text: "如果问题出在视频上，比如录像体积太大，可以转到[视频压缩教程](/guides/video-compress-too-large/)，按目标大小压到聊天工具能接受的范围。",
      },
      { type: "h2", text: "码率、采样率、声道怎么配合" },
      {
        type: "p",
        text: "码率决定每秒的数据量，采样率决定能记录多高的频率，声道决定是否立体声。压缩工具主要调码率，采样率和声道保持不变：原文件是 44.1kHz 立体声，压完依然是立体声，只是每声道的数据更少。想进一步减小体积，需要先用音频编辑软件把立体声转成单声道、把 48kHz 降到 44.1kHz，再回来压缩。",
      },
      {
        type: "p",
        text: "语音类内容转单声道通常没有听感损失，体积还能再省约三成，这是很多播客制作的常规步骤。音乐尽量保留立体声，否则声场会明显变窄。",
      },
      { type: "h2", text: "长录音怎么处理" },
      {
        type: "p",
        text: "一小时的会议录音压完仍有几十 MB。发送前可以按议题切成几段，分别命名，接收方也更容易定位。切分时挑句子之间的停顿处下手，避免把一句话拦腰截断；每段单独压缩，比整段一次压缩更省内存。",
      },
      { type: "h2", text: "压缩后体积反而变大怎么办" },
      {
        type: "p",
        text: "原始码率本来就很低的文件，重新编码时编码器可能选择更高的码率，输出反而更大。遇到这种情况直接发送原文件即可。界面会同时显示原始大小和结果大小，下载前先看数字，不要盲目保存。",
      },
      { type: "h2", text: "降噪比压码率更影响听感" },
      {
        type: "p",
        text: "录音里的底噪、空调声、键盘声都会占用码率。同样的 128kbps，干净的人声听起来清晰，嘈杂的录音则显得糊。如果条件允许，先用简单的降噪处理一遍再压缩，往往比单纯提高码率更有效。",
      },
      {
        type: "p",
        text: "会议录音尤其明显：把麦克风放近一点、关掉风扇，比后期反复调码率有用得多。压缩工具只负责体积，输入质量决定最终听感。",
      },
    ],
    faq: [
      {
        q: "压缩后会明显失真吗？",
        a: "语音内容在 96–128kbps 下几乎听不出区别；音乐类建议 128kbps 以上，并且不要反复压缩同一份文件。",
      },
      {
        q: "能从视频里提取音频吗？",
        a: "不能。本站只处理音频文件本身；需要提取音轨请先用其他工具导出，再回到这里压缩。",
      },
      {
        q: "能批量压缩吗？",
        a: "可以，一次拖入多个文件，全部按同一档位处理，完成后可打包下载。",
      },
      {
        q: "文件会上传吗？",
        a: "不会。解码和重编码都在浏览器本地完成，录音和会议内容不会离开设备。",
      },
      {
        q: "压缩后时长会变吗？",
        a: "不会，只降低码率，时长、声道和内容保持不变。",
      },
    ],
  },
  en: {
    title: "How to Compress Large MP3 and Audio Files",
    description:
      "An 80MB meeting recording or a 120MB podcast episode is hard to share. Learn how bitrate drives audio size and how to compress MP3, WMA, OGG and AAC files locally in the browser.",
    summary: "Halve the bitrate, halve the size; speech sounds nearly identical.",
    blocks: [
      {
        type: "p",
        text: "Meetings, podcasts and interviews often run for an hour or two, producing files well over 100MB that email will not accept and chat apps upload slowly. Audio compression is straightforward: lower the bitrate and the size drops in proportion to duration. This guide uses the [audio compressor](/audio-compressor/) on this site to show how to get a small file that still sounds fine.",
      },
      { type: "h2", text: "Audio size is bitrate times duration" },
      {
        type: "p",
        text: "A 128kbps MP3 takes about 1MB per minute, while 320kbps takes about 2.4MB. One hour at 320kbps is nearly 140MB; at 128kbps it is roughly 55MB. The goal is a bitrate that matches the content, not the smallest possible number.",
      },
      { type: "h2", text: "Speech and music need different targets" },
      {
        type: "ul",
        items: [
          "**Speech** (meetings, lectures, interviews): 96–128kbps is enough; sibilance and breaths stay clean.",
          "**Music with instruments**: use 128kbps or higher; below that the treble starts to sound dull.",
          "**Material for later editing**: keep the lossless or high-bitrate original and distribute the compressed copy only.",
        ],
      },
      { type: "h2", text: "Step by step" },
      {
        type: "ol",
        items: [
          "Open the [audio compressor](/audio-compressor/); MP3, OGG, AAC and WMA are supported.",
          "Drop the files into the page; multiple files can be selected.",
          "Choose \"Recommended\" (around 128kbps). For pure speech, \"Max compression\" (around 96kbps) works well.",
          "Press start and compare the original and compressed sizes.",
          "Download individually, or pack the results into a ZIP.",
        ],
      },
      {
        type: "cta",
        href: "/audio-compressor/",
        label: "Compress audio locally (no upload)",
        text: "MP3, WMA, OGG and AAC at lower bitrates, with batch processing and direct download.",
      },
      { type: "h2", text: "Does the format change?" },
      {
        type: "p",
        text: "MP3 and WMA are re-encoded and output as MP3. OGG and AAC use the browser's native encoders and stay in their original format. In other words, MP3 or WMA sources give you a clean path to MP3; an OGG file remains OGG after compression. The tool does not convert between formats, so confirm the source format if you strictly need MP3.",
      },
      { type: "h2", text: "When to stop compressing" },
      {
        type: "p",
        text: "Compressing an already compressed low-bitrate file only stacks up losses. If the source is below 96kbps, extra compression saves little and degrades the sound, so send the original or share a link instead.",
      },
      {
        type: "p",
        text: "If the oversized file is a video rather than audio, see the [video compression guide](/guides/video-compress-too-large/) and target a size your chat app accepts.",
      },
      { type: "h2", text: "Bitrate, sample rate and channels" },
      {
        type: "p",
        text: "Bitrate sets how much data each second holds, sample rate sets the highest frequency recorded, and channels decide mono versus stereo. The compressor mainly changes bitrate; the other two stay as they are. A 44.1kHz stereo source remains stereo, just with less data per channel. To shrink further, convert stereo to mono or 48kHz to 44.1kHz in an audio editor first.",
      },
      {
        type: "p",
        text: "Speech in mono is usually indistinguishable and saves about a third of the size, which is standard practice in podcast production. Keep music in stereo, otherwise the image narrows noticeably.",
      },
      { type: "h2", text: "Handling long recordings" },
      {
        type: "p",
        text: "A one-hour meeting still measures tens of megabytes after compression. Split it by agenda item before sending, name each part clearly, and cut at pauses rather than mid-sentence. Compressing each part separately also uses less memory than one large job.",
      },
      { type: "h2", text: "Keep a master copy" },
      {
        type: "p",
        text: "Loss stacks up: compressing the same file repeatedly makes the treble duller each time. Archive the original and generate distribution copies from the master, not from an earlier compressed version. A suffix such as \"-128k\" keeps the files distinguishable.",
      },
      { type: "h2", text: "What if the output gets bigger?" },
      {
        type: "p",
        text: "For a source that already uses a very low bitrate, the encoder may pick a higher rate and produce a larger file. In that case send the original. The page always shows both sizes, so check the numbers before downloading.",
      },
      { type: "h2", text: "Noise matters more than bitrate" },
      {
        type: "p",
        text: "Background hum, air conditioning and keyboard noise all consume bitrate. At the same 128kbps, clean speech sounds clear while a noisy recording sounds muddy. A light noise reduction pass before compression is often more effective than raising the bitrate.",
      },
      {
        type: "p",
        text: "This is most visible in meeting recordings: moving the microphone closer and switching off a fan beats any post-processing. The compressor controls size; the input decides how good it sounds.",
      },
      {
        type: "p",
        text: "A practical habit: record speech at 128kbps mono from the start. It matches this tool's recommended preset, produces about the same size, and removes a compression step entirely.",
      },
    ],
    faq: [
      {
        q: "Will compression be audible?",
        a: "Speech at 96–128kbps is nearly indistinguishable. For music, stay at 128kbps or higher and avoid compressing the same file repeatedly.",
      },
      {
        q: "Can I extract audio from a video?",
        a: "No. This site only processes audio files. Export the audio track with another tool first, then compress it here.",
      },
      {
        q: "Can I compress several files at once?",
        a: "Yes. Select multiple files, process them with the same preset, and download the results as a ZIP.",
      },
      {
        q: "Are files uploaded?",
        a: "No. Decoding and re-encoding happen in your browser; recordings never leave your device.",
      },
      {
        q: "Does the duration change?",
        a: "No. Only the bitrate changes; duration, channels and content stay the same.",
      },
      {
        q: "Can I compress a folder of recordings in one go?",
        a: "Yes. Select multiple audio files and they are processed with the same preset; download the results individually or as a ZIP. If memory is tight, keep each file under an hour.",
      },
      {
        q: "Will compression remove metadata?",
        a: "The encoder rewrites the file, so tags such as ID3 may be dropped. Keep the original if titles or artist information matter to you.",
      },
    ],
  },
};
