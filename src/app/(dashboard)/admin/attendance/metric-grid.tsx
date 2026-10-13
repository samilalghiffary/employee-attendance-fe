import { AlertTriangle, CheckCircle2, Percent, UserX } from "lucide-react";

import { MetricCard } from "@/components/metric-card";
import type { AttendanceSummaryMetrics } from "@/types/admin";

interface AttendanceMetricsGridProps {
  metrics?: AttendanceSummaryMetrics;
  isLoading?: boolean;
}

export function AttendanceMetricsGrid({
  metrics,
  isLoading = false,
}: AttendanceMetricsGridProps) {
  const cards = [
    {
      id: "summary-present",
      label: "Total Present",
      value: metrics?.totalPresent ?? 0,
      icon: CheckCircle2,
    },
    {
      id: "summary-late",
      label: "Late Arrivals",
      value: metrics?.totalLate ?? 0,
      icon: AlertTriangle,
    },
    {
      id: "summary-absent",
      label: "Absent Records",
      value: metrics?.totalAbsent ?? 0,
      icon: UserX,
    },
    {
      id: "summary-rate",
      label: "Attendance Rate",
      value: metrics?.attendanceRate ?? "0%",
      icon: Percent,
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <MetricCard key={card.id} {...card} isLoading={isLoading} />
      ))}
    </div>
  );
}
