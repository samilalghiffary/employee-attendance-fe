"use client";

import { AttendanceMapCard } from "@/components/attendance/attendance-map-card";
import {
  AttendanceActionCard,
  AttendanceOverviewCards,
} from "@/components/attendance/dashboard";
import { PageHeader } from "@/components/layout";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile } from "@/hooks/use-user";
import { useAuthStore } from "@/stores/use-auth-store";

export default function DashboardHomePage() {
  const { user: authUser } = useAuthStore();
  const { data: userProfile, isLoading } = useUserProfile();
  const user = userProfile || authUser;

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        description="Employee attendance and self-service dashboard."
        title={
          isLoading && !user?.name ? (
            <Skeleton className="h-8 w-56 inline-block" />
          ) : (
            `Welcome back, ${user?.name || "Employee"}`
          )
        }
      />

      <div className="grid gap-6 lg:grid-cols-12">
        <AttendanceActionCard className="lg:col-span-7 xl:col-span-8" />

        <div className="hidden lg:flex lg:col-span-5 xl:col-span-4 flex-col">
          <AttendanceMapCard className="h-full" />
        </div>
      </div>

      <AttendanceOverviewCards />
    </div>
  );
}
