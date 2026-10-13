"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { useUpdateWorkSchedule } from "@/hooks/use-admin";
import { useWorkSchedule } from "@/hooks/use-attendance";
import { workScheduleSchema, type WorkScheduleFormData } from "@/lib/validations/admin";
import { getDefaultValues } from "@/lib/validations/defaults";
import { PolicySummarySidebar } from "./policy-summary-sidebar";
import { ScheduleFormCard } from "./schedule-form-card";

export function WorkScheduleSettings() {
  const { data: scheduleData, isLoading: isLoadingSchedule } = useWorkSchedule();
  const updateSchedule = useUpdateWorkSchedule();

  const form = useForm<WorkScheduleFormData>({
    resolver: zodResolver(workScheduleSchema),
    defaultValues: getDefaultValues(workScheduleSchema, {
      workStartTime: "08:00",
      workEndTime: "17:00",
      lateToleranceMinutes: 15,
    }),
  });

  const watchedStartTime =
    useWatch({ control: form.control, name: "workStartTime" }) || "08:00";
  const watchedEndTime =
    useWatch({ control: form.control, name: "workEndTime" }) || "17:00";
  const watchedTolerance =
    useWatch({ control: form.control, name: "lateToleranceMinutes" }) || 15;

  useEffect(() => {
    if (scheduleData?.data) {
      form.reset({
        workStartTime: scheduleData.data.workStartTime,
        workEndTime: scheduleData.data.workEndTime,
        lateToleranceMinutes: scheduleData.data.lateToleranceMinutes,
      });
    }
  }, [scheduleData, form]);

  const handleReset = () => {
    if (scheduleData?.data) {
      form.reset({
        workStartTime: scheduleData.data.workStartTime,
        workEndTime: scheduleData.data.workEndTime,
        lateToleranceMinutes: scheduleData.data.lateToleranceMinutes,
      });
    }
  };

  const onSubmit = async (values: WorkScheduleFormData) => {
    try {
      await updateSchedule.mutateAsync(values);
      form.reset(values);
    } catch {}
  };

  const calculateWorkDuration = () => {
    try {
      const [startH, startM] = watchedStartTime.split(":").map(Number);
      const [endH, endM] = watchedEndTime.split(":").map(Number);
      if (!isNaN(startH) && !isNaN(endH)) {
        const diffMinutes = endH * 60 + endM - (startH * 60 + startM);
        if (diffMinutes > 0) {
          const hours = Math.floor(diffMinutes / 60);
          const minutes = diffMinutes % 60;
          return minutes > 0 ? `${hours} hrs ${minutes} mins` : `${hours} hours`;
        }
      }
    } catch {}
    return "9 hours";
  };

  return (
    <div className="grid gap-6 lg:grid-cols-12 items-start">
      <ScheduleFormCard
        form={form}
        onReset={handleReset}
        isLoading={isLoadingSchedule}
        watchedStartTime={watchedStartTime}
        watchedTolerance={watchedTolerance}
        isPending={updateSchedule.isPending}
        onSubmit={form.handleSubmit(onSubmit)}
      />

      <PolicySummarySidebar
        endTime={watchedEndTime}
        startTime={watchedStartTime}
        isLoading={isLoadingSchedule}
        duration={calculateWorkDuration()}
        toleranceMinutes={watchedTolerance}
      />
    </div>
  );
}
