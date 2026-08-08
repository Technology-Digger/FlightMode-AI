import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { EASE } from "@/animations/variants";

interface ProgressBarProps {
  value: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  color?: string;
  className?: string;
  trackClassName?: string;
}

/** Animated progress bar used across execution and stat views. */
export function ProgressBar({
  value,
  max = 100,
  size = "md",
  color,
  className,
  trackClassName,
}: ProgressBarProps) {
  const percent = Math.min(100, Math.max(0, (value / max) * 100));
  const heights = { sm: "h-1", md: "h-1.5", lg: "h-2.5" } as const;

  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(percent)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn(
        "w-full overflow-hidden rounded-full bg-muted",
        heights[size],
        trackClassName,
        className,
      )}
    >
      <motion.div
        className="h-full rounded-full"
        style={
          color
            ? { backgroundColor: color }
            : { backgroundColor: "var(--primary)" }
        }
        initial={false}
        animate={{ width: `${percent}%` }}
        transition={{ duration: 0.5, ease: EASE }}
      />
    </div>
  );
}
