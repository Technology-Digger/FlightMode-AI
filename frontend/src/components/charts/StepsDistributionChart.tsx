import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartTooltip } from "@/components/charts/ChartTooltip";
import { formatNumber } from "@/lib/formatters";
import type { StepDistributionPoint } from "@/types/analytics";

export function StepsDistributionChart({ data }: { data: StepDistributionPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={230}>
      <BarChart
        data={data}
        layout="vertical"
        margin={{ top: 4, right: 16, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" horizontal={false} />
        <XAxis type="number" hide />
        <YAxis
          type="category"
          dataKey="label"
          width={76}
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip
          cursor={{ fill: "color-mix(in oklab, var(--muted) 50%, transparent)" }}
          content={<ChartTooltip formatter={(value) => `${formatNumber(value)} steps`} />}
        />
        <Bar
          dataKey="count"
          name="Steps"
          fill="var(--chart-3)"
          radius={[0, 8, 8, 0]}
          barSize={16}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
