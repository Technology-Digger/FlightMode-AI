import type {
  ExecutionRun,
  ExecutionStep,
  LogEntry,
  StepStatus,
} from "@/types/automation";
import { buildExecutionPlan, compileResult } from "@/utils/automationEngine";
import { createId } from "@/lib/formatters";

interface SeedSpec {
  task: string;
  status: ExecutionRun["status"];
  providerId: string;
  minutesAgo: number;
  fallbackUsed?: boolean;
  error?: string;
}

/** Resolve per-step statuses for a seed run. */
function resolveStatuses(status: SeedSpec["status"], stepCount: number): StepStatus[] {
  switch (status) {
    case "completed":
      return Array.from({ length: stepCount }, (): StepStatus => "completed");
    case "running":
      return ["completed", "completed", "running", ...Array.from({ length: stepCount - 3 }, (): StepStatus => "pending")];
    case "cancelled":
      return ["completed", "completed", ...Array.from({ length: stepCount - 2 }, (): StepStatus => "pending")];
    case "failed":
      return ["completed", "completed", "failed", ...Array.from({ length: stepCount - 3 }, (): StepStatus => "pending")];
    default:
      return Array.from({ length: stepCount }, (): StepStatus => "pending");
  }
}

function buildSteps(
  plan: ReturnType<typeof buildExecutionPlan>,
  statuses: StepStatus[],
  startedAt: number,
): ExecutionStep[] {
  return plan.steps.map((planned, index) => {
    const status = statuses[index] ?? "pending";
    const isDraft = index === 2;
    const providerId = isDraft && planned.fallback ? planned.fallback.to : planned.providerId;

    const logs: LogEntry[] =
      status === "pending"
        ? []
        : status === "running"
          ? planned.logScript.slice(0, 3).map((line) => ({
              id: createId("log"),
              time: startedAt + line.at,
              level: line.level,
              message: line.message,
            }))
          : planned.logScript.map((line) => ({
              id: createId("log"),
              time: startedAt + line.at,
              level: line.level,
              message: line.message,
            }));

    return {
      id: planned.id,
      title: planned.title,
      description: planned.description,
      stageId: planned.stageId,
      status,
      providerId,
      externalApi: planned.externalApi ?? null,
      durationMs: status === "completed" ? planned.durationMs : undefined,
      retried: planned.retried,
      fallback: planned.fallback && isDraft && status !== "pending"
        ? { from: planned.fallback.from, to: planned.fallback.to, reason: planned.fallback.reason }
        : null,
      logs,
    };
  });
}

function makeSeedRun(spec: SeedSpec): ExecutionRun {
  const startedAt = Date.now() - spec.minutesAgo * 60_000;
  const plan = buildExecutionPlan({
    prompt: spec.task,
    providerId: spec.providerId,
    enableFallback: spec.fallbackUsed,
  });

  const statuses = resolveStatuses(spec.status, plan.steps.length);
  const steps = buildSteps(plan, statuses, startedAt);

  const running = spec.status === "running";
  const completed = spec.status === "completed";
  const elapsedMs = completed
    ? plan.estimatedDurationMs
    : Date.now() - startedAt;
  const finishedAt =
    completed || spec.status === "failed"
      ? startedAt + elapsedMs
      : undefined;

  const run: ExecutionRun = {
    id: createId("run"),
    task: spec.task,
    status: spec.status,
    steps,
    logs: [],
    startedAt,
    finishedAt,
    currentStepIndex: completed ? steps.length - 1 : statuses.indexOf("running") >= 0 ? statuses.indexOf("running") : 0,
    progress: completed ? 100 : running ? 48 : spec.status === "cancelled" ? 34 : 0,
    providerId: spec.providerId,
    fallbackUsed: Boolean(spec.fallbackUsed),
    estimatedDurationMs: plan.estimatedDurationMs,
    elapsedMs,
    error: spec.error ?? null,
  };

  run.result = completed ? compileResult(run) : undefined;

  run.logs = steps
    .flatMap((step) => step.logs)
    .sort((a, b) => a.time - b.time);

  if (spec.status === "failed") {
    run.logs.push({
      id: createId("log"),
      time: finishedAt ?? Date.now(),
      level: "error",
      message: spec.error ?? "Workflow failed: unrecoverable provider error",
    });
  }

  return run;
}

const SEEDS: SeedSpec[] = [
  {
    task: "Research the market for electric bike subscriptions in Europe and deliver a structured report.",
    status: "completed",
    providerId: "openai",
    minutesAgo: 28,
    fallbackUsed: true,
  },
  {
    task: "Draft a launch email for our new AI workflow automation product aimed at engineering leaders.",
    status: "completed",
    providerId: "anthropic",
    minutesAgo: 64,
  },
  {
    task: "Review our React + TypeScript frontend and produce a prioritized refactor plan with code examples.",
    status: "completed",
    providerId: "google",
    minutesAgo: 132,
  },
  {
    task: "Prepare an executive briefing on our AI automation rollout with adoption numbers and recommendations.",
    status: "completed",
    providerId: "openai",
    minutesAgo: 230,
  },
  {
    task: "Design a REST API for a task-automation service with endpoints, schemas, and an error model.",
    status: "completed",
    providerId: "mistral",
    minutesAgo: 342,
  },
  {
    task: "Turn these meeting notes into a clean recap with action items, owners, and due dates.",
    status: "completed",
    providerId: "openai",
    minutesAgo: 26,
  },
  {
    task: "Analyze our competitors in project management software and map positioning and gaps.",
    status: "failed",
    providerId: "anthropic",
    minutesAgo: 58,
    error: "Provider outage during draft stage — automatic retry exhausted",
  },
  {
    task: "Create a blog post outline on how AI agents will change internal operations teams.",
    status: "cancelled",
    providerId: "openai",
    minutesAgo: 12,
  },
  {
    task: "Summarize this week's team activity into an executive briefing with wins and blockers.",
    status: "running",
    providerId: "google",
    minutesAgo: 1,
  },
];

/** Seed history for the Executions page. Session runs are prepended by the service. */
export const MOCK_EXECUTIONS: ExecutionRun[] = SEEDS.map(makeSeedRun);
