import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { ChartTooltip } from "@/components/charts/ChartTooltip";
import type { DailyExecutionPoint } from "@/types/analytics";

export function ExecutionTrendChart({ data }: { data: DailyExecutionPoint[] }) {
  return (
    <ResponsiveContainer width="100%" height={260}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -12, bottom: 0 }}>
        <defs>
          <linearGradient id="trend-completed" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.32} />
            <stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
          tickLine={false}
          axisLine={false}
          width={38}
        />
        <Tooltip content={<ChartTooltip />} cursor={{ stroke: "var(--border)" }} />
        <Area
          type="monotone"
          dataKey="completed"
          name="Completed"
          stroke="var(--chart-1)"
          strokeWidth={2.5}
          fill="url(#trend-completed)"
          activeDot={{ r: 4 }}
        />
        <Area
          type="monotone"
          dataKey="failed"
          name="Failed"
          stroke="var(--chart-4)"
          strokeWidth={1.5}
          strokeDasharray="5 4"
          fill="transparent"
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}
