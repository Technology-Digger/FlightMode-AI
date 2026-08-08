import {
  Braces,
  Briefcase,
  CalendarClock,
  Code2,
  Mail,
  PenLine,
  ScanSearch,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

export type TemplateCategory = "Research" | "Content" | "Engineering" | "Operations";

export interface AutomationTemplate {
  id: string;
  name: string;
  description: string;
  category: TemplateCategory;
  icon: LucideIcon;
  color: string;
  steps: number;
  prompt: string;
}

export const AUTOMATION_TEMPLATES: AutomationTemplate[] = [
  {
    id: "market-research",
    name: "Market research report",
    description: "Deep-dive a market, segment, or trend and get a structured report.",
    category: "Research",
    icon: TrendingUp,
    color: "#6366f1",
    steps: 5,
    prompt:
      "Research the current market for electric bike subscriptions in Europe. Cover market size, key players, pricing models, and the biggest risks for a new entrant. Deliver a structured report with data points and sources.",
  },
  {
    id: "competitor-analysis",
    name: "Competitor analysis",
    description: "Map competitors, positioning, and gaps in a clear comparison.",
    category: "Research",
    icon: ScanSearch,
    color: "#0ea5e9",
    steps: 5,
    prompt:
      "Analyze our three main competitors in project management software: Linear, Notion, and Asana. Compare positioning, pricing, strengths, weaknesses, and untapped opportunities for a new lightweight tool.",
  },
  {
    id: "email-campaign",
    name: "Email campaign draft",
    description: "Generate a conversion-focused email with subject-line options.",
    category: "Content",
    icon: Mail,
    color: "#ec4899",
    steps: 4,
    prompt:
      "Draft a launch email for our new AI workflow automation product. The audience is engineering leaders. Include a strong subject line, three value bullets, a CTA, and a short follow-up email variant.",
  },
  {
    id: "blog-post",
    name: "Blog post outline",
    description: "Turn a topic into an editorial outline with key sections.",
    category: "Content",
    icon: PenLine,
    color: "#f59e0b",
    steps: 4,
    prompt:
      "Create a blog post outline on 'how AI agents will change internal operations teams in 2026'. Include an engaging intro hook, six main sections with sub-bullets, and a conclusion with a call to action.",
  },
  {
    id: "code-review",
    name: "Code review & refactor plan",
    description: "Review a codebase and produce a prioritized refactor plan.",
    category: "Engineering",
    icon: Code2,
    color: "#22c55e",
    steps: 5,
    prompt:
      "Review our React + TypeScript frontend for performance and maintainability issues. Produce a prioritized refactor plan with concrete code examples, focusing on render performance, bundle size, and state management.",
  },
  {
    id: "api-spec",
    name: "API design spec",
    description: "Design an endpoint contract with schemas and examples.",
    category: "Engineering",
    icon: Braces,
    color: "#8b5cf6",
    steps: 5,
    prompt:
      "Design a REST API for a task-automation service. Define the endpoints for creating a workflow, starting a run, streaming execution logs, and fetching results. Include request/response schemas and an error model.",
  },
  {
    id: "executive-brief",
    name: "Executive briefing",
    description: "Distill signals into a crisp leadership-ready brief.",
    category: "Operations",
    icon: Briefcase,
    color: "#14b8a6",
    steps: 4,
    prompt:
      "Prepare an executive briefing on our AI automation rollout. Summarize adoption numbers, time saved, provider costs, top use cases, and three recommendations for the next quarter. Keep it under one page.",
  },
  {
    id: "meeting-recap",
    name: "Meeting recap & action items",
    description: "Turn meeting notes into a tidy recap with owners and due dates.",
    category: "Operations",
    icon: CalendarClock,
    color: "#f43f5e",
    steps: 3,
    prompt:
      "Turn these notes into a clean meeting recap with action items, owners, and due dates: discussed Q3 roadmap, launched new pricing page, debated provider fallback strategy, agreed to cut analytics spend by 20%.",
  },
];

export function getTemplateById(id: string | undefined | null): AutomationTemplate | undefined {
  return AUTOMATION_TEMPLATES.find((template) => template.id === id);
}
