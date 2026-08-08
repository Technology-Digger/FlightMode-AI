import { ArrowDown, ArrowUp, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo, useState, type ReactNode } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { EmptyState } from "@/components/common/EmptyState";
import { usePagination } from "@/hooks/use-pagination";
import { cn } from "@/lib/utils";

export interface DataColumn<T> {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
  sortValue?: (row: T) => string | number;
}

interface DataTableProps<T> {
  columns: DataColumn<T>[];
  data: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  emptyTitle?: string;
  emptyDescription?: string;
  onRowClick?: (row: T) => void;
  pageSize?: number;
  className?: string;
  initialSort?: { key: string; direction: "asc" | "desc" };
  footerContent?: ReactNode;
}

/** Generic sortable, paginated data table with loading and empty states. */
export function DataTable<T>({
  columns,
  data,
  rowKey,
  loading,
  emptyTitle = "No results",
  emptyDescription,
  onRowClick,
  pageSize = 8,
  className,
  initialSort,
  footerContent,
}: DataTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(initialSort?.key ?? null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">(
    initialSort?.direction ?? "asc",
  );

  const sorted = useMemo(() => {
    if (!sortKey) return data;
    const column = columns.find((col) => col.key === sortKey);
    if (!column?.sortValue) return data;
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      const av = column.sortValue!(a);
      const bv = column.sortValue!(b);
      const comparison = av < bv ? -1 : av > bv ? 1 : 0;
      return sortDirection === "asc" ? comparison : -comparison;
    });
    return sortedData;
  }, [data, columns, sortKey, sortDirection]);

  const pagination = usePagination<T>({ total: sorted.length, pageSize });
  const pageItems = pagination.slice(sorted);

  const toggleSort = (key: string) => {
    if (sortKey !== key) {
      setSortKey(key);
      setSortDirection("asc");
    } else if (sortDirection === "asc") {
      setSortDirection("desc");
    } else {
      setSortKey(null);
    }
  };

  return (
    <div className={cn("flex flex-col gap-3", className)}>
      <div className="overflow-hidden rounded-xl border border-border/70">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow className="hover:bg-transparent">
              {columns.map((column) => (
                <TableHead key={column.key} className={cn("h-10 px-4", column.className)}>
                  {column.sortValue ? (
                    <button
                      type="button"
                      onClick={() => toggleSort(column.key)}
                      className={cn(
                        "inline-flex cursor-pointer items-center gap-1 rounded text-xs font-semibold uppercase tracking-wide transition-colors hover:text-foreground",
                        sortKey === column.key && "text-foreground",
                      )}
                    >
                      {column.header}
                      {sortKey === column.key ? (
                        sortDirection === "asc" ? (
                          <ArrowUp className="size-3" />
                        ) : (
                          <ArrowDown className="size-3" />
                        )
                      ) : (
                        <ArrowUpDown className="size-3 opacity-50" />
                      )}
                    </button>
                  ) : (
                    column.header
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array.from({ length: 6 }).map((_, rowIndex) => (
                <TableRow key={`skeleton-${rowIndex}`}>
                  {columns.map((column) => (
                    <TableCell key={column.key} className="px-4 py-3">
                      <Skeleton className="h-4 w-full max-w-32" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : pageItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="px-0 py-0">
                  <EmptyState
                    compact
                    title={emptyTitle}
                    description={emptyDescription}
                    className="border-0"
                  />
                </TableCell>
              </TableRow>
            ) : (
              pageItems.map((row) => (
                <TableRow
                  key={rowKey(row)}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(
                    "border-border/60 transition-colors",
                    onRowClick && "cursor-pointer hover:bg-muted/40",
                  )}
                >
                  {columns.map((column) => (
                    <TableCell key={column.key} className={cn("px-4 py-3", column.className)}>
                      {column.render ? column.render(row) : String((row as Record<string, unknown>)[column.key] ?? "")}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {!loading && sorted.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-2 px-1">
          <p className="text-xs text-muted-foreground">
            Showing{" "}
            <span className="font-medium text-foreground">
              {pagination.start + 1}–{pagination.end}
            </span>{" "}
            of {sorted.length}
          </p>
          <div className="flex items-center gap-1">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Previous page"
              disabled={pagination.page <= 1}
              onClick={pagination.previous}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <span className="min-w-12 px-1 text-center text-xs tabular-nums text-muted-foreground">
              {pagination.page} / {pagination.totalPages}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              aria-label="Next page"
              disabled={pagination.page >= pagination.totalPages}
              onClick={pagination.next}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>
      )}
      {footerContent}
    </div>
  );
}
