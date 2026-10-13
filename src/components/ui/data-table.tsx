"use client";

import {
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type RowData,
  type SortingState,
  type Table as TanStackTable,
} from "@tanstack/react-table";
import * as React from "react";

import { DataTablePagination } from "@/components/table";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PaginationMeta } from "@/types/attendance";

declare module "@tanstack/react-table" {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData extends RowData, TValue> {
    headerClassName?: string;
    cellClassName?: string;
  }
}

export interface DataTablePaginationConfig {
  meta?: PaginationMeta;
  itemLabel?: string;
  hrefForPage?: (page: number) => string;
  onPageChange?: (page: number) => void;
}

export interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isLoading?: boolean;
  isFetching?: boolean;
  emptyState?: React.ReactNode;
  pagination?: DataTablePaginationConfig;
  renderTableToolbar?: (table: TanStackTable<TData>) => React.ReactNode;
  sorting?: SortingState;
  onSortingChange?: (
    updater: SortingState | ((old: SortingState) => SortingState)
  ) => void;
  manualSorting?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isLoading = false,
  isFetching = false,
  emptyState,
  pagination,
  renderTableToolbar,
  sorting: externalSorting,
  onSortingChange: externalOnSortingChange,
  manualSorting = false,
}: DataTableProps<TData, TValue>) {
  const [internalSorting, setInternalSorting] = React.useState<SortingState>([]);

  const sorting = externalSorting !== undefined ? externalSorting : internalSorting;
  const onSortingChange = externalOnSortingChange || setInternalSorting;

  // eslint-disable-next-line react-hooks/incompatible-library
  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
    },
    manualSorting,
    onSortingChange,
    getCoreRowModel: getCoreRowModel(),
    ...(manualSorting ? {} : { getSortedRowModel: getSortedRowModel() }),
  });

  return (
    <div className="space-y-4">
      {renderTableToolbar?.(table)}

      <div
        className="rounded-md border border-border overflow-x-auto transition-opacity data-[fetching=true]:opacity-60"
        data-fetching={isFetching && !isLoading}
      >
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className={header.column.columnDef.meta?.headerClassName}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skeleton-${i}`}>
                  {Array.from({ length: columns.length }).map((__, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={cell.column.columnDef.meta?.cellClassName}
                    >
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="p-0 border-0">
                  {emptyState}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {pagination?.meta && pagination.onPageChange && (
        <DataTablePagination
          meta={pagination.meta}
          itemLabel={pagination.itemLabel}
          onPageChange={pagination.onPageChange}
          hrefForPage={pagination.hrefForPage ?? ((p) => `?page=${p}`)}
        />
      )}
    </div>
  );
}
