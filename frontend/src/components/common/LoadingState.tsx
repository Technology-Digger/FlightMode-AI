import { Spinner } from "@/components/ui/spinner";
import { cn } from "@/lib/utils";

interface LoadingStateProps {
  label?: string;
  className?: string;
  size?: "sm" | "md" | "lg";
}

/** Centered loading state with spinner and label. */
export function LoadingState({ label = "Loading…", className, size = "md" }: LoadingStateProps) {
  const spinnerSize = size === "lg" ? "size-6" : size === "sm" ? "size-3.5" : "size-4.5";
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn("flex flex-col items-center justify-center gap-3 py-12 text-center", className)}
    >
      <Spinner className={cn(spinnerSize, "text-muted-foreground")} />
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  );
}
