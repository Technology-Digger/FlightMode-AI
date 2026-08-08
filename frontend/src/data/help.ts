import {
  Activity,
  BrainCircuit,
  FileCheck,
  GitBranch,
  LifeBuoy,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export interface HelpArticle {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  sections: { heading: string; body: string }[];
}

export const HELP_ARTICLES: HelpArticle[] = [
  {
    id: "how-it-works",
    title: "How automation works",
    description: "From plain-language task to finished deliverable.",
    icon: Workflow,
    sections: [
      {
        heading: "One prompt, full workflow",
        body: "Open the Workspace, describe what you need, and press Launch. Flight Mode translates your request into a structured plan with distinct stages, then assigns each stage the most suitable AI model and external tool.",
      },
      {
        heading: "What you see while it runs",
        body: "The execution view streams live: current step, animated progress, elapsed time, provider being used, and a running log of events. If a provider fails, you'll see the retry and the automatic fallback appear inline.",
      },
      {
        heading: "What you get",
        body: "When the run completes you receive a formatted result — summary, key findings, metrics, code blocks, and recommendations — plus an execution summary card with duration, provider, and steps performed.",
      },
    ],
  },
  {
    id: "workflow-stages",
    title: "Workflow stages",
    description: "The five stages every automation moves through.",
    icon: GitBranch,
    sections: [
      {
        heading: "Interpret",
        body: "The task is parsed for intent, entities, and constraints. Flight Mode decides which workflow template and tools apply, and which model leads.",
      },
      {
        heading: "Research",
        body: "When needed, the run gathers context — web search, structured lookups — and condenses the results into working notes for drafting.",
      },
      {
        heading: "Draft",
        body: "The chosen provider composes the deliverable section by section. If it errors here, retries and fallback providers kick in automatically.",
      },
      {
        heading: "Validate",
        body: "Quality gates check accuracy, tone, and format against the original task. Minor issues are corrected before delivery.",
      },
      {
        heading: "Deliver",
        body: "The final document is compiled — tables, code blocks, and summary included — and presented in the result view.",
      },
    ],
  },
  {
    id: "ai-fallback",
    title: "AI provider fallback",
    description: "What happens when a provider stumbles.",
    icon: BrainCircuit,
    sections: [
      {
        heading: "The fallback chain",
        body: "Every run has a primary provider. If a step fails, Flight Mode retries once, then automatically routes to the next healthy provider in the chain — no action needed from you.",
      },
      {
        heading: "You always see it",
        body: "Fallbacks are never silent. The execution log marks the failed attempt, the retry, and the switch, and the step badge shows the provider that actually completed it.",
      },
      {
        heading: "Tuning",
        body: "In Settings you can change the default provider, or disable automatic fallback entirely for your runs.",
      },
    ],
  },
  {
    id: "execution-lifecycle",
    title: "Execution lifecycle",
    description: "Queued, running, completed, failed, cancelled.",
    icon: Activity,
    sections: [
      {
        heading: "States",
        body: "A run moves through Queued → Running → Completed. It can end in Failed (an unrecoverable error) or Cancelled (you stopped it). Every state is reflected live in the UI.",
      },
      {
        heading: "Recovery",
        body: "Failed runs keep their logs and partial progress so you can see exactly where things broke. Start a new run to retry, or tweak the prompt first.",
      },
      {
        heading: "History",
        body: "All of your runs appear in Executions with search and filters, including their results and execution summaries.",
      },
    ],
  },
  {
    id: "faq",
    title: "Frequently asked questions",
    description: "Quick answers to common questions.",
    icon: LifeBuoy,
    sections: [
      {
        heading: "Is this connected to a real AI backend?",
        body: "No — this build is a frontend-only experience with a typed mock service layer. When you're ready, point VITE_API_BASE_URL at your FastAPI gateway and the same UI will stream real runs.",
      },
      {
        heading: "Where are my results stored?",
        body: "In your browser session only. Nothing is uploaded anywhere until you connect a backend.",
      },
      {
        heading: "Can I change the theme and preferences?",
        body: "Yes — Settings covers theme, animations, default provider, fallback, notifications, accessibility, and developer mode. Preferences persist in your browser.",
      },
    ],
  },
];
