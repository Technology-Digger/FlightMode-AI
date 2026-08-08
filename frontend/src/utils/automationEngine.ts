import type {
  ExecutionPlan,
  ExecutionResult,
  ExecutionRun,
  LogLevel,
  PlannedStep,
  TaskRequest,
  WorkflowStageId,
} from "@/types/automation";
import { APP_VERSION } from "@/constants/app";
import { getProvider, getFallbackChain } from "@/services/providerService";
import { getProviderById } from "@/data/providers";
import { getTemplateById } from "@/data/mockTemplates";
import { createId, formatDuration, titleCase, truncate } from "@/lib/formatters";

/* ------------------------------------------------------------------ */
/* Workflow flavor detection                                           */
/* ------------------------------------------------------------------ */

export interface WorkflowFlavor {
  id: "research" | "content" | "engineering" | "operations" | "general";
  label: string;
}

function detectFlavor(task: string): WorkflowFlavor {
  const text = task.toLowerCase();
  if (/(research|analy|market|competitor|trend|report|survey)/.test(text)) {
    return { id: "research", label: "Research & analysis" };
  }
  if (/(email|post|copy|blog|article|newsletter|write|draft|launch)/.test(text)) {
    return { id: "content", label: "Content generation" };
  }
  if (/(code|refactor|review|api|bug|schema|sql|frontend|typescript|react)/.test(text)) {
    return { id: "engineering", label: "Engineering" };
  }
  if (/(brief|summary|status|meeting|recap|dashboard|executive|adoption)/.test(text)) {
    return { id: "operations", label: "Operations" };
  }
  return { id: "general", label: "General task" };
}

/* ------------------------------------------------------------------ */
/* Log script helpers                                                  */
/* ------------------------------------------------------------------ */

interface ScriptLine {
  at: number;
  level: LogLevel;
  message: string;
}

const system = (at: number, message: string): ScriptLine => ({ at, level: "system", message });
const info = (at: number, message: string): ScriptLine => ({ at, level: "info", message });
const success = (at: number, message: string): ScriptLine => ({ at, level: "success", message });
const warn = (at: number, message: string): ScriptLine => ({ at, level: "warning", message });
const error = (at: number, message: string): ScriptLine => ({ at, level: "error", message });

/* ------------------------------------------------------------------ */
/* Plan builder                                                        */
/* ------------------------------------------------------------------ */

export function buildExecutionPlan(request: TaskRequest): ExecutionPlan {
  const flavor = detectFlavor(request.prompt);
  const primary = getProvider(request.providerId) ?? getProviderById("openai")!;
  const fallbackChain = getFallbackChain(primary.id);
  const fallback = fallbackChain[0];
  const useFallback = request.enableFallback !== false && fallback !== undefined;
  const template = getTemplateById(request.templateId);

  const interpret: PlannedStep = {
    id: createId("step"),
    title: "Interpret request",
    description: "Parsing intent, entities, and constraints",
    stageId: "interpret",
    providerId: primary.id,
    durationMs: 2400,
    logScript: [
      system(300, `Routing to ${primary.name} (${primary.model})`),
      info(800, "Parsing task intent and extracting key entities"),
      info(1500, `Detected workflow: ${flavor.label}`),
      info(2100, "Workflow assembled — 5 stages, 1 tool integration"),
    ],
  };

  const research: PlannedStep = {
    id: createId("step"),
    title: "Gather context",
    description: "Retrieving sources and building working notes",
    stageId: "research",
    providerId: primary.id,
    externalApi: "web-search",
    durationMs: 3600,
    logScript: [
      system(300, "Calling external API — web-search"),
      info(900, "Issued 4 search queries across 2 indexes"),
      info(1700, "Retrieved 24 sources · ranked by relevance"),
      info(2500, "Synthesizing context into structured notes"),
      success(3200, "Context bundle ready (18 KB)"),
    ],
  };

  const draft: PlannedStep = useFallback
    ? {
        id: createId("step"),
        title: "Draft deliverable",
        description: "Composing the response section by section",
        stageId: "draft",
        providerId: primary.id,
        retried: true,
        fallback: {
          from: primary.id,
          to: fallback.id,
          reason: "Primary provider unavailable after retry",
          at: 2600,
        },
        durationMs: 6400,
        logScript: [
          info(350, "Outlining response structure"),
          info(950, "Writing section 1 of 3…"),
          error(1500, `${primary.name} request timed out after 12.4s`),
          warn(2100, `Retrying on ${primary.name}…`),
          error(2600, `Provider returned 502 — ${primary.name} unavailable`),
          warn(3200, `Switching to ${fallback.name} (${fallback.model})`),
          info(4100, "Writing section 2 of 3…"),
          info(5100, "Writing section 3 of 3…"),
          success(5900, `First draft complete on ${fallback.name}`),
        ],
      }
    : {
        id: createId("step"),
        title: "Draft deliverable",
        description: "Composing the response section by section",
        stageId: "draft",
        providerId: primary.id,
        durationMs: 3800,
        logScript: [
          info(350, "Outlining response structure"),
          info(1100, "Writing section 1 of 3…"),
          info(2000, "Writing section 2 of 3…"),
          info(2900, "Writing section 3 of 3…"),
          success(3400, "First draft complete"),
        ],
      };

  const validate: PlannedStep = {
    id: createId("step"),
    title: "Validate & refine",
    description: "Running quality gates and corrections",
    stageId: "validate",
    providerId: primary.id,
    externalApi: "quality-check",
    durationMs: 3200,
    logScript: [
      system(300, "Running quality checks — accuracy, tone, format"),
      info(1000, "Cross-checking facts against sources"),
      info(1900, "Applied 2 minor revisions"),
      success(2600, "Quality score 96/100"),
    ],
  };

  const deliver: PlannedStep = {
    id: createId("step"),
    title: "Compile result",
    description: "Formatting and assembling the final document",
    stageId: "deliver",
    providerId: primary.id,
    durationMs: 2000,
    logScript: [
      system(300, "Compiling final deliverable"),
      info(1000, "Formatting tables and code blocks"),
      success(1600, "Result ready for delivery"),
    ],
  };

  const steps = [interpret, research, draft, validate, deliver];
  const estimatedDurationMs = steps.reduce((sum, step) => sum + step.durationMs, 0);

  return {
    id: createId("run"),
    steps,
    estimatedDurationMs,
  };
}

