import { useQuery, useQueryClient } from "@tanstack/react-query";
import { AnimatePresence, motion } from "framer-motion";
import {
  Activity as ActivityIcon,
  CheckCircle2,
  CircleX,
  History,
  RefreshCw,
  Server,
  Sparkles,
  Square,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SkeletonList } from "@/components/feedback/Skeletons";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { PageHeader } from "@/components/common/PageHeader";
import { StatusCard } from "@/components/common/StatusCard";
import { ActivityFeed, type ActivityItem } from "@/components/automation/ActivityFeed";
import { TaskComposer, type TaskFormValues } from "@/components/automation/TaskComposer";
import { ProgressTracker } from "@/components/automation/ProgressTracker";
import { WorkflowTimeline } from "@/components/automation/WorkflowTimeline";
import { ExecutionLog } from "@/components/automation/ExecutionLog";
import { ExecutionStatusBadge } from "@/components/automation/ExecutionStatusBadge";
import { ResultCard } from "@/components/automation/ResultCard";
import { useExecutionSimulation } from "@/hooks/use-execution-simulation";
import { useKeyboardShortcuts } from "@/hooks/use-keyboard-shortcuts";
import { useSettings } from "@/contexts/settings-context";
import { getExecutions } from "@/services/automationService";
import { getGatewayHealth } from "@/services/healthService";
import { SHORTCUT_BINDINGS } from "@/constants/shortcuts";
import { createId, formatDuration, formatRelativeTime, truncate } from "@/lib/formatters";
import { ROUTES } from "@/routes/paths";
import { cn } from "@/lib/utils";
import type { ExecutionRun, ExecutionStatus } from "@/types/automation";

const SEED_ACTIVITY: ActivityItem[] = [
  {
    id: "seed-1",
    title: "Welcome to Flight Mode",
    description: "Describe a task below and press Launch.",
    tone: "info",
    icon: Sparkles,
    timestamp: Date.now() - 1000 * 60 * 5,
  },
  {
    id: "seed-2",
    title: "Gateway connected",
    description: "FastAPI AI Gateway v1.4.2 · 96ms",
    tone: "success",
    icon: Server,
    timestamp: Date.now() - 1000 * 60 * 6,
  },
];

