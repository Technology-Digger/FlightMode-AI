import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Copy,
  Download,
  ListChecks,
  RefreshCw,
  Share2,
  Sparkles,
  Timer,
  Zap,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ExecutionStatusBadge } from "@/components/automation/ExecutionStatusBadge";
import { MarkdownViewer } from "@/components/automation/MarkdownViewer";
import { ProviderBadge } from "@/components/automation/ProviderBadge";
import { SuccessCheck } from "@/components/feedback/SuccessCheck";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { formatDateTime, formatDuration } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { ExecutionRun } from "@/types/automation";

interface ResultCardProps {
  run: ExecutionRun;
  onNew?: () => void;
  onRegenerate?: () => void;
  defaultExpanded?: boolean;
  className?: string;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}

/** Full result view: summary, actions, and collapsible markdown output. */
export function ResultCard({ run, onNew, onRegenerate, defaultExpanded = true, className }: ResultCardProps) {
  const [expanded, setExpanded] = useState(defaultExpanded);
  const { copied, copy } = useCopyToClipboard();
  const result = run.result;
  const summary = result?.summary;

  const handleCopy = async () => {
    if (!result) return;
    const ok = await copy(result.markdown);
    if (ok) toast.success("Result copied to clipboard");
  };

  const handleDownload = () => {
    if (!result) return;
    const blob = new Blob([result.markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${slugify(run.task) || "flight-mode-result"}.md`;
    anchor.click();
    URL.revokeObjectURL(url);
    toast.success("Result downloaded as Markdown");
  };

  const handleShare = async () => {
    const shareData = { title: "Flight Mode AI result", text: `Automation result: ${run.task}` };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
        return;
      } catch {
        // user dismissed share sheet — fall through to copy
      }
    }
    await copy(window.location.href);
    toast.success("Link copied — share it with your team");
  };

  if (!result || !summary) {
    return null;
  }

  return (
    <Card className={cn("gap-4 border-border/70 p-5 shadow-sm sm:p-6", className)}>
      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <SuccessCheck size={40} className="mt-0.5" />
          <div>
            <p className="text-base font-semibold leading-snug tracking-tight">{run.task}</p>
            <div className="mt-1.5 flex flex-wrap items-center gap-2">
              <ExecutionStatusBadge status={run.status} />
              <span className="text-xs text-muted-foreground">
                {formatDateTime(summary.completedAt)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Summary grid */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        <SummaryCell icon={<Timer className="size-3.5" />} label="Duration" value={formatDuration(summary.durationMs)} />
        <SummaryCell
          icon={<Zap className="size-3.5" />}
          label="Provider"
          value={<ProviderBadge providerId={summary.providerId} size="sm" />}
        />
        <SummaryCell
          icon={<Sparkles className="size-3.5" />}
          label="Fallback"
          value={
            summary.fallbackUsed ? (
              <span className="font-medium text-amber-600 dark:text-amber-400">Used</span>
            ) : (
              <span className="text-muted-foreground">None</span>
            )
          }
        />
        <SummaryCell
          icon={<ListChecks className="size-3.5" />}
          label="Steps"
          value={`${summary.stepCount} completed`}
        />
      </div>

      {/* Actions */}
      <div className="flex flex-wrap items-center gap-2">
        <Button type="button" size="sm" variant="outline" onClick={() => void handleCopy()}>
          {copied ? <Copy className="size-3.5 text-emerald-500" /> : <Copy className="size-3.5" />}
          {copied ? "Copied" : "Copy"}
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={handleDownload}>
          <Download className="size-3.5" />
          Download
        </Button>
        <Button type="button" size="sm" variant="outline" onClick={() => void handleShare()}>
          <Share2 className="size-3.5" />
          Share
        </Button>
        {onRegenerate && (
          <Button type="button" size="sm" variant="outline" onClick={onRegenerate}>
            <RefreshCw className="size-3.5" />
            Regenerate
          </Button>
        )}
        {onNew && (
          <Button type="button" size="sm" onClick={onNew} className="ml-auto">
            New automation
          </Button>
        )}
      </div>

      {/* Toggle + viewer */}
      <div>
        <button
          type="button"
          onClick={() => setExpanded((value) => !value)}
          className="group inline-flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-border/70 bg-muted/30 px-3.5 py-2.5 transition-colors hover:bg-muted/50"
          aria-expanded={expanded}
        >
          <span className="text-sm font-medium">Full result</span>
          <ChevronDown
            className={cn(
              "size-4 text-muted-foreground transition-transform duration-300",
              expanded && "rotate-180",
            )}
          />
        </button>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="overflow-hidden"
            >
              <div className="pt-3">
                <MarkdownViewer content={result.markdown} maxHeight={520} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Card>
  );
}

function SummaryCell({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="rounded-lg border border-border/60 bg-muted/30 p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <div className="mt-1 text-sm font-semibold">{value}</div>
    </div>
  );
}
