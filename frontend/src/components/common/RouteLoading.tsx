import { Spinner } from "@/components/ui/spinner";
import { BrandMark } from "@/icons/brand";

/** Branded fallback shown while lazy route chunks load. */
export function RouteLoading({ label = "Loading Flight Mode…" }: { label?: string }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[60vh] w-full flex-col items-center justify-center gap-4"
    >
      <div className="relative">
        <BrandMark className="animate-float size-12" />
        <span className="absolute inset-0 -z-10 rounded-full bg-primary/20 blur-xl" aria-hidden="true" />
      </div>
      <Spinner className="size-4 text-muted-foreground" />
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
