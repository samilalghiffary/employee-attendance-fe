"use client";

import { CalendarDays, History } from "lucide-react";
import * as React from "react";

import { DateRangeFilter, PageSizeSelect, TableCard } from "@/components/table";
import {
  DataTable as BaseDataTable,
  type DataTablePaginationConfig,
} from "@/components/ui/data-table";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import type { AttendanceItem, PaginationMeta } from "@/types/attendance";
import type { OnChangeFn, SortingState } from "@tanstack/react-table";
import { historyColumns } from "./columns";

export interface HistoryTableFilters {
  startDate?: string;
  endDate?: string;
  limit: number;
}

export interface HistoryDataTableProps {
  records: AttendanceItem[];
  meta?: PaginationMeta;
  isLoading: boolean;
  isFetching?: boolean;
  isError?: boolean;
  hasFilters?: boolean;
  filters: HistoryTableFilters;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSortingChange?: (field?: string, order?: "asc" | "desc") => void;
  onFilterChange: (filters: { startDate?: string; endDate?: string }) => void;
  onLimitChange: (limit: number) => void;
  pagination?: DataTablePaginationConfig;
}

export function HistoryDataTable({
  records,
  meta: explicitMeta,
  isLoading,
  isFetching = false,
  isError = false,
  hasFilters = false,
  filters,
  sortBy,
  sortOrder,
  onSortingChange,
  onFilterChange,
  onLimitChange,
  pagination,
}: HistoryDataTableProps) {
  const meta = explicitMeta ?? pagination?.meta;
  const emptyState = (
    <Empty className="py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CalendarDays />
        </EmptyMedia>
        <EmptyTitle>{isError ? "Failed to load records" : "No records found"}</EmptyTitle>
        <EmptyDescription>
          {isError
            ? "Something went wrong while fetching your history. Please try again."
            : hasFilters
              ? "No attendance records match the selected date range."
              : "Your attendance records will appear here after your first check-in."}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );

  const sortingState = React.useMemo(() => {
    if (!sortBy) return [];
    return [{ id: sortBy, desc: sortOrder === "desc" }];
  }, [sortBy, sortOrder]);

  const handleSortingChange: OnChangeFn<SortingState> = React.useCallback(
    (updater) => {
      if (!onSortingChange) return;
      const next = typeof updater === "function" ? updater(sortingState) : updater;
      if (!next || next.length === 0) {
        onSortingChange(undefined, undefined);
      } else {
        const item = next[0];
        onSortingChange(item.id, item.desc ? "desc" : "asc");
      }
    },
    [onSortingChange, sortingState]
  );

  return (
    <TableCard
      icon={History}
      title="Records"
      description={
        meta
          ? `${meta.total} records found`
          : "Summary reflects records on the current page."
      }
      filters={
        <>
          <DateRangeFilter
            id="history-date-filter"
            endDate={filters.endDate}
            onChange={onFilterChange}
            startDate={filters.startDate}
          />
          <PageSizeSelect
            value={filters.limit}
            id="history-page-size"
            onChange={onLimitChange}
          />
        </>
      }
    >
      <BaseDataTable
        data={records}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyState={emptyState}
        pagination={pagination}
        columns={historyColumns}
        manualSorting={true}
        sorting={sortingState}
        onSortingChange={handleSortingChange}
      />
    </TableCard>
  );
}

export { HistoryDataTable as DataTable };
