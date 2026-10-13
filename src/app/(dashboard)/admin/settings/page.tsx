"use client";

import { WorkScheduleSettings } from "@/components/admin";
import { PageHeader } from "@/components/layout";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Office & System Settings"
        description="Configure standard office shift schedules, late arrival thresholds, and attendance rules."
      />

      <WorkScheduleSettings />
    </div>
  );
}
