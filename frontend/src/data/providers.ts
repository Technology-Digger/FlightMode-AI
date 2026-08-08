import {
  BrainCircuit,
  Cpu,
  FlaskConical,
  Rocket,
  Sparkles,
  Wind,
  type LucideIcon,
} from "lucide-react";

import type { AIProvider } from "@/types/providers";

export const AI_PROVIDERS: AIProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    vendor: "OpenAI",
    model: "GPT-4o",
    description: "Strong general reasoning with broad tool support.",
    status: "operational",
    latencyMs: 842,
    costPer1k: 0.005,
    capabilities: ["reasoning", "code", "analysis", "tool-use"],
    color: "#10a37f",
    icon: Sparkles,
    preferred: true,
  },
  {
    id: "anthropic",
    name: "Anthropic",
    vendor: "Anthropic",
    model: "Claude 4.5 Sonnet",
    description: "Long-context drafting and careful instruction following.",
    status: "degraded",
    latencyMs: 1134,
    costPer1k: 0.003,
    capabilities: ["reasoning", "long-context", "writing", "tool-use"],
    color: "#d97706",
    icon: BrainCircuit,
  },
  {
    id: "google",
    name: "Google",
    vendor: "Google DeepMind",
    model: "Gemini 2.5 Pro",
    description: "Fast multimodal reasoning and retrieval.",
    status: "operational",
    latencyMs: 690,
    costPer1k: 0.004,
    capabilities: ["reasoning", "multimodal", "retrieval"],
    color: "#2563eb",
    icon: FlaskConical,
  },
  {
    id: "mistral",
    name: "Mistral",
    vendor: "Mistral AI",
    model: "Mistral Large 2",
    description: "Efficient European model with strong multilingual skills.",
    status: "operational",
    latencyMs: 522,
    costPer1k: 0.002,
    capabilities: ["reasoning", "multilingual"],
    color: "#0d9488",
    icon: Wind,
  },
  {
    id: "xai",
    name: "xAI",
    vendor: "xAI",
    model: "Grok 4",
    description: "Real-time knowledge with a distinctive voice.",
    status: "operational",
    latencyMs: 978,
    costPer1k: 0.006,
    capabilities: ["reasoning", "realtime"],
    color: "#475569",
    icon: Rocket,
  },
  {
    id: "deepseek",
    name: "DeepSeek",
    vendor: "DeepSeek",
    model: "DeepSeek-V3",
    description: "Open-weight reasoning model with low cost per token.",
    status: "operational",
    latencyMs: 1164,
    costPer1k: 0.001,
    capabilities: ["reasoning", "math", "code"],
    color: "#7c3aed",
    icon: Cpu,
  },
];

export const PROVIDER_ICONS: Record<string, LucideIcon> = Object.fromEntries(
  AI_PROVIDERS.map((provider) => [provider.id, provider.icon]),
);

export function getProviderById(id: string | undefined | null): AIProvider | undefined {
  return AI_PROVIDERS.find((provider) => provider.id === id);
}

export function getProviderName(id: string | undefined | null): string {
  return getProviderById(id)?.name ?? "Unknown provider";
}
