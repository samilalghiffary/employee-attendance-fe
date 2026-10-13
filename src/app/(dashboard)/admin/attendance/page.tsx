"use client";

import { Suspense, useMemo, useState } from "react";

import { AttendanceDeleteDialog } from "@/components/admin";
import type { SelectOption } from "@/components/input";
import { PageHeader } from "@/components/layout";
import {
  useAdminAttendanceOverview,
  useAdminAttendanceSummary,
  useAdminUsers,
  useDeleteAttendance,
} from "@/hooks/use-admin";
import { useUrlParams } from "@/hooks/use-url-params";
import type { AttendanceItem, AttendanceStatus } from "@/types/attendance";
import { DataTable } from "./data-table";
import { AttendanceMetricsGrid } from "./metric-grid";

function AttendanceContent() {
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
  const userId = get("userId");
  const status = get("status") as AttendanceStatus | undefined;

  const { data: summaryData, isLoading: isLoadingSummary } = useAdminAttendanceSummary({
    startDate,
    endDate,
    userId,
  });

  const {
    data: overviewData,
    isLoading: isLoadingOverview,
    isFetching,
    isError,
  } = useAdminAttendanceOverview({
    page,
    limit,
    startDate,
    endDate,
    userId,
    status,
    sortBy,
    sortOrder,
  });

  const { data: usersData } = useAdminUsers({ page: 1, limit: 100 });
  const employeeOptions: SelectOption[] = useMemo(
    () =>
      (usersData?.data ?? []).map((emp) => ({
        value: emp.id,
        label: emp.name,
      })),
    [usersData]
  );

  const { mutate: deleteAttendance, isPending: isDeleting } = useDeleteAttendance();
  const [recordToDelete, setRecordToDelete] = useState<AttendanceItem | null>(null);

  const records = overviewData?.data ?? [];
  const metrics = summaryData?.data;
  const hasFilters = Boolean(startDate || endDate || userId || status);

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Attendance Reports"
        description="Monitor organisation-wide attendance records, punctualities, and aggregates."
      />

      <AttendanceMetricsGrid metrics={metrics} isLoading={isLoadingSummary} />

      <DataTable
        sortBy={sortBy}
        records={records}
        isError={isError}
        sortOrder={sortOrder}
        hasFilters={hasFilters}
        isFetching={isFetching}
        onSortingChange={setSorting}
        onFilterChange={setFilters}
        isLoading={isLoadingOverview}
        employeeOptions={employeeOptions}
        onDeleteRecord={(item) => setRecordToDelete(item)}
        filters={{ userId, status, startDate, endDate, limit }}
        onLimitChange={(lim) => update({ limit: String(lim), page: undefined })}
        pagination={{
          meta: overviewData?.meta,
          itemLabel: "records",
          hrefForPage,
          onPageChange: setPage,
        }}
      />

      <AttendanceDeleteDialog
        record={recordToDelete}
        isDeleting={isDeleting}
        open={Boolean(recordToDelete)}
        onOpenChange={(open) => {
          if (!open) setRecordToDelete(null);
        }}
        onConfirm={() => {
          if (!recordToDelete) return;
          deleteAttendance(recordToDelete.id, {
            onSuccess: () => {
              setRecordToDelete(null);
            },
          });
        }}
      />
    </div>
  );
}

export default function AdminAttendancePage() {
  return (
    <Suspense fallback={null}>
      <AttendanceContent />
    </Suspense>
  );
}
