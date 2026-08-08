import { useQuery } from "@tanstack/react-query";
import { ListChecks, ShieldCheck, Timer, Workflow } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/common/ErrorState";
import { PageHeader } from "@/components/common/PageHeader";
import { SkeletonCard, SkeletonTable } from "@/components/feedback/Skeletons";
import { StatCard } from "@/components/common/StatCard";
import { ExecutionTrendChart } from "@/components/charts/ExecutionTrendChart";
import { ProviderUsageChart } from "@/components/charts/ProviderUsageChart";
import { SuccessRateChart } from "@/components/charts/SuccessRateChart";
import { StepsDistributionChart } from "@/components/charts/StepsDistributionChart";
import { getAnalytics } from "@/services/automationService";
import { formatDuration, formatNumber, formatPercent } from "@/lib/formatters";

export default function Analytics() {
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["analytics"],
    queryFn: getAnalytics,
  });

  if (isError) {
    return (
      <div className="space-y-6">
        <PageHeader title="Analytics" description="Usage, provider, and success metrics for your runs." />
        <ErrorState
          title="Could not load analytics"
          error={error}
          onRetry={() => void refetch()}
          onHome={() => window.history.back()}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics"
        description="Usage, provider, and success metrics for your runs — mock data, ready for the gateway."
      />

      {isLoading && !data ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
      ) : data ? (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total runs"
              value={formatNumber(data.totalRuns)}
              icon={Workflow}
              hint="last 14 days"
              trend={12.4}
            />
            <StatCard
              title="Success rate"
              value={formatPercent(data.successRate)}
              icon={ShieldCheck}
              hint="completed / total"
              trend={1.8}
            />
            <StatCard
              title="Avg. duration"
              value={formatDuration(data.avgDurationMs)}
              icon={Timer}
              hint="per run"
              trend={-6.2}
            />
            <StatCard
              title="Steps executed"
              value={formatNumber(data.totalSteps)}
              icon={ListChecks}
              hint="across all stages"
              trend={9.1}
            />
          </div>

          {isLoading ? (
            <SkeletonTable />
          ) : (
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="border-border/70 shadow-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Execution trend</CardTitle>
                  <CardDescription>
                    Completed and failed runs per day over the last two weeks.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ExecutionTrendChart data={data.daily} />
                </CardContent>
              </Card>

              <Card className="border-border/70 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Provider usage</CardTitle>
                  <CardDescription>Share of runs per AI provider.</CardDescription>
                </CardHeader>
                <CardContent>
                  <ProviderUsageChart data={data.providerUsage} />
                </CardContent>
              </Card>

              <Card className="border-border/70 shadow-sm">
                <CardHeader>
                  <CardTitle className="text-base">Success rate</CardTitle>
                  <CardDescription>Overall completion ratio.</CardDescription>
                </CardHeader>
                <CardContent>
                  <SuccessRateChart rate={data.successRate} />
                </CardContent>
              </Card>

              <Card className="border-border/70 shadow-sm lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Steps executed by stage</CardTitle>
                  <CardDescription>
                    How often each workflow stage has been reached.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <StepsDistributionChart data={data.stepsDistribution} />
                </CardContent>
              </Card>
            </div>
          )}
        </>
      ) : null}
    </div>
  );
}
