"use client";

import type { ColumnDef } from "@tanstack/react-table";

import { AttendanceStatusBadge } from "@/components/attendance/attendance-status-badge";
import { NotesCell } from "@/components/attendance/notes-cell";
import { TimeLocationCell } from "@/components/attendance/time-location-cell";
import { DataTableColumnHeader } from "@/components/table";
import { formatDate, formatDuration } from "@/lib/attendance-format";
import type { AttendanceItem } from "@/types/attendance";

export const historyColumns: ColumnDef<AttendanceItem>[] = [
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    meta: { cellClassName: "font-medium whitespace-nowrap" },
    cell: ({ getValue }) => formatDate(getValue<string>()),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ getValue }) => (
      <AttendanceStatusBadge status={getValue<AttendanceItem["status"]>()} />
    ),
  },
  {
    accessorKey: "checkIn",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Check In" />,
    cell: ({ row }) => <TimeLocationCell record={row.original} type="check-in" />,
  },
  {
    accessorKey: "checkOut",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Check Out" />,
    cell: ({ row }) => <TimeLocationCell record={row.original} type="check-out" />,
  },
  {
    id: "duration",
    header: "Duration",
    meta: { cellClassName: "tabular-nums" },
    cell: ({ row }) => formatDuration(row.original),
  },
  {
    accessorKey: "lateMinutes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Late (min)" className="justify-end" />
    ),
    meta: {
      headerClassName: "text-right",
      cellClassName: "text-right tabular-nums",
    },
    cell: ({ getValue }) => {
      const late = getValue<number>();
      return late > 0 ? (
        <span className="font-medium text-amber-600 dark:text-amber-400">{late}</span>
      ) : (
        "-"
      );
    },
  },
  {
    accessorKey: "earlyLeaveMinutes",
    header: ({ column }) => (
      <DataTableColumnHeader
        column={column}
        title="Early (min)"
        className="justify-end"
      />
    ),
    meta: {
      headerClassName: "text-right",
      cellClassName: "text-right tabular-nums",
    },
    cell: ({ getValue }) => {
      const early = getValue<number>();
      return early > 0 ? (
        <span className="font-medium text-amber-600 dark:text-amber-400">{early}</span>
      ) : (
        "-"
      );
    },
  },
  {
    accessorKey: "notes",
    header: "Notes",
    cell: ({ getValue }) => <NotesCell notes={getValue<string | null>()} />,
  },
];
