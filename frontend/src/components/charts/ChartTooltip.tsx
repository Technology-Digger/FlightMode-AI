interface TooltipEntry {
  name?: string | number;
  value?: string | number;
  color?: string;
  dataKey?: string | number;
  payload?: Record<string, unknown>;
}

interface ChartTooltipProps {
  active?: boolean;
  payload?: TooltipEntry[];
  label?: string | number;
  formatter?: (value: number, name: string) => string;
}

/** Shared themed tooltip for Recharts. */
export function ChartTooltip({ active, payload, label, formatter }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-lg border border-border/70 bg-popover px-3 py-2 text-xs shadow-xl">
      {label !== undefined && (
        <p className="mb-1.5 font-semibold text-foreground">{label}</p>
      )}
      <div className="grid gap-1">
        {payload.map((entry, index) => (
          <p
            key={`${entry.dataKey ?? entry.name ?? index}`}
            className="flex items-center gap-1.5 text-muted-foreground"
          >
            <span
              className="size-2 shrink-0 rounded-[3px]"
              style={{ backgroundColor: entry.color ?? "var(--chart-1)" }}
            />
            <span>{entry.name}:</span>
            <span className="font-semibold tabular-nums text-foreground">
              {entry.value !== undefined
                ? formatter
                  ? formatter(Number(entry.value), String(entry.name ?? ""))
                  : String(entry.value)
                : "—"}
            </span>
          </p>
        ))}
      </div>
    </div>
  );
}
