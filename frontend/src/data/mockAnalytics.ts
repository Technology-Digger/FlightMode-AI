import type { AnalyticsSnapshot } from "@/types/analytics";
import { formatDateShort } from "@/lib/formatters";

/** Deterministic PRNG so mock charts are stable across renders. */
function mulberry32(seed: number) {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function getMockAnalytics(): AnalyticsSnapshot {
  const rand = mulberry32(42);
  const now = Date.now();
  const day = 86_400_000;

  const daily = Array.from({ length: 14 }, (_, index) => {
    const timestamp = now - (13 - index) * day;
    const runs = Math.round(38 + rand() * 54);
    const failed = Math.round(runs * (0.01 + rand() * 0.03));
    const completed = runs - failed;
    return {
      date: new Date(timestamp).toISOString().slice(0, 10),
      label: formatDateShort(timestamp),
      runs,
      completed,
      failed,
      avgDurationMs: Math.round(9_000 + rand() * 12_000),
    };
  });

  const providerUsage = [
    { providerId: "openai", runs: 486, percent: 46 },
    { providerId: "anthropic", runs: 231, percent: 22 },
    { providerId: "google", runs: 178, percent: 17 },
    { providerId: "mistral", runs: 96, percent: 9 },
    { providerId: "xai", runs: 64, percent: 6 },
  ];

  const stepsDistribution = [
    { label: "Interpret", count: 640 },
    { label: "Research", count: 598 },
    { label: "Draft", count: 574 },
    { label: "Validate", count: 552 },
    { label: "Deliver", count: 541 },
  ];

  const totalRuns = daily.reduce((sum, point) => sum + point.runs, 0);
  const completed = daily.reduce((sum, point) => sum + point.completed, 0);

  return {
    totalRuns,
    successRate: (completed / totalRuns) * 100,
    avgDurationMs: Math.round(
      daily.reduce((sum, point) => sum + point.avgDurationMs, 0) / daily.length,
    ),
    totalSteps: stepsDistribution.reduce((sum, point) => sum + point.count, 0),
    daily,
    providerUsage,
    stepsDistribution,
  };
}
