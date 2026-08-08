import { Badge } from "@/components/ui/badge";
import { EXECUTION_STATUS_META, type Tone } from "@/utils/status";
import type { ExecutionStatus } from "@/types/automation";
import { cn } from "@/lib/utils";

const TONE_CLASSES: Record<Tone, string> = {
  success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400",
  error: "border-destructive/30 bg-destructive/10 text-destructive",
  warning: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400",
  info: "border-sky-500/30 bg-sky-500/10 text-sky-700 dark:text-sky-400",
  running: "border-primary/30 bg-primary/10 text-primary",
  neutral: "border-border bg-muted text-muted-foreground",
};

const DOT_CLASSES: Record<Tone, string> = {
  success: "bg-emerald-500",
  error: "bg-destructive",
  warning: "bg-amber-500",
  info: "bg-sky-500",
  running: "bg-primary animate-pulse-soft",
  neutral: "bg-muted-foreground/60",
};

export function ExecutionStatusBadge({
  status,
  className,
}: {
  status: ExecutionStatus;
  className?: string;
}) {
  const meta = EXECUTION_STATUS_META[status];
  return (
    <Badge
      variant="outline"
      className={cn("gap-1.5 px-2.5 py-1", TONE_CLASSES[meta.tone], className)}
    >
      <span className={cn("size-1.5 rounded-full", DOT_CLASSES[meta.tone])} />
      {meta.label}
    </Badge>
  );
}
