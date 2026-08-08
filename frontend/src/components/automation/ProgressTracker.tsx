import { Activity, CalendarClock, ListChecks, Timer } from "lucide-react";
import type { ReactNode } from "react";

import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/common/ProgressBar";
import { ProviderBadge } from "@/components/automation/ProviderBadge";
import { ExecutionStatusBadge } from "@/components/automation/ExecutionStatusBadge";
import { formatClock, formatDuration } from "@/lib/formatters";
import type { ExecutionRun } from "@/types/automation";

function TrackerStat({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-border/60 bg-muted/30 p-3">
      <div className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {icon}
        {label}
      </div>
      <p className="mt-1 truncate text-sm font-semibold" title={value}>
        {value}
      </p>
    </div>
  );
}

/** Live progress card shown during execution. */
export function ProgressTracker({ run }: { run: ExecutionRun }) {
  const remaining = Math.max(0, run.estimatedDurationMs - run.elapsedMs);
  const currentStep = run.steps[run.currentStepIndex];
  const completedSteps = run.steps.filter((step) => step.status === "completed").length;

  return (
    <Card className="gap-4 border-border/70 p-5 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <ExecutionStatusBadge status={run.status} />
        <span className="text-2xl font-semibold tabular-nums tracking-tight">
          {run.progress}
          <span className="text-sm text-muted-foreground">%</span>
        </span>
      </div>

      <ProgressBar value={run.progress} size="lg" />

      <div className="grid grid-cols-2 gap-2.5 lg:grid-cols-4">
        <TrackerStat icon={<Timer className="size-3" />} label="Elapsed" value={formatClock(run.elapsedMs)} />
        <TrackerStat
          icon={<CalendarClock className="size-3" />}
          label="Est. remaining"
          value={formatDuration(remaining)}
        />
        <TrackerStat icon={<Activity className="size-3" />} label="Current step" value={currentStep?.title ?? "—"} />
        <TrackerStat
          icon={<ListChecks className="size-3" />}
          label="Steps"
          value={`${completedSteps} / ${run.steps.length}`}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <ProviderBadge providerId={run.providerId} showStatus size="md" />
        {run.fallbackUsed && (
          <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-xs font-medium text-amber-700 dark:text-amber-400">
            Fallback engaged
          </span>
        )}
        <span className="ml-auto text-xs text-muted-foreground">
          Gateway v1.4.2 · streaming
        </span>
      </div>
    </Card>
  );
}
