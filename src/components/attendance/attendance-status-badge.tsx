import { cn } from "@/lib/utils";
import type { AttendanceStatus } from "@/types/attendance";

interface StatusConfig {
  label: string;
  className: string;
}

const STATUS_CONFIG: Record<AttendanceStatus, StatusConfig> = {
  PRESENT: {
    label: "Present",
    className:
      "bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/20",
  },
  LATE: {
    label: "Late",
    className: "bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/20",
  },
  ABSENT: {
    label: "Absent",
    className: "bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-500/20",
  },
};

export const ATTENDANCE_STATUSES = Object.keys(STATUS_CONFIG) as AttendanceStatus[];

export function getAttendanceStatusLabel(status: AttendanceStatus) {
  return STATUS_CONFIG[status]?.label ?? status;
}

export function AttendanceStatusBadge({
  status,
  className,
}: {
  status: AttendanceStatus;
  className?: string;
}) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: "bg-muted/60 text-muted-foreground border-border",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center justify-center px-2 py-0.5 rounded-full text-xs font-medium border select-none",
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
