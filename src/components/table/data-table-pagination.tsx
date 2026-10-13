"use client";

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { PaginationMeta } from "@/types/attendance";
import type React from "react";

function getPageList(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const pages: (number | "ellipsis")[] = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  if (start > 2) pages.push("ellipsis");
  for (let p = start; p <= end; p++) pages.push(p);
  if (end < total - 1) pages.push("ellipsis");
  pages.push(total);
  return pages;
}

export interface DataTablePaginationProps {
  meta?: PaginationMeta;
  itemLabel?: string;
  hrefForPage: (page: number) => string;
  onPageChange: (page: number) => void;
}

export function DataTablePagination({
  meta,
  itemLabel = "records",
  hrefForPage,
  onPageChange,
}: DataTablePaginationProps) {
  if (!meta || meta.total === 0) return null;

  const { page, totalPages } = meta;
  const from = (page - 1) * meta.limit + 1;
  const to = Math.min(page * meta.limit, meta.total);

  const go = (e: React.MouseEvent, target: number) => {
    e.preventDefault();
    if (target < 1 || target > totalPages || target === page) return;
    onPageChange(target);
  };

  const disabledClass = "aria-disabled:pointer-events-none aria-disabled:opacity-50";

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <p className="text-xs text-muted-foreground whitespace-nowrap">
        Showing {from}–{to} of {meta.total} {itemLabel}
      </p>
      {totalPages > 1 && (
        <Pagination className="sm:mx-0 sm:w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href={hrefForPage(Math.max(1, page - 1))}
                aria-disabled={page <= 1}
                className={disabledClass}
                onClick={(e) => go(e, page - 1)}
              />
            </PaginationItem>
            {getPageList(page, totalPages).map((p, i) => (
              <PaginationItem key={`${p}-${i}`}>
                {p === "ellipsis" ? (
                  <PaginationEllipsis />
                ) : (
                  <PaginationLink
                    href={hrefForPage(p)}
                    isActive={p === page}
                    onClick={(e) => go(e, p)}
                  >
                    {p}
                  </PaginationLink>
                )}
              </PaginationItem>
            ))}
            <PaginationItem>
              <PaginationNext
                href={hrefForPage(Math.min(totalPages, page + 1))}
                aria-disabled={page >= totalPages}
                className={disabledClass}
                onClick={(e) => go(e, page + 1)}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
