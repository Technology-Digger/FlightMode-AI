import { useCallback, useEffect, useRef, useState } from "react";

import { SIM_TICK_MS } from "@/constants/limits";
import { buildExecutionPlan, compileResult } from "@/utils/automationEngine";
import { recordExecution } from "@/services/automationService";
import { apiRequest } from "@/services/apiClient";
import { createId, formatDuration } from "@/lib/formatters";
import type {
  ExecutionPlan,
  ExecutionRun,
  ExecutionStep,
  LogEntry,
  LogLevel,
  TaskRequest,
} from "@/types/automation";

interface SimulationState {
  run: ExecutionRun;
  plan: ExecutionPlan;
  stepIndex: number;
  stepStartAt: number;
  logIndex: number;
  fallbackApplied: boolean;
  done: boolean;
}

export interface ExecutionSimulation {
  run: ExecutionRun | null;
  start: (request: TaskRequest) => void;
  cancel: () => void;
  reset: () => void;
}

function pushLog(run: ExecutionRun, stepIndex: number, level: LogLevel, message: string, time: number) {
  const entry: LogEntry = { id: createId("log"), time, level, message };
  run.steps[stepIndex]?.logs.push(entry);
  run.logs.push(entry);
}

/**
 * Simulates a live automation run entirely in the browser.
 *
 * The workflow plan (steps, timings, log script, fallback event) comes from the
 * service layer, so wiring this hook to a real streaming gateway later only
 * requires replacing the interval loop with a WebSocket/SSE subscription.
 */
