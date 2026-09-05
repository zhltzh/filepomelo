/** 截图预览：打开首页/工具页各一张，用于确认前端页面现状 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = "http://localhost:4173";
const OUT = path.join(__dirname, "..", "..", "preview");
const PAGES = [
  ["home-zh", "/zh/"],
  ["image-converter-zh", "/zh/image-converter/"],
  ["unzip-zh", "/zh/unzip/"],
  ["font-zh", "/zh/font-compressor/"],
  ["home-en", "/en/"],
  ["tools-zh", "/zh/tools/"],
];

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
  for (const [name, url] of PAGES) {
    try {
      await page.goto(BASE + url, { waitUntil: "networkidle", timeout: 30000 });
      await page.waitForTimeout(400);
      const file = path.join(OUT, name + ".png");
      await page.screenshot({ path: file, fullPage: true });
      console.log("saved", name, fs.statSync(file).size, "bytes");
    } catch (e) {
      console.log("failed", name, e.message);
    }
  }
  await browser.close();
})();