export default function Workspace() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { settings } = useSettings();
  const [resetSignal, setResetSignal] = useState(0);
  const [activity, setActivity] = useState<ActivityItem[]>(SEED_ACTIVITY);
  const promptRef = useRef<HTMLTextAreaElement | null>(null);

  const sim = useExecutionSimulation(() => {
    queryClient.invalidateQueries({ queryKey: ["executions"] });
  });
  const { run } = sim;

  const pushActivity = (item: Omit<ActivityItem, "id" | "timestamp">) => {
    setActivity((prev) =>
      [{ id: createId("act"), timestamp: Date.now(), ...item }, ...prev].slice(0, 12),
    );
  };

  // Status-change toasts + activity
  const prevStatus = useRef<ExecutionStatus | null>(null);
  useEffect(() => {
    if (!run) {
      prevStatus.current = null;
      return;
    }
    const prev = prevStatus.current;
    prevStatus.current = run.status;
    if (prev === run.status) return;
    const prefs = settings.notifications;

    if (run.status === "running") {
      pushActivity({
        title: "Automation started",
        description: truncate(run.task, 72),
        tone: "running",
        icon: ActivityIcon,
      });
      if (prefs.runStarted) {
        toast.info("Automation started", { description: truncate(run.task, 64) });
      }
    } else if (run.status === "completed") {
      pushActivity({
        title: "Automation completed",
        description: `${run.steps.length} steps · ${formatDuration(run.elapsedMs)}`,
        tone: "success",
        icon: CheckCircle2,
      });
      if (prefs.runCompleted) {
        toast.success("Automation completed", {
          description: `Finished in ${formatDuration(run.elapsedMs)}`,
        });
      }
    } else if (run.status === "failed") {
      pushActivity({
        title: "Automation failed",
        description: run.error ?? undefined,
        tone: "error",
        icon: CircleX,
      });
      if (prefs.runFailed) {
        toast.error("Automation failed", { description: run.error ?? "Something went wrong" });
      }
    } else if (run.status === "cancelled") {
      pushActivity({ title: "Automation cancelled", tone: "warning", icon: CircleX });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run?.status]);

  // Fallback event toast + activity
  const prevFallback = useRef(false);
  useEffect(() => {
    if (!run?.fallbackUsed || prevFallback.current) return;
    prevFallback.current = true;
    pushActivity({
      title: "Provider fallback engaged",
      description: "A secondary provider completed the step automatically",
      tone: "warning",
      icon: RefreshCw,
    });
    if (settings.notifications.fallbackUsed) {
      toast.warning("Provider fallback engaged", {
        description: "A secondary provider completed the step.",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run?.fallbackUsed]);

  const handleStart = (values: TaskFormValues) => {
    sim.start({
      prompt: values.prompt,
      providerId: values.providerId,
      enableFallback: values.enableFallback,
    });
  };

  const handleNew = () => {
    sim.reset();
    setResetSignal((signal) => signal + 1);
    window.setTimeout(() => promptRef.current?.focus(), 80);
    pushActivity({ title: "New task ready", tone: "neutral", icon: Sparkles });
  };

  const handleRegenerate = () => {
    if (!run?.task) return;
    const task = run.task;
    const providerId = run.providerId;
    sim.reset();
    setResetSignal((signal) => signal + 1);
    window.setTimeout(() => {
      sim.start({ prompt: task, providerId, enableFallback: settings.enableFallback });
    }, 60);
  };

  useKeyboardShortcuts(
    {
      [SHORTCUT_BINDINGS.startAutomation]: () => {
        if (!run || run.status !== "running") {
          (document.getElementById("task-composer-form") as HTMLFormElement | null)?.requestSubmit();
        }
      },
      [SHORTCUT_BINDINGS.cancelAutomation]: () => {
        if (run?.status === "running" || run?.status === "queued") sim.cancel();
      },
      [SHORTCUT_BINDINGS.newAutomation]: () => handleNew(),
    },
    settings.keyboardShortcuts,
  );

  const isRunning = run?.status === "running" || run?.status === "queued";
  const viewKey = run ? run.status : "idle";

  return (
    <div className="space-y-6">
      <PageHeader
        title="Automation Workspace"
        description="Describe a task and Flight Mode takes the controls — orchestrating models and APIs while you watch, step by step."
      >
        <Button variant="outline" size="sm" asChild>
          <Link to={ROUTES.executions}>
            <History className="size-3.5" />
            Executions
          </Link>
        </Button>
        <Button size="sm" onClick={handleNew}>
          <Sparkles className="size-3.5" />
          New task
        </Button>
      </PageHeader>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 space-y-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={viewKey}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {(!run || run.status === "idle") && (
                <Card className="border-border/70 shadow-sm">
                  <CardHeader>
                    <CardTitle className="text-base">New automation</CardTitle>
                    <CardDescription>
                      Start from a prompt, a suggested idea, or a proven template.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TaskComposer
                      onSubmit={handleStart}
                      disabled={isRunning}
                      inputRef={promptRef}
                      resetSignal={resetSignal}
                    />
                  </CardContent>
                </Card>
              )}

              {isRunning && run && (
                <div className="space-y-6">
                  <ProgressTracker run={run} />
                  <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                      <div className="flex items-center justify-between gap-2">
                        <CardTitle className="text-base">Workflow timeline</CardTitle>
                        <ExecutionStatusBadge status={run.status} />
                      </div>
                      <CardDescription>
                        Live view of each stage as it executes.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <WorkflowTimeline steps={run.steps} />
                    </CardContent>
                  </Card>
                  <ExecutionLog logs={run.logs} />
                  <div className="flex flex-wrap items-center gap-3">
                    <Button type="button" variant="outline" onClick={sim.cancel}>
                      <Square className="size-3.5 fill-current" />
                      Cancel run
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      Simulated locally — the run stays live while this page is open.
                    </span>
                  </div>
                </div>
              )}

              {run?.status === "completed" && run.result && (
                <div className="space-y-6">
                  <ResultCard run={run} onNew={handleNew} onRegenerate={handleRegenerate} />
                  <Card className="border-border/70 shadow-sm">
                    <CardHeader>
                      <CardTitle className="text-base">Run details</CardTitle>
                      <CardDescription>
                        Steps, providers, and the full event log.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-5">
                      <WorkflowTimeline steps={run.steps} />
                      <ExecutionLog logs={run.logs} maxHeight={220} />
                    </CardContent>
                  </Card>
                </div>
              )}

              {run?.status === "failed" && (
                <Card className="border-border/70 p-0 shadow-sm">
                  <CardContent className="pt-6">
                    <ErrorState
                      title="Automation failed"
                      description="The workflow could not complete. Retry with the same task, or tweak the prompt and run again."
                      error={run.error}
                      onRetry={handleRegenerate}
                      onHome={() => navigate(ROUTES.landing)}
                    />
                  </CardContent>
                </Card>
              )}

              {run?.status === "cancelled" && (
                <div className="space-y-4">
                  <StatusCard
                    tone="warning"
                    title="Automation cancelled"
                    description="The run was stopped before completion. Partial progress is preserved in Executions."
                  />
                  <Button onClick={handleNew}>
                    <Sparkles className="size-3.5" />
                    Start a new task
                  </Button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <aside className="space-y-6">
          <Card className="border-border/70 shadow-sm">
            <CardHeader>
              <CardTitle className="text-base">Activity</CardTitle>
              <CardDescription>Live events from your workspace.</CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityFeed items={activity} />
            </CardContent>
          </Card>

          <GatewayHealthCard />

          <RecentRunsCard />
        </aside>
      </div>
    </div>
  );
}

function GatewayHealthCard() {
  const { data, isLoading } = useQuery({
    queryKey: ["gateway-health"],
    queryFn: getGatewayHealth,
    refetchInterval: 45_000,
  });

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">AI gateway</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SkeletonList rows={2} />
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-lg border border-border/60 bg-muted/30 px-3 py-2.5">
              <span className="flex items-center gap-2 text-sm font-medium">
                <Server className="size-4 text-muted-foreground" />
                FastAPI Gateway
              </span>
              <span
                className={cn(
                  "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                  data?.status === "online"
                    ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                    : "animate-pulse-soft bg-amber-500/10 text-amber-600 dark:text-amber-400",
                )}
              >
                {data?.status === "online" ? "Online" : "Degraded"}
              </span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Uptime</span>
              <span className="font-medium tabular-nums text-foreground">{data?.uptimePct}%</span>
            </div>
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>Response</span>
              <span className="font-medium tabular-nums text-foreground">{data?.latencyMs}ms</span>
            </div>
            <div className="space-y-1.5 border-t border-border/60 pt-2.5">
              {data?.providers.slice(0, 4).map((provider) => (
                <div key={provider.providerId} className="flex items-center gap-2 text-xs">
                  <span
                    className={cn(
                      "size-1.5 rounded-full",
                      provider.status === "operational"
                        ? "bg-emerald-500"
                        : provider.status === "degraded"
                          ? "bg-amber-500"
                          : "bg-destructive",
                    )}
                  />
                  <span className="capitalize text-muted-foreground">{provider.providerId}</span>
                  <span className="ml-auto tabular-nums text-muted-foreground/70">
                    {provider.latencyMs}ms
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function RecentRunsCard() {
  const { data, isLoading } = useQuery({ queryKey: ["executions"], queryFn: getExecutions });
  const runs = data?.slice(0, 4);

  return (
    <Card className="border-border/70 shadow-sm">
      <CardHeader>
        <CardTitle className="text-base">Recent runs</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <SkeletonList rows={3} />
        ) : runs && runs.length > 0 ? (
          <ul className="space-y-2">
            {runs.map((run: ExecutionRun) => (
              <li key={run.id}>
                <Link
                  to={`${ROUTES.executions}?run=${run.id}`}
                  className="flex items-center gap-2.5 rounded-lg border border-border/60 px-3 py-2 transition-colors hover:bg-muted/40"
                >
                  <span
                    className={cn(
                      "size-1.5 shrink-0 rounded-full",
                      run.status === "completed" && "bg-emerald-500",
                      run.status === "failed" && "bg-destructive",
                      run.status === "running" && "animate-pulse-soft bg-primary",
                      (run.status === "cancelled" || run.status === "queued") && "bg-amber-500",
                      run.status === "idle" && "bg-muted-foreground",
                    )}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-medium">
                      {truncate(run.task, 44)}
                    </span>
                    <span className="block text-[11px] text-muted-foreground">
                      {formatRelativeTime(run.startedAt)} · {run.steps.length} steps
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            compact
            title="No runs yet"
            description="Start your first automation in the workspace."
            className="min-h-32"
          />
        )}
        <Link
          to={ROUTES.executions}
          className="mt-3 block text-center text-xs font-medium text-primary hover:underline"
        >
          View all executions
        </Link>
      </CardContent>
    </Card>
  );
}
