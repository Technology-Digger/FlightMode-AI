export interface DailyExecutionPoint {
  date: string;
  label: string;
  runs: number;
  completed: number;
  failed: number;
  avgDurationMs: number;
}

export interface ProviderUsageSlice {
  providerId: string;
  runs: number;
  percent: number;
}

export interface StepDistributionPoint {
  label: string;
  count: number;
}

export interface AnalyticsSnapshot {
  totalRuns: number;
  successRate: number;
  avgDurationMs: number;
  totalSteps: number;
  daily: DailyExecutionPoint[];
  providerUsage: ProviderUsageSlice[];
  stepsDistribution: StepDistributionPoint[];
}
