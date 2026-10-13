import { AlertTriangle, CheckCircle2, ClockAlert, Timer, XCircle } from "lucide-react";
import * as React from "react";

import { MetricCard } from "@/components/metric-card";
import type { AttendanceItem } from "@/types/attendance";

interface HistoryMetricsGridProps {
  records: AttendanceItem[];
  isLoading?: boolean;
}

export function HistoryMetricsGrid({
  records,
  isLoading = false,
}: HistoryMetricsGridProps) {
  const summary = React.useMemo(
    () => ({
      present: records.filter((r) => r.status === "PRESENT").length,
      late: records.filter((r) => r.status === "LATE").length,
      absent: records.filter((r) => r.status === "ABSENT").length,
      lateMinutes: records.reduce((acc, r) => acc + (r.lateMinutes || 0), 0),
      earlyLeaveMinutes: records.reduce((acc, r) => acc + (r.earlyLeaveMinutes || 0), 0),
    }),
    [records]
  );

  const cards = [
    {
      id: "summary-present",
      label: "Present",
      value: summary.present,
      icon: CheckCircle2,
    },
    {
      id: "summary-late",
      label: "Late",
      value: summary.late,
      icon: AlertTriangle,
    },
    {
      id: "summary-absent",
      label: "Absent",
      value: summary.absent,
      icon: XCircle,
    },
    {
      id: "summary-late-minutes",
      label: "Late Minutes",
      value: summary.lateMinutes,
      icon: Timer,
    },
    {
      id: "summary-early-minutes",
      label: "Early Leave Min",
      value: summary.earlyLeaveMinutes,
      icon: ClockAlert,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
      {cards.map((card) => (
        <MetricCard key={card.id} {...card} isLoading={isLoading} />
      ))}
    </div>
  );
}
