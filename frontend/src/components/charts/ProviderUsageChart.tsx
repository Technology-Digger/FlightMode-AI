import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";

import { ChartTooltip } from "@/components/charts/ChartTooltip";
import { getProviderById } from "@/data/providers";
import { formatNumber } from "@/lib/formatters";
import type { ProviderUsageSlice } from "@/types/analytics";

const COLORS = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

export function ProviderUsageChart({ data }: { data: ProviderUsageSlice[] }) {
  const total = data.reduce((sum, slice) => sum + slice.runs, 0);

  return (
    <div>
      <div className="relative">
        <ResponsiveContainer width="100%" height={230}>
          <PieChart>
            <Pie
              data={data}
              dataKey="runs"
              nameKey="providerId"
              innerRadius={62}
              outerRadius={88}
              paddingAngle={3}
              strokeWidth={0}
              cornerRadius={6}
            >
              {data.map((entry, index) => (
                <Cell key={entry.providerId} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              content={
                <ChartTooltip
                  formatter={(value) => `${formatNumber(value)} runs`}
                />
              }
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-semibold tabular-nums tracking-tight">
            {formatNumber(total)}
          </span>
          <span className="text-xs text-muted-foreground">runs</span>
        </div>
      </div>
      <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-2">
        {data.map((slice, index) => {
          const provider = getProviderById(slice.providerId);
          return (
            <li key={slice.providerId} className="flex items-center gap-2 text-xs">
              <span
                className="size-2.5 shrink-0 rounded-[4px]"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              <span className="truncate text-muted-foreground">
                {provider?.name ?? slice.providerId}
              </span>
              <span className="ml-auto font-medium tabular-nums">{slice.percent}%</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
