import { AlertTriangle, CheckCircle2, ClockAlert, Timer, XCircle } from "lucide-react";

import { MetricCard } from "@/components/metric-card";
import type { MyAttendanceSummaryData } from "@/types/attendance";

interface HistoryMetricsGridProps {
  summary?: MyAttendanceSummaryData;
  isLoading?: boolean;
}

export function HistoryMetricsGrid({
  summary,
  isLoading = false,
}: HistoryMetricsGridProps) {
  const cards = [
    {
      id: "summary-present",
      label: "Present",
      value: summary?.present ?? 0,
      icon: CheckCircle2,
    },
    {
      id: "summary-late",
      label: "Late",
      value: summary?.late ?? 0,
      icon: AlertTriangle,
    },
    {
      id: "summary-absent",
      label: "Absent",
      value: summary?.absent ?? 0,
      icon: XCircle,
    },
    {
      id: "summary-late-minutes",
      label: "Late Minutes",
      value: summary?.lateMinutes ?? 0,
      icon: Timer,
    },
    {
      id: "summary-early-minutes",
      label: "Early Leave Min",
      value: summary?.earlyLeaveMinutes ?? 0,
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