/* ------------------------------------------------------------------ */
/* Result compiler                                                     */
/* ------------------------------------------------------------------ */

interface FlavorContent {
  sectionTitle: string;
  summary: string[];
  findings: string[];
  paragraph: string;
  codeTitle: string;
  code: string;
}

function flavorContent(flavor: WorkflowFlavor, task: string): FlavorContent {
  const topic = truncate(task, 72).toLowerCase();

  switch (flavor.id) {
    case "research":
      return {
        sectionTitle: "Market & data view",
        summary: [
          `The analysis of "${topic}" produced a structured picture of the opportunity: a growing, competitive space where timing and focus are the deciding factors.`,
          "Signals from recent activity point to consolidation among incumbents and room for a focused, faster alternative.",
        ],
        findings: [
          "The segment is expanding at a healthy clip, driven by adoption among mid-size teams.",
          "Incumbent pricing clusters in two bands, leaving the mid-market underserved.",
          "Early adopters consistently cite speed and quality of output as the deciding factor.",
        ],
        paragraph:
          "The dataset below summarizes the competitive snapshot captured during the research stage. Figures are illustrative mock values for this frontend demo.",
        codeTitle: "comparison_snapshot.json",
        code: `{
  "segment": "${truncate(task, 40)}",
  "growth_yoy": 0.34,
  "players": [
    { "name": "Incumbent A", "share": 0.41, "price": "high" },
    { "name": "Incumbent B", "share": 0.27, "price": "mid" },
    { "name": "New entrants", "share": 0.12, "price": "low" }
  ],
  "gap": "mid-market underserved"
}`,
      };
    case "content":
      return {
        sectionTitle: "Messaging draft",
        summary: [
          `The draft for "${topic}" leads with a problem-focused hook, then lands three concrete value points before a single clear call to action.`,
          "Two tone variants were generated so the team can A/B the opening.",
        ],
        findings: [
          "Subject lines that name the outcome outperform generic greetings.",
          "Three bullets read better than five — trimming is the highest-leverage edit.",
          "A single CTA per email lifts click-through in the reference data.",
        ],
        paragraph:
          "Below is the primary variant scaffold. Swap in brand-specific numbers before sending; the quality gate flagged no factual claims.",
        codeTitle: "email_variant.tsx",
        code: `export const launchEmail = {
  subject: "Ship automations without the glue code",
  preview: "Describe a task. Watch it run. Get the result.",
  bullets: [
    "Live execution view for every step",
    "Automatic provider fallback",
    "Formatted, share-ready output",
  ],
  cta: { label: "Start your first run", href: "/app/workspace" },
};`,
      };
    case "engineering":
      return {
        sectionTitle: "Technical review",
        summary: [
          `The review of "${topic}" surfaced three clusters of issues: render cost, bundle weight, and state sprawl.`,
          "Each finding includes a concrete fix, ordered by effort-to-impact ratio.",
        ],
        findings: [
          "Frequently re-rendering lists are the top cause of frame drops in the sample traces.",
          "Vendor chunks for charts and forms can be code-split behind lazy routes.",
          "Local state duplication causes stale props in three components.",
        ],
        paragraph:
          "The snippet below illustrates the recommended memoization + split pattern for the highest-impact offender.",
        codeTitle: "refactor_pattern.tsx",
        code: `// Before: list re-renders on every keystroke
export const Row = ({ item }: { item: RowData }) => (
  <MemoRow data={item} onEdit={useCallback(handleEdit, [])} />
);

// After: virtualize + memo + split the heavy chart
const HeavyChart = lazy(() => import("./HeavyChart"));
const Row = memo(RowView, (a, b) => a.item.id === b.item.id);`,
      };
    case "operations":
      return {
        sectionTitle: "Briefing structure",
        summary: [
          `The briefing for "${topic}" distills the raw signals into adoption, wins, blockers, and three recommendations.`,
          "The format is tuned for a one-page leadership read.",
        ],
        findings: [
          "Adoption is ahead of plan with steady week-over-week growth.",
          "One provider accounts for the majority of spend — an optimization target.",
          "The top blocker is onboarding time for new workspaces.",
        ],
        paragraph:
          "The template below is the recommended structure for the next weekly brief.",
        codeTitle: "briefing.md",
        code: `# Weekly AI Ops Briefing
## Adoption        → +12% WoW, 214 active runs
## Spend           → $1.2k (OpenAI 58%, Anthropic 31%)
## Wins            → Support triage automations live
## Blockers        → Onboarding time for new workspaces
## Recommendations → 1) Cut analytics spend 20%  2) Publish onboarding guide`,
      };
    default:
      return {
        sectionTitle: "Core findings",
        summary: [
          `The run for "${topic}" completed successfully across all five stages.`,
          "The result below summarizes the key output in a reusable, documented format.",
        ],
        findings: [
          "All planned stages completed without manual intervention.",
          "Quality gates passed with a score of 96/100.",
          "The deliverable is formatted for direct reuse.",
        ],
        paragraph:
          "The JSON below is the machine-readable summary of the completed run.",
        codeTitle: "run_summary.json",
        code: `{
  "task": "${truncate(task, 40)}",
  "status": "completed",
  "quality_score": 96,
  "steps": 5,
  "artifacts": ["summary", "findings", "recommendations"]
}`,
      };
  }
}

