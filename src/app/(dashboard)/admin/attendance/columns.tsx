import type { ColumnDef } from "@tanstack/react-table";
import { Trash2 } from "lucide-react";

import { AttendanceStatusBadge } from "@/components/attendance/attendance-status-badge";
import { NotesCell } from "@/components/attendance/notes-cell";
import { TimeLocationCell } from "@/components/attendance/time-location-cell";
import { DataTableColumnHeader } from "@/components/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { formatDate, formatDuration } from "@/lib/attendance-format";
import { getInitials } from "@/lib/utils";
import type { AttendanceItem } from "@/types/attendance";

export function getAttendanceColumns(
  onDeleteRecord?: (record: AttendanceItem) => void
): ColumnDef<AttendanceItem>[] {
  const cols: ColumnDef<AttendanceItem>[] = [
    {
      id: "userName",
      accessorFn: (row) => row.user?.name || "Unknown",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Employee" />,
      cell: ({ row }) => {
        const item = row.original;
        return (
          <div className="flex items-center gap-2.5">
            <Avatar size="sm">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {getInitials(item.user?.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid leading-tight">
              <span className="font-medium">{item.user?.name || "Unknown"}</span>
              <span className="text-xs text-muted-foreground">
                {item.user?.email || item.userId}
              </span>
            </div>
          </div>
        );
      },
    },
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
        <DataTableColumnHeader
          column={column}
          title="Late (min)"
          className="justify-end"
        />
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

  if (onDeleteRecord) {
    cols.push({
      id: "actions",
      header: () => <span className="sr-only">Action</span>,
      meta: {
        headerClassName: "w-16 text-center",
        cellClassName: "text-center",
      },
      cell: ({ row }) => (
        <Button
          size="icon-xs"
          variant="ghost"
          title="Delete attendance record"
          onClick={() => onDeleteRecord(row.original)}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        >
          <Trash2 className="size-3.5" />
          <span className="sr-only">Delete</span>
        </Button>
      ),
    });
  }

  return cols;
}
