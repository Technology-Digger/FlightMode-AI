import { motion } from "framer-motion";

import { cn } from "@/lib/utils";

/** Animated SVG success checkmark with a stroke draw effect. */
export function SuccessCheck({ className, size = 64 }: { className?: string; size?: number }) {
  return (
    <svg
      viewBox="0 0 52 52"
      className={cn("shrink-0", className)}
      style={{ width: size, height: size }}
      role="img"
      aria-label="Success"
    >
      <motion.circle
        cx="26"
        cy="26"
        r="23"
        fill="none"
        stroke="var(--chart-2)"
        strokeWidth="2.5"
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
      />
      <motion.path
        fill="none"
        stroke="var(--chart-2)"
        strokeWidth="3.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M14.5 26.5l7.5 7.5 15.5-15.5"
        initial={{ pathLength: 0, opacity: 0 }}
        animate={{ pathLength: 1, opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.35, ease: "easeOut" }}
      />
    </svg>
  );
}
