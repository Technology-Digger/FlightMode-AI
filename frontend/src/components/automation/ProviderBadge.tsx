import { getProviderById } from "@/data/providers";
import { cn } from "@/lib/utils";

interface ProviderBadgeProps {
  providerId?: string | null;
  size?: "sm" | "md";
  showStatus?: boolean;
  fallback?: boolean;
  className?: string;
}

/** Compact badge showing an AI provider icon, name, and optional status. */
export function ProviderBadge({
  providerId,
  size = "sm",
  showStatus,
  fallback,
  className,
}: ProviderBadgeProps) {
  const provider = getProviderById(providerId);

  if (!provider) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-muted/50 px-2 py-0.5 font-medium text-muted-foreground",
          size === "md" && "px-2.5 py-1 text-sm",
          className,
        )}
      >
        Auto route
      </span>
    );
  }

  const Icon = provider.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2 py-0.5 font-medium",
        size === "md" && "px-2.5 py-1 text-sm",
        fallback
          ? "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400"
          : "border-border/70 bg-muted/50 text-foreground",
        className,
      )}
    >
      <Icon className={cn("shrink-0", size === "md" ? "size-3.5" : "size-3")} style={{ color: provider.color }} />
      <span className="truncate">{provider.name}</span>
      {fallback && <span className="text-[10px] font-semibold uppercase tracking-wide opacity-70">fallback</span>}
      {showStatus && (
        <span
          aria-label={provider.status}
          className={cn(
            "size-1.5 rounded-full",
            provider.status === "operational"
              ? "bg-emerald-500"
              : provider.status === "degraded"
                ? "bg-amber-500"
                : "bg-destructive",
          )}
        />
      )}
    </span>
  );
}
