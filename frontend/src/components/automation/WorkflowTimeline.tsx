import { AnimatePresence, motion } from "framer-motion";
import { Check, ChevronDown, Loader2, RefreshCw, X } from "lucide-react";
import { useState } from "react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ProviderBadge } from "@/components/automation/ProviderBadge";
import { formatDuration } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { ExecutionStep, StepStatus } from "@/types/automation";

function StepIcon({ status }: { status: StepStatus }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={status}
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.5, opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="grid place-items-center"
      >
        {status === "completed" && <Check className="size-3.5 text-white" />}
        {status === "running" && <Loader2 className="size-3.5 animate-spin text-white" />}
        {status === "failed" && <X className="size-3.5 text-white" />}
        {(status === "pending" || status === "skipped") && (
          <span className="block size-2 rounded-full bg-muted-foreground/40" />
        )}
      </motion.span>
    </AnimatePresence>
  );
}

function nodeClasses(status: StepStatus): string {
  switch (status) {
    case "completed":
      return "bg-primary border-primary text-primary-foreground";
    case "running":
      return "bg-primary border-primary text-primary-foreground ring-4 ring-primary/25";
    case "failed":
      return "bg-destructive border-destructive text-white";
    default:
      return "bg-background border-border text-muted-foreground";
  }
}

interface WorkflowTimelineProps {
  steps: ExecutionStep[];
  className?: string;
}

/** Vertical execution timeline with animated step states and expandable logs. */
export function WorkflowTimeline({ steps, className }: WorkflowTimelineProps) {
  return (
    <ol className={cn("space-y-0", className)} aria-label="Execution timeline">
      {steps.map((step, index) => {
        const isLast = index === steps.length - 1;
        const hasLogs = step.logs.length > 0;
        return (
          <li key={step.id} className="relative flex gap-3.5">
            {/* Node + connector */}
            <div className="flex shrink-0 flex-col items-center">
              <motion.div
                initial={false}
                animate={{ scale: step.status === "running" ? [1, 1.06, 1] : 1 }}
                transition={{ duration: 1.4, repeat: step.status === "running" ? Infinity : 0, ease: "easeInOut" }}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border transition-colors duration-300",
                  nodeClasses(step.status),
                )}
              >
                <StepIcon status={step.status} />
              </motion.div>
              {!isLast && (
                <div
                  className={cn(
                    "mt-1 w-px flex-1 transition-colors duration-500",
                    step.status === "completed" ? "bg-primary/50" : "bg-border",
                  )}
                  aria-hidden="true"
                />
              )}
            </div>

            {/* Content */}
            <div className={cn("min-w-0 flex-1 pb-6", isLast && "pb-0")}>
              <div className="flex flex-wrap items-center gap-2">
                <h3
                  className={cn(
                    "text-sm font-semibold",
                    step.status === "pending" && "text-muted-foreground/70",
                  )}
                >
                  {step.title}
                </h3>
                {step.status === "running" && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
                    <Loader2 className="size-2.5 animate-spin" />
                    Running
                  </span>
                )}
                {step.retried && !step.fallback && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                    <RefreshCw className="size-2.5" />
                    Retried
                  </span>
                )}
              </div>

              <p className="mt-0.5 text-[13px] text-muted-foreground">{step.description}</p>

              {(step.providerId || step.externalApi || step.fallback || step.durationMs) && (
                <div className="mt-2 flex flex-wrap items-center gap-1.5">
                  {step.providerId && (
                    <ProviderBadge providerId={step.providerId} size="sm" fallback={Boolean(step.fallback)} />
                  )}
                  {step.externalApi && (
                    <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-background px-2 py-0.5 text-[11px] font-medium text-muted-foreground">
                      {step.externalApi}
                    </span>
                  )}
                  {step.durationMs !== undefined && (
                    <span className="text-[11px] tabular-nums text-muted-foreground">
                      {formatDuration(step.durationMs)}
                    </span>
                  )}
                </div>
              )}

              {hasLogs && (
                <Collapsible className="mt-2">
                  <CollapsibleTrigger asChild>
                    <button
                      type="button"
                      className="group inline-flex cursor-pointer items-center gap-1 rounded-md px-1 py-0.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                    >
                      <ChevronDown className="size-3 transition-transform duration-200 group-data-[state=open]:rotate-180" />
                      Logs ({step.logs.length})
                    </button>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-1.5 max-h-44 overflow-auto rounded-lg border border-border/70 bg-muted/40 p-2.5 font-mono text-[11px] leading-relaxed">
                      {step.logs.map((log) => (
                        <p key={log.id} className="flex gap-2 text-muted-foreground">
                          <span className="shrink-0 tabular-nums opacity-60">
                            {new Date(log.time).toTimeString().slice(0, 8)}
                          </span>
                          <span className="min-w-0 break-words">{log.message}</span>
                        </p>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
