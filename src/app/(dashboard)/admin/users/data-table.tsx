"use client";

import type { ColumnDef, OnChangeFn, SortingState } from "@tanstack/react-table";
import { Search, Users } from "lucide-react";
import * as React from "react";

import { InputField, SelectField, type SelectOption } from "@/components/input";
import { PageSizeSelect, TableCard } from "@/components/table";
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
import type { PaginationMeta } from "@/types/attendance";
import type { UserRole } from "@/types/auth";
import type { UserItem } from "@/types/user";
import { getUsersColumns } from "./columns";

export const ROLE_OPTIONS: SelectOption[] = [
  { value: "ADMIN", label: "Administrator" },
  { value: "EMPLOYEE", label: "Employee" },
];

export const STATUS_OPTIONS: SelectOption[] = [
  { value: "true", label: "Active" },
  { value: "false", label: "Inactive" },
];

export interface UsersTableFilters {
  search: string;
  role?: UserRole;
  isActiveParam?: string;
  limit: number;
}

export interface UsersDataTableProps {
  users: UserItem[];
  meta?: PaginationMeta;
  isLoading: boolean;
  isFetching?: boolean;
  isError?: boolean;
  hasFilters?: boolean;
  currentUserId?: string;
  filters: UsersTableFilters;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  onSortingChange?: (field?: string, order?: "asc" | "desc") => void;
  onSearchChange: (value: string) => void;
  onFilterChange: (filters: { role?: string; isActive?: string }) => void;
  onLimitChange: (limit: number) => void;
  onEditUser: (user: UserItem) => void;
  onToggleStatus: (user: UserItem) => void;
  pagination?: DataTablePaginationConfig;
}

export function UsersDataTable({
  users,
  meta: explicitMeta,
  isLoading,
  isFetching = false,
  isError = false,
  hasFilters = false,
  currentUserId,
  filters,
  sortBy,
  sortOrder,
  onSortingChange,
  onSearchChange,
  onFilterChange,
  onLimitChange,
  onEditUser,
  onToggleStatus,
  pagination,
}: UsersDataTableProps) {
  const meta = explicitMeta ?? pagination?.meta;
  const columns = React.useMemo<ColumnDef<UserItem>[]>(
    () =>
      getUsersColumns({
        currentUserId,
        onEdit: onEditUser,
        onToggleStatus,
      }),
    [currentUserId, onEditUser, onToggleStatus]
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
          <Users />
        </EmptyMedia>
        <EmptyTitle>
          {isError ? "Failed to load accounts" : "No accounts found"}
        </EmptyTitle>
        <EmptyDescription>
          {isError
            ? "Something went wrong while fetching accounts. Please try again."
            : hasFilters
              ? "No accounts match the current filters."
              : "Add your first employee to get started."}
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );

  return (
    <TableCard
      icon={Users}
      title="Accounts"
      headerClassName="lg:flex-row lg:items-center lg:justify-between"
      description={meta ? `${meta.total} accounts registered` : "Loading accounts…"}
      filters={
        <>
          <InputField
            id="employee-search"
            icon={Search}
            value={filters.search}
            className="w-56"
            placeholder="Search name or email…"
            onChange={(e) => onSearchChange(e.target.value)}
          />

          <SelectField
            size="sm"
            value={filters.role}
            allLabel="All roles"
            placeholder="All roles"
            options={ROLE_OPTIONS}
            id="employee-role-filter"
            onValueChange={(v) => onFilterChange({ role: v })}
          />

          <SelectField
            size="sm"
            value={filters.isActiveParam}
            allLabel="All status"
            placeholder="All status"
            options={STATUS_OPTIONS}
            id="employee-status-filter"
            onValueChange={(v) => onFilterChange({ isActive: v })}
          />

          <PageSizeSelect
            id="employee-page-size"
            value={filters.limit}
            onChange={onLimitChange}
          />
        </>
      }
    >
      <BaseDataTable
        data={users}
        columns={columns}
        isLoading={isLoading}
        isFetching={isFetching}
        emptyState={emptyState}
        pagination={pagination}
        manualSorting={true}
        sorting={sortingState}
        onSortingChange={handleSortingChange}
      />
    </TableCard>
  );
}

export { UsersDataTable as DataTable };
