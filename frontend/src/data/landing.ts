import {
  Activity,
  FileCheck,
  Layers,
  ShieldCheck,
  Sparkles,
  Workflow,
  type LucideIcon,
} from "lucide-react";

export interface FeatureItem {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface ProcessStep {
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface StatItem {
  value: string;
  label: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export const FEATURES: FeatureItem[] = [
  {
    icon: Sparkles,
    title: "Describe a task, get a workflow",
    description:
      "Tell Flight Mode what you need in plain language. It breaks the goal into a multi-stage workflow, assigns the right models, and wires in the external APIs required — no manual coordination.",
  },
  {
    icon: Activity,
    title: "Live flight tracking",
    description:
      "Watch every stage in real time: the current step, streaming logs, provider and API calls, and progress — complete transparency, never a black box.",
  },
  {
    icon: Layers,
    title: "Multi-model orchestration",
    description:
      "Each step routes to the best AI model for the job. If a provider degrades, Flight Mode retries and falls back automatically without interrupting the run.",
  },
  {
    icon: Workflow,
    title: "External API coordination",
    description:
      "Web search, databases, and third-party services are called and coordinated for you — you never manage a single endpoint or credential.",
  },
  {
    icon: ShieldCheck,
    title: "Quality gates, built in",
    description:
      "Every deliverable passes automated checks for accuracy, tone, and format before it reaches you — output you can trust.",
  },
  {
    icon: FileCheck,
    title: "Effortless to repeat",
    description:
      "Turn successful runs into reusable templates. Your team gets consistent results from a shared library of proven workflows.",
  },
];

export const PROCESS_STEPS: ProcessStep[] = [
  {
    icon: Sparkles,
    title: "Describe",
    description:
      "Tell Flight Mode what you need in your own words — a report, an analysis, a campaign, a plan.",
  },
  {
    icon: Workflow,
    title: "Plan",
    description:
      "The orchestrator assembles the workflow: which models to call, which APIs to use, and in what order.",
  },
  {
    icon: Activity,
    title: "Execute",
    description:
      "Stages run autonomously with live logs, retries, and automatic fallback — minimal intervention required.",
  },
  {
    icon: FileCheck,
    title: "Deliver",
    description:
      "A validated, polished result lands in your workspace, ready to copy, download, or run again.",
  },
];

export const STATS: StatItem[] = [
  { value: "12h", label: "saved per team, weekly" },
  { value: "98.7%", label: "successful runs" },
  { value: "6", label: "AI models orchestrated" },
  { value: "<30s", label: "to first result" },
];

export const FAQS: FaqItem[] = [
  {
    question: "How does Flight Mode complete tasks without me managing tools?",
    answer:
      "You describe a goal in plain language. Flight Mode's orchestrator decomposes it into stages — interpret, research, draft, validate, deliver — and each stage is executed by the best-fit AI model with optional tool calls like web search. You watch it run live and receive a finished deliverable, with none of the coordination handled manually.",
  },
  {
    question: "Which AI models and external services are supported?",
    answer:
      "Out of the box: OpenAI, Anthropic, Google, Mistral, xAI, and DeepSeek — plus external capabilities such as web search and structured lookups through the gateway. Each step is routed to the strongest model for the job, and you can set your default preference in Settings.",
  },
  {
    question: "What happens if an AI provider fails mid-run?",
    answer:
      "Flight Mode retries the request, and if the provider stays unavailable it automatically falls back to a healthy secondary provider. The execution view shows you exactly when a fallback happened and why — nothing happens behind your back.",
  },
  {
    question: "Can I trust the results?",
    answer:
      "Every run passes through quality gates that check accuracy, tone, and formatting against the task. Results cite the sources they used and include a quality score. For anything mission-critical, treat the output as a strong draft for final human review.",
  },
  {
    question: "Do I need to manage API keys or integrations myself?",
    answer:
      "No. The gateway coordinates models and external services for you. This frontend ships with a clean service layer ready for a FastAPI gateway — set VITE_API_BASE_URL and the automation, provider, and health services will call real endpoints without any UI changes.",
  },
  {
    question: "Is my data used for training?",
    answer:
      "No. Tasks and results are processed only for your runs. Provider routing and privacy policies are configurable, and the frontend keeps all state local until you connect a backend.",
  },
];
