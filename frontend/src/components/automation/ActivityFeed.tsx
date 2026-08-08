import { AnimatePresence, motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";

import { EmptyState } from "@/components/common/EmptyState";
import { formatRelativeTime } from "@/lib/formatters";
import { cn } from "@/lib/utils";
import type { Tone } from "@/utils/status";

export interface ActivityItem {
  id: string;
  title: string;
  description?: string;
  tone: Tone;
  icon?: LucideIcon;
  timestamp: number;
}

const TONE_CLASSES: Record<Tone, string> = {
  success: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  error: "bg-destructive/10 text-destructive",
  warning: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  info: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
  running: "bg-primary/10 text-primary",
  neutral: "bg-muted text-muted-foreground",
};

interface ActivityFeedProps {
  items: ActivityItem[];
  className?: string;
  emptyTitle?: string;
  emptyDescription?: string;
}

/** Live activity feed with entrance animations. */
export function ActivityFeed({
  items,
  className,
  emptyTitle = "No activity yet",
  emptyDescription = "Run an automation to see live events here.",
}: ActivityFeedProps) {
  if (items.length === 0) {
    return (
      <EmptyState compact icon={undefined} title={emptyTitle} description={emptyDescription} className="min-h-40" />
    );
  }

  return (
    <ul className={cn("flex flex-col gap-2.5", className)} aria-label="Activity feed">
      <AnimatePresence initial={false}>
        {items.slice(0, 12).map((item) => {
          const Icon = item.icon;
          return (
            <motion.li
              key={item.id}
              layout
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-3 rounded-xl border border-border/60 bg-background p-3 shadow-sm"
            >
              <span
                className={cn(
                  "flex size-8 shrink-0 items-center justify-center rounded-lg",
                  TONE_CLASSES[item.tone],
                )}
              >
                {Icon ? <Icon className="size-4" /> : <span className="size-2 rounded-full bg-current" />}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[13px] font-medium leading-snug">{item.title}</p>
                {item.description && (
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {item.description}
                  </p>
                )}
                <p className="mt-1 text-[11px] text-muted-foreground/70">
                  {formatRelativeTime(item.timestamp)}
                </p>
              </div>
            </motion.li>
          );
        })}
      </AnimatePresence>
    </ul>
  );
}
