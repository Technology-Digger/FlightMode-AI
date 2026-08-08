import { X } from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface ChipProps {
  label: string;
  icon?: LucideIcon;
  active?: boolean;
  onClick?: () => void;
  onRemove?: () => void;
  className?: string;
  size?: "sm" | "md";
}

/** Small interactive pill used for filters, providers, and keywords. */
export function Chip({ label, icon: Icon, active, onClick, onRemove, className, size = "sm" }: ChipProps) {
  const interactive = Boolean(onClick || onRemove);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border font-medium transition-all duration-200",
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
        active
          ? "border-primary/30 bg-primary/10 text-primary"
          : "border-border bg-background text-muted-foreground",
        interactive && !active && "hover:border-foreground/20 hover:text-foreground",
        className,
      )}
    >
      {Icon && <Icon className={cn("shrink-0", size === "sm" ? "size-3" : "size-3.5")} />}
      {onClick ? (
        <button
          type="button"
          onClick={onClick}
          className="cursor-pointer rounded outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          {label}
        </button>
      ) : (
        <span>{label}</span>
      )}
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${label}`}
          onClick={onRemove}
          className="cursor-pointer rounded-full p-0.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <X className="size-3" />
        </button>
      )}
    </span>
  );
}
