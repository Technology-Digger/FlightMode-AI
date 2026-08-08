import { RadialBar, RadialBarChart, ResponsiveContainer } from "recharts";

import { formatPercent } from "@/lib/formatters";

export function SuccessRateChart({ rate }: { rate: number }) {
  const value = Math.round(rate);
  const data = [{ name: "Success", value, fill: "var(--chart-2)" }];

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={210}>
        <RadialBarChart
          data={data}
          innerRadius="72%"
          outerRadius="100%"
          startAngle={90}
          endAngle={-270}
        >
          <RadialBar
            dataKey="value"
            cornerRadius={14}
            background={{ fill: "var(--muted)" }}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold tabular-nums tracking-tight">
          {formatPercent(value)}
        </span>
        <span className="mt-0.5 text-xs text-muted-foreground">success rate</span>
      </div>
    </div>
  );
}
