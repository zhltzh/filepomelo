"use client";

import { useEffect, useState } from "react";
import { useLocale } from "next-intl";

const X_ICON = (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M18.9 2H22l-7 8 8.2 12h-6.6l-5.2-7.6L5.5 22H2.3l7.5-8.6L2 2h6.8l4.7 7L18.9 2Zm-1.2 18h1.8L7.4 3.9H5.5L17.7 20Z" />
  </svg>
);

const COPY_ICON = (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <rect x="9" y="9" width="12" height="12" rx="2" />
    <path d="M5 15V5a2 2 0 0 1 2-2h8" />
  </svg>
);

const TEXT = {
  zh: { label: "分享", copy: "复制链接", copied: "已复制" },
  en: { label: "Share", copy: "Copy link", copied: "Copied" },
};

async function copyText(text: string) {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // Permission can still be denied inside a secure context.
    }
  }
  try {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.top = "-1000px";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(area);
    return ok;
  } catch {
    return false;
  }
}

export function ShareLinks() {
  const locale = useLocale();
  const t = TEXT[locale as keyof typeof TEXT] ?? TEXT.en;
  const [url, setUrl] = useState("");
  const [title, setTitle] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUrl(`${window.location.origin}${window.location.pathname}`);
    setTitle(document.title.replace(/\s*[|｜-]\s*(Aixuno Compress|FilePomelo|Aixuno)\s*$/, "").trim());
  }, []);

  const handleCopy = async () => {
    if (!url) return;
    const ok = await copyText(url);
    if (!ok) return;
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const linkClass =
    "inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs text-gray-600 transition-colors hover:border-gray-400 hover:text-gray-900";

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-gray-400">{t.label}</span>
      <button type="button" onClick={handleCopy} className={linkClass} aria-label={t.copy}>
        {COPY_ICON}
        {copied ? t.copied : t.copy}
      </button>
      <a
        href={url ? `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}` : undefined}
        target="_blank"
        rel="noopener noreferrer"
        className={linkClass}
        aria-label="Share on X"
      >
        {X_ICON}
        X
      </a>
    </div>
  );
}
