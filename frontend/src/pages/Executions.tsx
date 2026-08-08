import { useQuery } from "@tanstack/react-query";
import { Copy, Download, History } from "lucide-react";
import { useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { DataTable, type DataColumn } from "@/components/common/DataTable";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { PageHeader } from "@/components/common/PageHeader";
import { SearchBar } from "@/components/common/SearchBar";
import { Chip } from "@/components/common/Chip";
import { MultiSelect } from "@/components/forms/MultiSelect";
import { ExecutionStatusBadge } from "@/components/automation/ExecutionStatusBadge";
import { ExecutionLog } from "@/components/automation/ExecutionLog";
import { MarkdownViewer } from "@/components/automation/MarkdownViewer";
import { ProviderBadge } from "@/components/automation/ProviderBadge";
import { WorkflowTimeline } from "@/components/automation/WorkflowTimeline";
import { getExecutions } from "@/services/automationService";
import { AI_PROVIDERS } from "@/data/providers";
import { formatDuration, formatRelativeTime, truncate } from "@/lib/formatters";
import type { ExecutionRun, ExecutionStatus } from "@/types/automation";

type StatusFilter = ExecutionStatus | "all";

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "running", label: "Running" },
  { value: "completed", label: "Completed" },
  { value: "failed", label: "Failed" },
  { value: "cancelled", label: "Cancelled" },
];

