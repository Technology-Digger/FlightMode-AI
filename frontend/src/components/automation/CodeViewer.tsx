import { Check, Copy } from "lucide-react";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { cn } from "@/lib/utils";

interface CodeViewerProps {
  code: string;
  language?: string;
  title?: string;
  className?: string;
  maxHeight?: number;
  showHeader?: boolean;
}

/** Code block with copy action and language label. */
export function CodeViewer({
  code,
  language,
  title,
  className,
  maxHeight = 420,
  showHeader = true,
}: CodeViewerProps) {
  const { copied, copy } = useCopyToClipboard();

  return (
    <div className={cn("overflow-hidden rounded-xl border border-border/70", className)}>
      {showHeader && (
        <div className="flex items-center justify-between gap-2 border-b border-border/70 bg-muted/50 px-3.5 py-2">
          <span className="truncate text-xs font-medium text-muted-foreground">
            {title ?? (language ? `${language} snippet` : "Code")}
          </span>
          <button
            type="button"
            onClick={() => void copy(code)}
            className={cn(
              "inline-flex shrink-0 cursor-pointer items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-medium transition-colors",
              copied
                ? "text-emerald-600 dark:text-emerald-400"
                : "text-muted-foreground hover:bg-muted hover:text-foreground",
            )}
          >
            {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      )}
      <pre
        className="overflow-auto bg-[oklch(0.2_0.014_262)] p-4 font-mono text-[12.5px] leading-relaxed text-slate-100"
        style={{ maxHeight }}
      >
        <code>{code}</code>
      </pre>
    </div>
  );
}
