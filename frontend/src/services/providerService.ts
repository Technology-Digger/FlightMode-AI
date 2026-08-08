import { AI_PROVIDERS, getProviderById } from "@/data/providers";
import type { AIProvider, ProviderHealth, ProviderStatus } from "@/types/providers";

/**
 * Provider service.
 *
 * Static provider list used for UI display. Live provider health
 * comes from the backend health endpoint.
 */
export async function getProviders(): Promise<AIProvider[]> {
  return AI_PROVIDERS;
}

export async function getProviderHealth(): Promise<ProviderHealth[]> {
  const now = Date.now();
  return AI_PROVIDERS.map((provider) => ({
    providerId: provider.id,
    status: provider.status,
    latencyMs: provider.latencyMs,
    lastChecked: now,
  }));
}

/** Ordered fallback chain for a provider: healthy providers first. */
export function getFallbackChain(primaryId: string): AIProvider[] {
  return AI_PROVIDERS.filter(
    (provider) => provider.id !== primaryId && provider.status !== "outage",
  ).sort((a, b) => {
    const rank = (p: AIProvider): number =>
      p.status === "operational" ? 0 : p.status === "degraded" ? 1 : 2;
    const rankDiff = rank(a) - rank(b);
    if (rankDiff !== 0) return rankDiff;
    return a.latencyMs - b.latencyMs;
  });
}

export function getProvider(id: string | undefined | null): AIProvider | undefined {
  return getProviderById(id);
}

export function getStatusLabel(status: ProviderStatus): string {
  switch (status) {
    case "operational":
      return "Operational";
    case "degraded":
      return "Degraded";
    case "outage":
      return "Outage";
  }
}
