import { motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  FileCheck,
  PenLine,
  Play,
  Search,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { Card } from "@/components/ui/card";
import { ProgressBar } from "@/components/common/ProgressBar";
import { cn } from "@/lib/utils";
import { EASE } from "@/animations/variants";

interface Stage {
  label: string;
  icon: LucideIcon;
  state: "done" | "active" | "todo";
}

const STAGES: Stage[] = [
  { label: "Interpret", icon: Sparkles, state: "done" },
  { label: "Research", icon: Search, state: "done" },
  { label: "Draft", icon: PenLine, state: "active" },
  { label: "Validate", icon: ShieldCheck, state: "todo" },
  { label: "Deliver", icon: FileCheck, state: "todo" },
];

function StageNode({ stage }: { stage: Stage }) {
  const Icon = stage.icon;
  return (
    <div className="flex flex-col items-center gap-2">
      <div
        className={cn(
          "relative flex size-10 items-center justify-center rounded-2xl border transition-colors duration-300",
          stage.state === "done" && "border-primary/40 bg-primary/10 text-primary",
          stage.state === "active" &&
            "border-primary bg-primary text-primary-foreground shadow-md shadow-primary/30",
          stage.state === "todo" && "border-border bg-background text-muted-foreground",
        )}
      >
        {stage.state === "active" && (
          <span
            className="absolute inset-0 animate-ping rounded-2xl bg-primary/25"
            style={{ animationDuration: "2.2s" }}
            aria-hidden="true"
          />
        )}
        {stage.state === "done" ? <Check className="size-4" /> : <Icon className="size-4" />}
      </div>
      <span
        className={cn(
          "text-[11px] font-medium",
          stage.state === "todo" && "text-muted-foreground",
        )}
      >
        {stage.label}
      </span>
    </div>
  );
}

function ProviderPill({
  name,
  color,
  active,
  fallback,
}: {
  name: string;
  color: string;
  active?: boolean;
  fallback?: boolean;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium transition-all duration-300",
        active
          ? "border-primary/40 bg-primary/10 text-foreground shadow-sm"
          : fallback
            ? "border-amber-500/40 bg-amber-500/10 text-amber-700 dark:text-amber-400"
            : "border-border/70 bg-background text-muted-foreground",
      )}
    >
      <span className={cn("size-1.5 rounded-full", active ? "animate-pulse-soft bg-primary" : "bg-current opacity-60")} />
      <span className="size-2 rounded-[4px]" style={{ backgroundColor: color }} />
      {name}
    </span>
  );
}

/** Animated pipeline card used in the landing hero. */
export function WorkflowIllustration({ className }: { className?: string }) {
  return (
    <Card
      className={cn(
        "relative overflow-hidden border-border/60 p-5 shadow-2xl shadow-primary/10 sm:p-6",
        className,
      )}
    >
      <div className="pointer-events-none absolute -right-20 -top-24 size-64 rounded-full bg-primary/15 blur-3xl" aria-hidden="true" />
      <div className="pointer-events-none absolute -bottom-28 -left-20 size-64 rounded-full bg-indigo-400/10 blur-3xl" aria-hidden="true" />

      {/* Prompt row */}
      <div className="relative flex items-center gap-2.5 rounded-xl border border-border/70 bg-muted/40 px-3.5 py-2.5">
        <Sparkles className="size-4 shrink-0 text-primary" />
        <p className="truncate text-sm text-muted-foreground">
          &ldquo;Research the market for electric bike subscriptions in Europe…&rdquo;
        </p>
        <span className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-medium text-primary">
          <Play className="size-3 fill-current" />
          In flight
        </span>
      </div>

      {/* Pipeline */}
      <div className="relative mt-6 hidden items-center justify-between sm:flex">
        {STAGES.map((stage, index) => (
          <div key={stage.label} className="flex items-center">
            {index > 0 && (
              <svg className="mx-1.5 h-px w-8 md:mx-2 md:w-12" aria-hidden="true">
                <line
                  x1="0"
                  y1="0.5"
                  x2="100"
                  y2="0.5"
                  stroke="var(--border)"
                  strokeWidth="2"
                  strokeDasharray="4 4"
                />
                <line
                  x1="0"
                  y1="0.5"
                  x2="100"
                  y2="0.5"
                  stroke="var(--primary)"
                  strokeWidth="2"
                  strokeDasharray="26"
                  className="animate-flow"
                  opacity={index <= 2 ? 1 : 0}
                  style={{ strokeDashoffset: 26 }}
                />
              </svg>
            )}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.12, duration: 0.5, ease: EASE }}
            >
              <StageNode stage={stage} />
            </motion.div>
          </div>
        ))}
      </div>

      {/* Mobile pipeline */}
      <div className="mt-5 grid grid-cols-3 gap-3 sm:hidden">
        {STAGES.map((stage) => (
          <StageNode key={stage.label} stage={stage} />
        ))}
      </div>

      {/* Progress */}
      <div className="relative mt-5">
        <div className="mb-1.5 flex items-center justify-between text-[11px]">
          <span className="font-medium text-muted-foreground">Progress</span>
          <span className="font-semibold tabular-nums text-primary">64%</span>
        </div>
        <ProgressBar value={64} size="md" />
      </div>

      {/* Providers */}
      <div className="relative mt-4 flex flex-wrap items-center gap-2">
        <ProviderPill name="GPT-4o" color="#10a37f" active />
        <ArrowRight className="size-3 shrink-0 text-muted-foreground" />
        <ProviderPill name="Claude" color="#d97706" fallback />
        <span className="ml-auto text-[11px] tabular-nums text-muted-foreground">
          12s · 5 steps · 96/100
        </span>
      </div>
    </Card>
  );
}
