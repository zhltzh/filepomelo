"use client";

import { useEffect, useState } from "react";

/**
 * 反馈邮箱入口。
 *
 * 静态 HTML 里不出现完整邮箱地址（防止被垃圾邮件爬虫抓取），
 * 由客户端在挂载后拼出 mailto 链接。服务端渲染时 href 为 "#"，
 * 文本保持一致，因此不会有 hydration 警告。
 *
 * 以后换域名邮箱，只改下面两行。
 */
const EMAIL_USER = "bushiyayaya";
const EMAIL_DOMAIN = "qq.com";

export function ContactEmail({ label, className }: { label: string; className?: string }) {
  const [href, setHref] = useState("#");

  useEffect(() => {
    const address = [EMAIL_USER, EMAIL_DOMAIN].join("@");
    setHref(`mailto:${address}?subject=${encodeURIComponent("FilePomelo 反馈")}`);
  }, []);

  return (
    <a href={href} className={className} rel="nofollow">
      {label}
    </a>
  );
}