export default function Executions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data, isLoading, isError, error, refetch } = useQuery({
    queryKey: ["executions"],
    queryFn: getExecutions,
  });

  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [providers, setProviders] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(searchParams.get("run"));
  const [detailOpen, setDetailOpen] = useState(Boolean(searchParams.get("run")));

  const selected = useMemo(
    () => data?.find((run) => run.id === selectedId) ?? null,
    [data, selectedId],
  );

  const filtered = useMemo(() => {
    let list = data ?? [];
    if (statusFilter !== "all") list = list.filter((run) => run.status === statusFilter);
    if (providers.length > 0) list = list.filter((run) => providers.includes(run.providerId));
    if (query) {
      const q = query.toLowerCase();
      list = list.filter((run) => run.task.toLowerCase().includes(q));
    }
    return list;
  }, [data, statusFilter, providers, query]);

  const openDetail = (run: ExecutionRun) => {
    setSelectedId(run.id);
    setDetailOpen(true);
    setSearchParams((params) => {
      const next = new URLSearchParams(params);
      next.set("run", run.id);
      return next;
    });
  };

  const closeDetail = () => {
    setDetailOpen(false);
    setSearchParams((params) => {
      const next = new URLSearchParams(params);
      next.delete("run");
      next.delete("q");
      return next;
    });
  };

  const columns: DataColumn<ExecutionRun>[] = [
    {
      key: "task",
      header: "Task",
      sortValue: (run) => run.task,
      className: "max-w-64",
      render: (run) => (
        <span className="line-clamp-1 text-[13px] font-medium">{truncate(run.task, 64)}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      sortValue: (run) => run.status,
      render: (run) => <ExecutionStatusBadge status={run.status} />,
    },
    {
      key: "provider",
      header: "Provider",
      sortValue: (run) => run.providerId,
      render: (run) => <ProviderBadge providerId={run.providerId} size="sm" />,
    },
    {
      key: "steps",
      header: "Steps",
      sortValue: (run) => run.steps.length,
      render: (run) => (
        <span className="text-xs tabular-nums text-muted-foreground">
          {run.steps.filter((step) => step.status === "completed").length}/{run.steps.length}
        </span>
      ),
    },
    {
      key: "duration",
      header: "Duration",
      sortValue: (run) => run.elapsedMs,
      render: (run) => (
        <span className="text-xs tabular-nums text-muted-foreground">
          {formatDuration(run.elapsedMs)}
        </span>
      ),
    },
    {
      key: "started",
      header: "Started",
      sortValue: (run) => run.startedAt,
      render: (run) => (
        <span className="text-xs text-muted-foreground">{formatRelativeTime(run.startedAt)}</span>
      ),
    },
  ];

  const countBy = (status: StatusFilter) =>
    status === "all" ? (data?.length ?? 0) : data?.filter((run) => run.status === status).length ?? 0;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Executions"
        description="Every automation run, its result, and the full event log."
      >
        <Button variant="outline" size="sm" asChild>
          <Link to="/app/workspace">
            <History className="size-3.5" />
            New automation
          </Link>
        </Button>
      </PageHeader>

      <div className="flex flex-wrap items-center gap-3">
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="Search tasks…"
          className="w-full max-w-sm"
        />
        <MultiSelect
          options={AI_PROVIDERS.map((provider) => ({ value: provider.id, label: provider.name }))}
          value={providers}
          onChange={setProviders}
          buttonLabel="Provider"
        />
        <div className="flex flex-wrap items-center gap-1.5">
          {STATUS_FILTERS.map((filter) => (
            <Chip
              key={filter.value}
              label={`${filter.label}${filter.value === "all" ? "" : ` (${countBy(filter.value)})`}`}
              active={statusFilter === filter.value}
              onClick={() => setStatusFilter(filter.value)}
            />
          ))}
        </div>
      </div>

      {isError ? (
        <ErrorState
          title="Could not load executions"
          description="The execution history failed to load. This demo keeps data in memory — start a run to populate it."
          error={error}
          onRetry={() => void refetch()}
          onHome={() => window.history.back()}
        />
      ) : (
        <DataTable
          columns={columns}
          data={filtered}
          rowKey={(run) => run.id}
          loading={isLoading}
          onRowClick={openDetail}
          emptyTitle={query || statusFilter !== "all" || providers.length > 0 ? "No matching executions" : "No executions yet"}
          emptyDescription={
            query || statusFilter !== "all" || providers.length > 0
              ? "Try adjusting the search or filters."
              : "Run your first automation from the Workspace to see it here."
          }
          initialSort={{ key: "started", direction: "desc" }}
        />
      )}

      <Dialog open={detailOpen} onOpenChange={(open) => !open && closeDetail()}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-3xl">
          {selected ? (
            <>
              <DialogHeader>
                <DialogTitle className="text-base leading-snug">
                  {truncate(selected.task, 80)}
                </DialogTitle>
                <DialogDescription className="flex flex-wrap items-center gap-2 pt-1">
                  <ExecutionStatusBadge status={selected.status} />
                  <span>{formatRelativeTime(selected.startedAt)}</span>
                  <ProviderBadge providerId={selected.providerId} size="sm" />
                  <span>{formatDuration(selected.elapsedMs)}</span>
                  {selected.fallbackUsed && (
                    <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[11px] font-medium text-amber-600 dark:text-amber-400">
                      Fallback used
                    </span>
                  )}
                </DialogDescription>
              </DialogHeader>

              {selected.status === "completed" && selected.result ? (
                <MarkdownViewer content={selected.result.markdown} maxHeight={420} />
              ) : (
                <Card className="border-border/60 p-4 shadow-none">
                  <WorkflowTimeline steps={selected.steps} />
                </Card>
              )}

              <ExecutionLog logs={selected.logs} maxHeight={200} />

              <DialogFooter className="gap-2">
                {selected.result && (
                  <>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        void navigator.clipboard.writeText(selected.result!.markdown);
                        toast.success("Result copied");
                      }}
                    >
                      <Copy className="size-3.5" />
                      Copy result
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const blob = new Blob([selected.result!.markdown], {
                          type: "text/markdown;charset=utf-8",
                        });
                        const url = URL.createObjectURL(blob);
                        const anchor = document.createElement("a");
                        anchor.href = url;
                        anchor.download = `${selected.id}.md`;
                        anchor.click();
                        URL.revokeObjectURL(url);
                      }}
                    >
                      <Download className="size-3.5" />
                      Download
                    </Button>
                  </>
                )}
                <Button type="button" size="sm" onClick={closeDetail}>
                  Close
                </Button>
              </DialogFooter>
            </>
          ) : (
            <EmptyState title="Execution not found" description="This run is no longer available." />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
