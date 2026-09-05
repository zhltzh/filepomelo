import { ToolLayout } from "@/components/tools/tool-layout";
import { CompressorHub } from "@/components/home/compressor-hub";
import type { ToolDefinition } from "@/config/tools";

/** 压缩工具页共享渲染：按工具定义渲染布局与对应操作区 */
export function ToolPage({ tool }: { tool: ToolDefinition }) {
  return (
    <ToolLayout tool={tool}>
      <CompressorHub category={tool.category} />
    </ToolLayout>
  );
}
