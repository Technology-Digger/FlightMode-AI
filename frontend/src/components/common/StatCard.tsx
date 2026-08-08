import { ArrowDownRight, ArrowUpRight, type LucideIcon } from "lucide-react";
import { motion } from "framer-motion";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { fadeUp } from "@/animations/variants";

interface StatCardProps {
  title: string;
  value: string;
  icon?: LucideIcon;
  hint?: string;
  trend?: number;
  accent?: string;
  className?: string;
}

/** Metric card with icon, optional trend indicator, and hover lift. */
export function StatCard({ title, value, icon: Icon, hint, trend, accent, className }: StatCardProps) {
  const positive = (trend ?? 0) >= 0;
  return (
    <motion.div variants={fadeUp}>
      <Card
        className={cn(
          "group gap-2 border-border/70 p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md sm:p-5",
          className,
        )}
      >
        <div className="flex items-center justify-between">
          <p className="text-[13px] font-medium text-muted-foreground">{title}</p>
          {Icon && (
            <div
              className="flex size-8 items-center justify-center rounded-lg"
              style={{
                backgroundColor: accent ? `${accent}1a` : "color-mix(in oklab, var(--primary) 10%, transparent)",
                color: accent ?? "var(--primary)",
              }}
            >
              <Icon className="size-4" />
            </div>
          )}
        </div>
        <div className="flex items-end justify-between gap-2">
          <p className="text-2xl font-semibold tracking-tight tabular-nums">{value}</p>
          {trend !== undefined && (
            <span
              className={cn(
                "inline-flex items-center gap-0.5 text-xs font-medium",
                positive ? "text-emerald-600 dark:text-emerald-400" : "text-destructive",
              )}
            >
              {positive ? <ArrowUpRight className="size-3.5" /> : <ArrowDownRight className="size-3.5" />}
              {Math.abs(trend)}%
            </span>
          )}
        </div>
        {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
      </Card>
    </motion.div>
  );
}
