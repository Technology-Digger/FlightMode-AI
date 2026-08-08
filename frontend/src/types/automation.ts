export type ExecutionStatus =
  | "idle"
  | "queued"
  | "running"
  | "completed"
  | "failed"
  | "cancelled";

export type StepStatus = "pending" | "running" | "completed" | "failed" | "skipped";

export type LogLevel = "info" | "success" | "warning" | "error" | "system";

export type WorkflowStageId =
  | "interpret"
  | "research"
  | "draft"
  | "validate"
  | "deliver";

export interface WorkflowStageDef {
  id: WorkflowStageId;
  label: string;
  description: string;
}

export interface LogEntry {
  id: string;
  time: number;
  level: LogLevel;
  message: string;
}

export interface ProviderFallback {
  from: string;
  to: string;
  reason: string;
}

export interface ExecutionStep {
  id: string;
  title: string;
  description: string;
  stageId: WorkflowStageId;
  status: StepStatus;
  /** Provider actually executing this step (changes when a fallback fires). */
  providerId: string | null;
  /** External capability used by this step, e.g. "web-search". */
  externalApi?: string | null;
  durationMs?: number;
  retried?: boolean;
  fallback?: ProviderFallback | null;
  logs: LogEntry[];
}

export interface ExecutionResult {
  markdown: string;
  summary: {
    task: string;
    providerId: string;
    fallbackUsed: boolean;
    stepCount: number;
    durationMs: number;
    completedAt: number;
  };
}

export interface ExecutionRun {
  id: string;
  task: string;
  templateId?: string;
  status: ExecutionStatus;
  steps: ExecutionStep[];
  /** Global stream of log events across the whole run. */
  logs: LogEntry[];
  startedAt: number;
  finishedAt?: number;
  currentStepIndex: number;
  progress: number;
  /** Primary provider for this run. */
  providerId: string;
  fallbackUsed?: boolean;
  estimatedDurationMs: number;
  elapsedMs: number;
  result?: ExecutionResult;
  error?: string | null;
}

export interface TaskRequest {
  prompt: string;
  templateId?: string;
  providerId?: string;
  enableFallback?: boolean;
}

/** A pre-planned step produced by the service layer before execution. */
export interface PlannedStep {
  id: string;
  title: string;
  description: string;
  stageId: WorkflowStageId;
  providerId: string | null;
  externalApi?: string | null;
  /** Total duration of the step including retries / fallback time. */
  durationMs: number;
  /** Log lines with offsets (ms) from the start of the step. */
  logScript: { at: number; level: LogLevel; message: string }[];
  /** Fallback event fired mid-step. */
  fallback?: { from: string; to: string; reason: string; at: number };
  retried?: boolean;
}

export interface ExecutionPlan {
  id: string;
  steps: PlannedStep[];
  estimatedDurationMs: number;
}
