"use client";

import type { ColumnDef, OnChangeFn, SortingState } from "@tanstack/react-table";
import { CalendarDays, FileSpreadsheet } from "lucide-react";
import * as React from "react";

import { ATTENDANCE_STATUSES } from "@/components/attendance/attendance-status-badge";
import { SelectField, type SelectOption } from "@/components/input";
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
import type {
  AttendanceItem,
  AttendanceStatus,
  PaginationMeta,
} from "@/types/attendance";
import { getAttendanceColumns } from "./columns";

const STATUS_OPTIONS: SelectOption[] = ATTENDANCE_STATUSES.map((st) => ({
  value: st,
  label: st,
}));

export interface AttendanceTableFilters {
  userId?: string;
  status?: AttendanceStatus;
  startDate?: string;
  endDate?: string;
  limit: number;
}

export interface AttendanceDataTableProps {
  records: AttendanceItem[];
  meta?: PaginationMeta;
  employeeOptions: SelectOption[];
  filters: AttendanceTableFilters;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSortingChange?: (field?: string, order?: "asc" | "desc") => void;
  onFilterChange: (filters: {
    userId?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
  }) => void;
  onLimitChange: (limit: number) => void;
  isLoading: boolean;
  isFetching?: boolean;
  isError?: boolean;
  hasFilters?: boolean;
  pagination?: DataTablePaginationConfig;
  onDeleteRecord?: (record: AttendanceItem) => void;
}

export function AttendanceDataTable({
  records,
  meta: explicitMeta,
  employeeOptions,
  filters,
  sortBy,
  sortOrder,
  onSortingChange,
  onFilterChange,
  onLimitChange,
  isLoading,
  isFetching = false,
  isError = false,
  hasFilters = false,
  pagination,
  onDeleteRecord,
}: AttendanceDataTableProps) {
  const meta = explicitMeta ?? pagination?.meta;
  const columns = React.useMemo<ColumnDef<AttendanceItem>[]>(
    () => getAttendanceColumns(onDeleteRecord),
    [onDeleteRecord]
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

  const emptyState = (
    <Empty className="py-12">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <CalendarDays />
        </EmptyMedia>
        <EmptyTitle>{isError ? "Failed to load records" : "No records found"}</EmptyTitle>
        <EmptyDescription>
          {isError
            ? "Something went wrong while fetching reports. Please try again."
            : hasFilters
              ? "No attendance records match the selected filters."
              : "No attendance records found in the database."}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );

  return (
    <TableCard
      icon={FileSpreadsheet}
      title="Records Overview"
      headerClassName="lg:flex-row lg:items-center lg:justify-between"
      description={
        meta ? `${meta.total} records found across all staff` : "Loading records…"
      }
      filters={
        <>
          <SelectField
            size="sm"
            value={filters.userId}
            triggerClassName="w-44"
            allLabel="All Employees"
            options={employeeOptions}
            placeholder="All Employees"
            id="attendance-employee-filter"
            onValueChange={(val) => onFilterChange({ userId: val })}
          />

          <SelectField
            size="sm"
            value={filters.status}
            allLabel="All Status"
            triggerClassName="w-32"
            placeholder="All Status"
            options={STATUS_OPTIONS}
            id="attendance-status-filter"
            onValueChange={(val) => onFilterChange({ status: val })}
          />

          <DateRangeFilter
            endDate={filters.endDate}
            startDate={filters.startDate}
            onChange={onFilterChange}
            id="attendance-date-filter"
          />

          <PageSizeSelect
            value={filters.limit}
            id="attendance-page-size"
            onChange={onLimitChange}
          />
        </>
      }
    >
      <BaseDataTable
        data={records}
        columns={columns}
        manualSorting={true}
        isLoading={isLoading}
        sorting={sortingState}
        isFetching={isFetching}
        emptyState={emptyState}
        pagination={pagination}
        onSortingChange={handleSortingChange}
      />
    </TableCard>
  );
}

export { AttendanceDataTable as DataTable };
