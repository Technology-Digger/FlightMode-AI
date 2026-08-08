import { Terminal } from "lucide-react";
import { useEffect, useRef } from "react";

import { cn } from "@/lib/utils";
import type { LogEntry, LogLevel } from "@/types/automation";

const LEVEL_STYLES: Record<LogLevel, string> = {
  info: "text-muted-foreground",
  success: "text-emerald-600 dark:text-emerald-400",
  warning: "text-amber-600 dark:text-amber-400",
  error: "text-destructive",
  system: "text-primary",
};

interface ExecutionLogProps {
  logs: LogEntry[];
  className?: string;
  autoScroll?: boolean;
  maxHeight?: number;
  emptyMessage?: string;
}

/** Monospace streaming log view with auto-scroll. */
export function ExecutionLog({
  logs,
  className,
  autoScroll = true,
  maxHeight = 280,
  emptyMessage = "Waiting for events…",
}: ExecutionLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs.length, autoScroll]);

  return (
    <div
      className={cn(
        "overflow-hidden rounded-xl border border-border/70 bg-muted/30",
        className,
      )}
    >
      <div className="flex items-center gap-2 border-b border-border/70 px-3.5 py-2">
        <Terminal className="size-3.5 text-muted-foreground" />
        <span className="text-xs font-medium text-muted-foreground">Execution log</span>
        <span className="ml-auto flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <span className="size-1.5 rounded-full bg-emerald-500" />
          live
        </span>
      </div>
      <div
        ref={scrollRef}
        className="space-y-1 overflow-y-auto p-3.5 font-mono text-[11.5px] leading-relaxed"
        style={{ maxHeight }}
        aria-live="polite"
      >
        {logs.length === 0 ? (
          <p className="py-6 text-center text-muted-foreground">{emptyMessage}</p>
        ) : (
          logs.map((entry) => (
            <p key={entry.id} className="flex gap-2.5">
              <span className="shrink-0 tabular-nums text-muted-foreground/60">
                {new Date(entry.time).toTimeString().slice(0, 8)}
              </span>
              <span className={cn("min-w-0 break-words", LEVEL_STYLES[entry.level])}>
                {entry.message}
              </span>
            </p>
          ))
        )}
      </div>
    </div>
  );
}
