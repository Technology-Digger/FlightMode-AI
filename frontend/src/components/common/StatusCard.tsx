import {
  Circle,
  CircleCheck,
  CircleX,
  Info,
  Loader2,
  TriangleAlert,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import type { Tone } from "@/utils/status";
import { cn } from "@/lib/utils";

const TONE_META: Record<
  Tone,
  { icon: LucideIcon; text: string; chip: string; bg: string; spin?: boolean }
> = {
  success: {
    icon: CircleCheck,
    text: "text-emerald-600 dark:text-emerald-400",
    chip: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
    bg: "bg-emerald-500/10",
  },
  error: {
    icon: CircleX,
    text: "text-destructive",
    chip: "bg-destructive/10 text-destructive",
    bg: "bg-destructive/10",
  },
  warning: {
    icon: TriangleAlert,
    text: "text-amber-600 dark:text-amber-400",
    chip: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    bg: "bg-amber-500/10",
  },
  info: {
    icon: Info,
    text: "text-sky-600 dark:text-sky-400",
    chip: "bg-sky-500/10 text-sky-600 dark:text-sky-400",
    bg: "bg-sky-500/10",
  },
  running: {
    icon: Loader2,
    text: "text-primary",
    chip: "bg-primary/10 text-primary",
    bg: "bg-primary/10",
    spin: true,
  },
  neutral: {
    icon: Circle,
    text: "text-muted-foreground",
    chip: "bg-muted text-muted-foreground",
    bg: "bg-muted",
  },
};

interface StatusCardProps {
  tone: Tone;
  title: string;
  description?: string;
  icon?: LucideIcon;
  className?: string;
}

/** Status card with tone-aware icon and colors. */
export function StatusCard({ tone, title, description, icon: Icon, className }: StatusCardProps) {
  const meta = TONE_META[tone];
  const IconComp = Icon ?? meta.icon;
  return (
    <Card className={cn("gap-3 border-border/70 p-4 shadow-sm sm:p-5", className)}>
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            meta.bg,
            meta.text,
          )}
        >
          <IconComp className={cn("size-4.5", meta.spin && "animate-spin")} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-semibold">{title}</p>
          {description && (
            <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{description}</p>
          )}
        </div>
      </div>
    </Card>
  );
}

export { TONE_META };
