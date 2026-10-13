"use client";

import { MapPin } from "lucide-react";
import * as React from "react";

import { AttendanceLocationDialog } from "@/components/attendance/attendance-location-dialog";
import { formatTime } from "@/lib/attendance-format";
import { cn } from "@/lib/utils";
import type { AttendanceItem } from "@/types/attendance";

interface TimeLocationCellProps {
  record: AttendanceItem;
  type: "check-in" | "check-out";
  className?: string;
}

export function TimeLocationCell({ record, type, className }: TimeLocationCellProps) {
  const [open, setOpen] = React.useState(false);

  const time = type === "check-in" ? record.checkIn : record.checkOut;
  const lat = type === "check-in" ? record.checkInLat : record.checkOutLat;
  const lng = type === "check-in" ? record.checkInLng : record.checkOutLng;

  const hasCoords = lat != null && lng != null;

  if (!time) {
    return <span className={cn("text-muted-foreground", className)}>-</span>;
  }

  return (
    <>
      <div className={cn("inline-flex items-center gap-1.5", className)}>
        <span className="tabular-nums">{formatTime(time)}</span>
        {hasCoords ? (
          <button
            type="button"
            onClick={() => setOpen(true)}
            title={`View ${type === "check-in" ? "Check In" : "Check Out"} Location Map`}
            className="group/pin p-1 -m-1 rounded-md text-muted-foreground/70 hover:text-foreground hover:bg-muted transition-colors cursor-pointer focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring"
          >
            <MapPin className="size-3 text-muted-foreground group-hover/pin:text-foreground transition-colors" />
            <span className="sr-only">View location</span>
          </button>
        ) : null}
      </div>

      <AttendanceLocationDialog
        open={open}
        record={record}
        initialType={type}
        onOpenChange={setOpen}
      />
    </>
  );
}
