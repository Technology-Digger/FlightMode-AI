import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

function shimmer(): string {
  return "shimmer-bg rounded-md";
}

/** Skeleton presets so no view ever shows a blank page while loading. */

export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3 rounded-xl border border-border/70 p-5", className)}>
      <Skeleton className={cn(shimmer(), "size-10 rounded-lg")} />
      <Skeleton className={cn(shimmer(), "h-4 w-2/3")} />
      <Skeleton className={cn(shimmer(), "h-3 w-full")} />
      <Skeleton className={cn(shimmer(), "h-3 w-4/5")} />
    </div>
  );
}

export function SkeletonList({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {Array.from({ length: rows }).map((_, index) => (
        <div key={index} className="flex items-center gap-3 rounded-lg border border-border/60 p-3">
          <Skeleton className={cn(shimmer(), "size-9 rounded-md")} />
          <div className="flex-1 space-y-2">
            <Skeleton className={cn(shimmer(), "h-3.5 w-1/2")} />
            <Skeleton className={cn(shimmer(), "h-3 w-3/4")} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonTable({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-2", className)}>
      {Array.from({ length: 6 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-[1fr_110px_90px_110px] gap-4 rounded-lg border border-border/60 px-4 py-3.5"
        >
          <Skeleton className={cn(shimmer(), "h-4")} />
          <Skeleton className={cn(shimmer(), "h-4")} />
          <Skeleton className={cn(shimmer(), "h-4")} />
          <Skeleton className={cn(shimmer(), "h-4")} />
        </div>
      ))}
    </div>
  );
}

export function SkeletonTimeline({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      {Array.from({ length: 5 }).map((_, index) => (
        <div key={index} className="flex items-start gap-3">
          <Skeleton className={cn(shimmer(), "mt-0.5 size-8 rounded-full")} />
          <div className="flex-1 space-y-2">
            <Skeleton className={cn(shimmer(), "h-4 w-1/3")} />
            <Skeleton className={cn(shimmer(), "h-3 w-2/3")} />
          </div>
        </div>
      ))}
    </div>
  );
}

export function SkeletonResult({ className }: { className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <Skeleton className={cn(shimmer(), "h-7 w-3/4")} />
      <Skeleton className={cn(shimmer(), "h-4 w-full")} />
      <Skeleton className={cn(shimmer(), "h-4 w-5/6")} />
      <div className="grid gap-2 sm:grid-cols-3">
        <Skeleton className={cn(shimmer(), "h-20 rounded-lg")} />
        <Skeleton className={cn(shimmer(), "h-20 rounded-lg")} />
        <Skeleton className={cn(shimmer(), "h-20 rounded-lg")} />
      </div>
      <Skeleton className={cn(shimmer(), "h-32 w-full rounded-lg")} />
    </div>
  );
}
