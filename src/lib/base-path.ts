/**
 * GitHub Pages 子路径部署前缀。
 *
 * 仓库 filepomelo → Pages 地址 https://zhltzh.github.io/filepomelo/（子路径）。
 * CI（deploy.yml）构建时设置 NEXT_PUBLIC_BASE_PATH=/filepomelo，所有站点资源
 * 自动带上该前缀；本地开发不设该变量，前缀为空。
 *
 * 之后绑定自定义域名（如 filepomelo.com，根路径部署）时，把 CI 里的
 * NEXT_PUBLIC_BASE_PATH 删掉即可全站回归根路径，无需改代码。
 */
export const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

/** 拼接站点静态资源绝对路径（vendor/worker/icon 等） */
export const asset = (p: string) => `${basePath}${p}`;
