/** 截图预览：打开首页/工具页，桌面 + 移动视口各一组，用于确认前端页面现状 */
const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");

const BASE = process.env.SPIKE_BASE || "";
const SERVE_PORT = process.env.SERVE_PORT || "4173";
const ROOT = process.env.SPIKE_SERVE_ROOT || "";
const PAGES = [
  ["home-zh", "/zh/"],
  ["image-converter-zh", "/zh/image-converter/"],
  ["unzip-zh", "/zh/unzip/"],
  ["font-zh", "/zh/font-compressor/"],
  ["home-en", "/en/"],
  ["tools-zh", "/zh/tools/"],
];
const VIEWPORTS = [
  ["desktop", { width: 1280, height: 900 }],
  ["mobile", { width: 390, height: 844 }], // iPhone 14 视口
];

(async () => {
  const OUT = path.join(__dirname, "..", "..", "preview");
  fs.mkdirSync(OUT, { recursive: true });
  const browser = await chromium.launch({ channel: "chrome", headless: true });
  for (const [vwName, viewport] of VIEWPORTS) {
    const page = await browser.newPage({ viewport });
    for (const [name, url] of PAGES) {
      try {
        await page.goto(`http://localhost:${SERVE_PORT}${BASE}${url}`, {
          waitUntil: "networkidle",
          timeout: 30000,
        });
        await page.waitForTimeout(400);
        const file = path.join(OUT, `${name}-${vwName}.png`);
        await page.screenshot({ path: file, fullPage: true });
        console.log("saved", `${name}-${vwName}`, fs.statSync(file).size, "bytes");
      } catch (e) {
        console.log("failed", `${name}-${vwName}`, e.message);
      }
    }
    await page.close();
  }
  await browser.close();
})();
