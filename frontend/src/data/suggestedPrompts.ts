export interface SuggestedPrompt {
  label: string;
  prompt: string;
}

export const SUGGESTED_PROMPTS: SuggestedPrompt[] = [
  {
    label: "Market research",
    prompt:
      "Research the wearable sleep-tracking market and produce a structured report with size, growth, key players, and risks for a new entrant.",
  },
  {
    label: "Email campaign",
    prompt:
      "Draft a launch email for our new AI automation product aimed at engineering leaders, with a subject line, three value bullets, and a CTA.",
  },
  {
    label: "Code refactor",
    prompt:
      "Review our React frontend and produce a prioritized refactor plan with concrete code examples for render performance and bundle size.",
  },
  {
    label: "Weekly briefing",
    prompt:
      "Summarize this week's team activity into an executive briefing with adoption numbers, wins, blockers, and three recommendations.",
  },
];
