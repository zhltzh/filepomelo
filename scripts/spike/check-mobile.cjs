/** 移动端适配检查：横向溢出检测 + 分段截图 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = "/filepomelo";
const PORT = "4173";
const PAGES = [
  ["home-zh", "/zh/"],
  ["home-en", "/en/"],
  ["image-converter-zh", "/zh/image-converter/"],
  ["unzip-zh", "/zh/unzip/"],
  ["font-zh", "/zh/font-compressor/"],
  ["tools-zh", "/zh/tools/"],
];
const OUT = path.join(__dirname, "..", "..", "preview");

(async () => {
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  for (const [name, url] of PAGES) {
    const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
    try {
      await page.goto(`http://localhost:${PORT}${BASE}${url}`, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(300);
      const info = await page.evaluate(() => {
        const doc = document.documentElement;
        return {
          scrollW: doc.scrollWidth,
          innerW: window.innerWidth,
          scrollH: doc.scrollHeight,
          overflowEls: Array.from(document.querySelectorAll("*"))
            .filter((el) => {
              const r = el.getBoundingClientRect();
              return r.right > window.innerWidth + 2 || r.left < -2;
            })
            .slice(0, 5)
            .map((el) => el.tagName + "." + (el.className && typeof el.className === "string" ? el.className.split(" ")[0] : "")),
        };
      });
      const overflow = info.scrollW > info.innerW;
      console.log(`${overflow ? "❌" : "✅"} ${name}: scrollW=${info.scrollW} innerW=${info.innerW} h=${info.scrollH}${info.overflowEls.length ? " els=" + info.overflowEls.join(",") : ""}`);
      // 滚动分段截图（每段 = 一个视口高）
      const seg = 844;
      for (let i = 0; i < Math.min(4, Math.ceil(info.scrollH / seg)); i++) {
        await page.evaluate((y) => window.scrollTo(0, y), i * seg);
        await page.waitForTimeout(250);
        const file = path.join(OUT, `${name}-mob-seg${i + 1}.png`);
        await page.screenshot({ path: file });
      }
    } catch (e) {
      console.log(`❌ ${name}: ${e.message}`);
    }
    await page.close();
  }
  await browser.close();
})();
