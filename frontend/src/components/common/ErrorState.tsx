import { AlertTriangle, ChevronDown, Home, RefreshCw, Send } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { formatError } from "@/utils/errors";

interface ErrorStateProps {
  title?: string;
  description?: string;
  error?: unknown;
  onRetry?: () => void;
  onReport?: () => void;
  onHome?: () => void;
  className?: string;
  compact?: boolean;
}

/** Professional error state with retry / details / report actions. */
export function ErrorState({
  title = "Something went wrong",
  description = "The workflow hit an unexpected error. The details below can help you diagnose it.",
  error,
  onRetry,
  onReport,
  onHome,
  className,
  compact,
}: ErrorStateProps) {
  const [open, setOpen] = useState(false);
  const message = error ? formatError(error) : "";

  const handleReport = () => {
    if (onReport) {
      onReport();
    } else {
      toast.info("Issue reported", {
        description: "This demo records the report locally. Wire it to your gateway to send real diagnostics.",
      });
    }
  };

  return (
    <Alert
      variant="destructive"
      className={cn("gap-3 p-5 shadow-sm sm:p-6", compact && "p-4", className)}
    >
      <AlertTriangle className="size-5 shrink-0" />
      <div className="min-w-0 flex-1">
        <AlertTitle className="text-base">{title}</AlertTitle>
        <AlertDescription className="mt-1.5 max-w-xl leading-relaxed">
          {description}
        </AlertDescription>

        {message && (
          <Collapsible open={open} onOpenChange={setOpen} className="mt-3">
            <CollapsibleTrigger asChild>
              <Button type="button" variant="outline" size="sm" className="cursor-pointer">
                <ChevronDown
                  className={cn("size-3.5 transition-transform", open && "rotate-180")}
                />
                View details
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent className="mt-2">
              <pre className="max-h-48 overflow-auto rounded-lg border border-destructive/20 bg-destructive/5 p-3 font-mono text-xs leading-relaxed text-foreground">
                {message}
              </pre>
            </CollapsibleContent>
          </Collapsible>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2">
          {onRetry && (
            <Button type="button" size="sm" onClick={onRetry}>
              <RefreshCw className="size-3.5" />
              Retry
            </Button>
          )}
          <Button type="button" variant="outline" size="sm" onClick={handleReport}>
            <Send className="size-3.5" />
            Report issue
          </Button>
          {onHome && (
            <Button type="button" variant="ghost" size="sm" onClick={onHome}>
              <Home className="size-3.5" />
              Return home
            </Button>
          )}
        </div>
      </div>
    </Alert>
  );
}
