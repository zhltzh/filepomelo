/**
 * gifsicle-wasm-browser 类型声明（包本身无 d.ts）。
 * 见 https://github.com/renzhezhilu/gifsicle-wasm-browser
 */
declare module "gifsicle-wasm-browser" {
  interface GifInput {
    /** 本地文件（File/Blob/ArrayBuffer）或网络 url */
    file: File | Blob | ArrayBuffer;
    /** command 中使用的文件名（不可重复） */
    name: string;
  }
  interface GifRunOptions {
    input: GifInput[];
    /** 逐条执行的 gifsicle 命令；最后一条必须以 -o /out/**.gif 结尾 */
    command: string[];
    /** 可选的文件夹名 */
    folder?: string[];
    /** command 出错/警告时立即结束 */
    isStrict?: boolean;
  }
  interface Gifsicle {
    run(options: GifRunOptions): Promise<File[]>;
  }
  const gifsicle: Gifsicle;
  export default gifsicle;
}
