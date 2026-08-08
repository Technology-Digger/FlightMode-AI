import { isValidElement, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { CodeViewer } from "@/components/automation/CodeViewer";
import { cn } from "@/lib/utils";

interface MarkdownViewerProps {
  content: string;
  className?: string;
  maxHeight?: number;
}

function extractText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(extractText).join("");
  if (isValidElement(node)) return extractText((node.props as { children?: ReactNode }).children);
  return "";
}

const components: Components = {
  pre: (props) => {
    const child = Array.isArray(props.children) ? props.children[0] : props.children;
    const codeText = extractText(child);
    const codeProps = isValidElement(child)
      ? (child.props as { className?: string })
      : undefined;
    const language = codeProps?.className?.match(/language-([\w-]+)/)?.[1];
    return <CodeViewer code={codeText} language={language} />;
  },
  a: ({ node: _node, ...props }) => (
    <a {...props} target="_blank" rel="noreferrer noopener" />
  ),
};

/** Renders markdown (GFM) with styled tables, code blocks, and lists. */
export function MarkdownViewer({ content, className, maxHeight }: MarkdownViewerProps) {
  return (
    <div
      className={cn("markdown-body", className)}
      style={maxHeight ? { maxHeight, overflowY: "auto" } : undefined}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