export function useExecutionSimulation(onComplete?: (run: ExecutionRun) => void): ExecutionSimulation {
  const [run, setRun] = useState<ExecutionRun | null>(null);
  const timerRef = useRef<number | null>(null);
  const stateRef = useRef<SimulationState | null>(null);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const stopTimer = useCallback(() => {
    if (timerRef.current !== null) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const finish = useCallback((
    state: SimulationState,
    now: number,
    backendRes?: { content: string; provider: string; fallback_used: boolean; processing_time_ms: number }
  ) => {
    state.done = true;
    stopTimer();
    const run = state.run;
    run.status = "completed";
    run.finishedAt = now;
    
    if (backendRes) {
      run.elapsedMs = backendRes.processing_time_ms;
      run.providerId = backendRes.provider;
      if (backendRes.fallback_used) {
        run.fallbackUsed = true;
      }
      run.progress = 100;
      run.currentStepIndex = run.steps.length - 1;
      
      run.result = {
        markdown: backendRes.content,
        summary: {
          task: run.task,
          providerId: run.providerId,
          fallbackUsed: Boolean(run.fallbackUsed),
          stepCount: run.steps.length,
          durationMs: run.elapsedMs,
          completedAt: run.finishedAt,
        }
      };
      pushLog(run, run.steps.length - 1, "success", `Workflow completed via backend in ${formatDuration(run.elapsedMs)}`, now);
    } else {
      run.elapsedMs = now - run.startedAt;
      run.progress = 100;
      run.currentStepIndex = run.steps.length - 1;
      run.result = compileResult(run);
      pushLog(run, run.steps.length - 1, "success", `Workflow completed in ${formatDuration(run.elapsedMs)}`, now);
    }
    
    recordExecution(run);
    setRun({ ...run });
    onCompleteRef.current?.(run);
  }, [stopTimer]);

  const tick = useCallback(() => {
    const state = stateRef.current;
    if (!state || state.done) return;

    const now = Date.now();
    const run = state.run;
    const planStep = state.plan.steps[state.stepIndex];
    const step = run.steps[state.stepIndex];
    const stepElapsed = now - state.stepStartAt;

    // Stream planned log lines.
    while (state.logIndex < planStep.logScript.length) {
      const line = planStep.logScript[state.logIndex]!;
      if (line.at > stepElapsed) break;
      pushLog(run, state.stepIndex, line.level, line.message, now);
      state.logIndex += 1;
    }

    // Fire the fallback event if the step script calls for it.
    if (planStep.fallback && !state.fallbackApplied && stepElapsed >= planStep.fallback.at) {
      state.fallbackApplied = true;
      step.providerId = planStep.fallback.to;
      step.fallback = {
        from: planStep.fallback.from,
        to: planStep.fallback.to,
        reason: planStep.fallback.reason,
      };
      step.retried = true;
      run.fallbackUsed = true;
    }

    // Complete the current step and advance.
    if (stepElapsed >= planStep.durationMs) {
      step.status = "completed";
      step.durationMs = planStep.durationMs;
      pushLog(run, state.stepIndex, "success", `Step complete — ${step.title}`, now);

      if (state.stepIndex + 1 < state.plan.steps.length) {
        state.stepIndex += 1;
        state.stepStartAt = now;
        state.logIndex = 0;
        state.fallbackApplied = false;
        const next = run.steps[state.stepIndex]!;
        next.status = "running";
        run.currentStepIndex = state.stepIndex;
        pushLog(run, state.stepIndex, "system", `Starting step — ${next.title}`, now);
      } else {
        // Stall at 99% until backend responds
        run.progress = 99;
        setRun({ ...run });
        return;
      }
    }

    run.elapsedMs = now - run.startedAt;
    run.progress = Math.min(99, Math.round((run.elapsedMs / state.plan.estimatedDurationMs) * 100));
    setRun({ ...run });
  }, [finish, stopTimer]);

  const start = useCallback(
    (request: TaskRequest) => {
      stopTimer();
      if (stateRef.current && !stateRef.current.done && stateRef.current.run.status === "running") {
        return;
      }

      const plan = buildExecutionPlan(request);
      const now = Date.now();

      const steps: ExecutionStep[] = plan.steps.map((planned) => ({
        id: planned.id,
        title: planned.title,
        description: planned.description,
        stageId: planned.stageId,
        status: "pending",
        providerId: planned.providerId,
        externalApi: planned.externalApi ?? null,
        retried: planned.retried,
        fallback: null,
        logs: [],
      }));
      steps[0]!.status = "running";

      const primaryProviderId =
        request.providerId ?? plan.steps[0]?.providerId ?? "openai";

      const nextRun: ExecutionRun = {
        id: plan.id,
        task: request.prompt,
        templateId: request.templateId,
        status: "running",
        steps,
        logs: [
          {
            id: createId("log"),
            time: now,
            level: "system",
            message: `Workflow planned — ${plan.steps.length} stages · ${formatDuration(plan.estimatedDurationMs)} estimated`,
          },
        ],
        startedAt: now,
        currentStepIndex: 0,
        progress: 0,
        providerId: primaryProviderId,
        estimatedDurationMs: plan.estimatedDurationMs,
        elapsedMs: 0,
      };

      stateRef.current = {
        run: nextRun,
        plan,
        stepIndex: 0,
        stepStartAt: now,
        logIndex: 0,
        fallbackApplied: false,
        done: false,
      };

      setRun({ ...nextRun });
      timerRef.current = window.setInterval(tick, SIM_TICK_MS);

      // Concurrent backend request
      apiRequest<{
        content: string;
        provider: string;
        model: string;
        fallback_used: boolean;
        processing_time_ms: number;
      }>("/api/automation", {
        method: "POST",
        body: JSON.stringify({
          prompt: request.prompt,
          templateId: request.templateId,
          providerId: request.providerId,
          enableFallback: request.enableFallback,
        }),
      })
      .then((res) => {
        const current = stateRef.current;
        if (current && !current.done) {
          finish(current, Date.now(), res);
        }
      })
      .catch((err) => {
        const current = stateRef.current;
        if (current && !current.done) {
           current.done = true;
           stopTimer();
           current.run.status = "failed";
           const ts = Date.now();
           current.run.finishedAt = ts;
           current.run.elapsedMs = ts - current.run.startedAt;
           pushLog(current.run, current.stepIndex, "error", err instanceof Error ? err.message : "Gateway error", ts);
           setRun({ ...current.run });
        }
      });
    },
    [stopTimer, tick],
  );

  const cancel = useCallback(() => {
    const state = stateRef.current;
    if (!state || state.done) return;
    state.done = true;
    stopTimer();
    const now = Date.now();
    state.run.status = "cancelled";
    state.run.finishedAt = now;
    state.run.elapsedMs = now - state.run.startedAt;
    pushLog(state.run, state.stepIndex, "warning", "Workflow cancelled by user", now);
    setRun({ ...state.run });
  }, [stopTimer]);

  const reset = useCallback(() => {
    stopTimer();
    stateRef.current = null;
    setRun(null);
  }, [stopTimer]);

  useEffect(() => stopTimer, [stopTimer]);

  return { run, start, cancel, reset };
}
