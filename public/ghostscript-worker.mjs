/**
 * Ghostscript 压缩 Web Worker（PDF 压缩）。
 * 独立于 React 打包链：位于 public/，ES Module Worker 动态 import vendor 的 gs.js，
 * 由 src/lib/engines/ghostscript.ts 通过 new Worker("/ghostscript-worker.mjs", {type:"module"}) 驱动。
 *
 * 压缩强度 preset（gifsicle 同款档位语义）：
 * - screen   72dpi   最大压缩（quality ≤ 35）
 * - ebook    150dpi  推荐（quality 36-70）
 * - printer  300dpi  高质量（quality > 70）
 */
let gsPromise = null;

function getGhostscript() {
  if (!gsPromise) {
    gsPromise = (async () => {
      // 相对 import.meta.url 解析 vendor：自动适配 GitHub Pages 子路径前缀
      const gsURL = new URL("./vendor/ghostscript/gs.js", import.meta.url).href;
      const mod = await import(gsURL);
      const Module = mod.default;
      const instance = await Module({
        locateFile: (file) =>
          new URL(`./vendor/ghostscript/${file}`, import.meta.url).href,
      });
      return instance;
    })();
  }
  return gsPromise;
}

self.onmessage = async (e) => {
  const { id, input, preset } = e.data;
  try {
    const gs = await getGhostscript();
    gs.FS.writeFile("input.pdf", new Uint8Array(input));

    gs.callMain([
      "-sDEVICE=pdfwrite",
      "-dCompatibilityLevel=1.4",
      `-dPDFSETTINGS=/${preset}`,
      "-dNOPAUSE",
      "-dQUIET",
      "-dBATCH",
      "-dSAFER",
      "-sOutputFile=output.pdf",
      "input.pdf",
    ]);

    const output = gs.FS.readFile("output.pdf", { encoding: "binary" });
    gs.FS.unlink("input.pdf");
    gs.FS.unlink("output.pdf");

    self.postMessage({ id, success: true, output: output.buffer }, [output.buffer]);
  } catch (err) {
    self.postMessage({ id, success: false, error: String(err?.message || err) });
  }
};
