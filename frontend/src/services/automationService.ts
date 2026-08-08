import type { ExecutionRun } from "@/types/automation";
import { AUTOMATION_TEMPLATES, getTemplateById } from "@/data/mockTemplates";
import { getMockAnalytics } from "@/data/mockAnalytics";
import { MOCK_EXECUTIONS } from "@/data/mockExecutions";

/** Runs created in this browser session (in-memory persistence). */
const sessionExecutions: ExecutionRun[] = [];

/**
 * Automation service.
 *
 * Templates, analytics, and execution history are served from static data.
 * Live automation runs go through the backend via use-execution-simulation.
 */
export async function getTemplates() {
  return AUTOMATION_TEMPLATES;
}

export async function getExecutions(): Promise<ExecutionRun[]> {
  return [...sessionExecutions, ...MOCK_EXECUTIONS];
}

export async function getExecutionById(id: string): Promise<ExecutionRun | undefined> {
  return [...sessionExecutions, ...MOCK_EXECUTIONS].find((run) => run.id === id);
}

/** Record a finished session run (completed / failed / cancelled). */
export function recordExecution(run: ExecutionRun): void {
  sessionExecutions.unshift(run);
  if (sessionExecutions.length > 20) sessionExecutions.length = 20;
}

export function getTemplateTitle(id: string | undefined): string {
  return getTemplateById(id)?.name ?? "Custom task";
}

export async function getAnalytics() {
  return getMockAnalytics();
}

export type { ExecutionRun };
