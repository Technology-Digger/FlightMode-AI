import { useCallback, useMemo, useState } from "react";
import { clamp } from "@/lib/formatters";

export interface Pagination<T> {
  page: number;
  pageSize: number;
  totalPages: number;
  start: number;
  end: number;
  setPage: (page: number) => void;
  next: () => void;
  previous: () => void;
  slice: (items: T[]) => T[];
  range: () => number[];
}

export function usePagination<T>({
  total,
  pageSize = 8,
  initialPage = 1,
}: {
  total: number;
  pageSize?: number;
  initialPage?: number;
}): Pagination<T> {
  const [rawPage, setRawPage] = useState(initialPage);
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const page = clamp(rawPage, 1, totalPages);

  const setPage = useCallback(
    (next: number) => setRawPage(clamp(next, 1, Math.max(1, Math.ceil(total / pageSize)))),
    [total, pageSize],
  );

  const start = (page - 1) * pageSize;
  const end = Math.min(start + pageSize, total);

  const slice = useCallback(
    (items: T[]) => items.slice(start, end),
    [start, end],
  );

  const range = useCallback((): number[] => {
    const pages: number[] = [];
    for (let i = 1; i <= totalPages; i += 1) pages.push(i);
    return pages;
  }, [totalPages]);

  return useMemo(
    () => ({
      page,
      pageSize,
      totalPages,
      start,
      end,
      setPage,
      next: () => setPage(page + 1),
      previous: () => setPage(page - 1),
      slice,
      range,
    }),
    [page, pageSize, totalPages, start, end, setPage, slice, range],
  );
}
