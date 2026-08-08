import { useId, type CSSProperties } from "react";

import { cn } from "@/lib/utils";

/**
 * Flight Mode AI brand mark — a paper plane in a sky-to-indigo gradient,
 * evoking effortless, on-autopilot orchestration.
 */
export function BrandMark({ className, style }: { className?: string; style?: CSSProperties }) {
  const gradientId = useId();
  return (
    <svg viewBox="0 0 64 64" style={style} className={cn("shrink-0", className)} aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="56" height="56" rx="16" fill={`url(#${gradientId})`} />
      {/* Paper plane */}
      <path
        d="M52.6 12.4 13.9 27.1c-1.7.7-1.6 2.7.1 3.2l10 3.4 3.4 10c.5 1.7 2.5 1.8 3.2.1L52.6 12.4Z"
        fill="#ffffff"
      />
      <path
        d="M24 33.7 50.8 14.6 27.6 37.5l-3.6-3.8Z"
        fill="#ffffff"
        opacity="0.85"
      />
      <circle cx="47.5" cy="47.5" r="4" fill="#ffffff" opacity="0.92" />
    </svg>
  );
}
