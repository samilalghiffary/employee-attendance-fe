"use client";

import { Suspense, useMemo } from "react";

import { PageHeader } from "@/components/layout";
import { useMyAttendanceHistory } from "@/hooks/use-attendance";
import { useUrlParams } from "@/hooks/use-url-params";
import { DataTable } from "./data-table";
import { HistoryMetricsGrid } from "./metric-grid";

function HistoryContent() {
  const {
    get,
    page,
    limit,
    sortBy,
    sortOrder,
    update,
    setFilters,
    setSorting,
    setPage,
    hrefForPage,
  } = useUrlParams();
  const startDate = get("startDate");
  const endDate = get("endDate");

  const { data, isLoading, isFetching, isError } = useMyAttendanceHistory({
    page,
    limit,
    startDate,
    endDate,
    sortBy,
    sortOrder,
  });

  const records = useMemo(() => data?.data ?? [], [data]);
  const hasFilters = Boolean(startDate || endDate);

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Attendance History"
        description="Review your past check-ins, check-outs, and attendance status."
      />

      <HistoryMetricsGrid records={records} isLoading={isLoading} />

      <DataTable
        records={records}
        isError={isError}
        isLoading={isLoading}
        isFetching={isFetching}
        hasFilters={hasFilters}
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortingChange={setSorting}
        onFilterChange={setFilters}
        filters={{ startDate, endDate, limit }}
        onLimitChange={(lim) => update({ limit: String(lim), page: undefined })}
        pagination={{
          meta: data?.meta,
          itemLabel: "records",
          hrefForPage,
          onPageChange: setPage,
        }}
      />
    </div>
  );
}

export default function HistoryPage() {
  return (
    <Suspense fallback={null}>
      <HistoryContent />
    </Suspense>
  );
}
