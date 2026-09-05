/**
 * 本地预览静态导出产物（out/）的零依赖静态服务器
 * 运行: node scripts/serve-out.cjs [port]
 */
const http = require("http");
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..", "out");
const PORT = Number(process.argv[2] || 4173);

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".wasm": "application/wasm",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".ico": "image/x-icon",
};

if (!fs.existsSync(path.join(ROOT, "index.html"))) {
  console.error(`未找到 out/index.html，请先执行 npm run build`);
  process.exit(1);
}

const server = http.createServer((req, res) => {
  let urlPath = decodeURIComponent((req.url || "/").split("?")[0]);
  // GitHub Pages 子路径（/filepomelo/）模拟：剥掉前缀映射到 out/
  const PREFIX = process.env.SERVE_BASE_PATH;
  if (PREFIX && urlPath.startsWith(PREFIX)) {
    urlPath = urlPath.slice(PREFIX.length);
  }
  if (urlPath.endsWith("/")) urlPath += "index.html";
  let filePath = path.normalize(path.join(ROOT, urlPath));
  // 防目录穿越
  if (!filePath.startsWith(ROOT)) {
    res.writeHead(403);
    res.end("Forbidden");
    return;
  }
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(ROOT, "404", "index.html");
  }
  const ext = path.extname(filePath).toLowerCase();
  res.writeHead(200, { "Content-Type": MIME[ext] || "application/octet-stream" });
  fs.createReadStream(filePath).pipe(res);
});

server.listen(PORT, () => {
  console.log(`FilePomelo 静态预览: http://localhost:${PORT}`);
});
