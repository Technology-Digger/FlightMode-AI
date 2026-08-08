import type { ExecutionStatus, LogLevel, StepStatus } from "@/types/automation";

export type Tone = "success" | "error" | "warning" | "info" | "neutral" | "running";

export const EXECUTION_STATUS_META: Record<
  ExecutionStatus,
  { label: string; tone: Tone }
> = {
  idle: { label: "Idle", tone: "neutral" },
  queued: { label: "Queued", tone: "info" },
  running: { label: "Running", tone: "running" },
  completed: { label: "Completed", tone: "success" },
  failed: { label: "Failed", tone: "error" },
  cancelled: { label: "Cancelled", tone: "warning" },
};

export const STEP_STATUS_META: Record<
  StepStatus,
  { label: string; tone: Tone }
> = {
  pending: { label: "Pending", tone: "neutral" },
  running: { label: "Running", tone: "running" },
  completed: { label: "Completed", tone: "success" },
  failed: { label: "Failed", tone: "error" },
  skipped: { label: "Skipped", tone: "warning" },
};

export const LOG_LEVEL_META: Record<
  LogLevel,
  { label: string; tone: Tone }
> = {
  info: { label: "Info", tone: "info" },
  success: { label: "Success", tone: "success" },
  warning: { label: "Warning", tone: "warning" },
  error: { label: "Error", tone: "error" },
  system: { label: "System", tone: "neutral" },
};