export function compileResult(run: ExecutionRun): ExecutionResult {
  const provider = getProvider(run.providerId) ?? getProviderById("openai")!;
  const fallbackProvider = run.steps
    .map((step) => step.fallback?.to)
    .find((id) => id !== undefined);
  const fallbackName = fallbackProvider
    ? getProviderById(fallbackProvider)?.name
    : undefined;

  const flavor = detectFlavor(run.task);
  const content = flavorContent(flavor, run.task);
  const title = titleCase(truncate(run.task, 60));
  const duration = formatDuration(run.elapsedMs || run.estimatedDurationMs);
  const date = new Date(run.finishedAt ?? Date.now()).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const fallbackRows = run.fallbackUsed
    ? `| Fallback provider | ${fallbackName ?? "Automatic"} |\n`
    : "";

  const markdown = `# ${title}

> **Flight Mode AI** · ${run.steps.length} steps · ${provider.name}${run.fallbackUsed ? ` with ${fallbackName ?? "automatic"} fallback` : ""} · ${duration} · ${date}

## Executive Summary

${content.summary.join("\n\n")}

## Key Findings

${content.findings.map((finding) => `- ${finding}`).join("\n")}

## Metrics

| Metric | Value |
| --- | --- |
| Task | ${truncate(run.task, 48)} |
| Workflow | ${flavor.label} |
| Steps executed | ${run.steps.length} |
| Primary provider | ${provider.name} · ${provider.model} |
${fallbackRows}| Quality score | 96 / 100 |
| Total time | ${duration} |

## ${content.sectionTitle}

${content.paragraph}

\`\`\`${content.codeTitle.split(".").pop()}
${content.code}
\`\`\`

## Recommendations

1. **Start with the highest-leverage item** — the data above shows where effort compounds fastest.
2. **Automate the repeatable 80%** — turn this run into a reusable template.
3. **Review before sharing** — quality gates passed, but final context is yours.

## Next Steps

- Save this task as a template for one-click reruns.
- Compare output across providers from the **Analytics** page.
- Connect the FastAPI gateway to stream live provider results.

---
*Generated by Flight Mode AI v${APP_VERSION} — frontend demo. Mock result; connect your gateway for live data.*
`;

  return {
    markdown,
    summary: {
      task: run.task,
      providerId: run.providerId,
      fallbackUsed: Boolean(run.fallbackUsed),
      stepCount: run.steps.length,
      durationMs: run.elapsedMs || run.estimatedDurationMs,
      completedAt: run.finishedAt ?? Date.now(),
    },
  };
}
