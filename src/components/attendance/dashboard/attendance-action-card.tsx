"use client";

import { cn } from "@/lib/utils";

import { AttendanceActionModal } from "@/components/attendance/attendance-action-modal";
import { LiveClock } from "@/components/attendance/live-clock";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useTodayAttendance, useWorkSchedule } from "@/hooks/use-attendance";
import { formatTime } from "@/lib/attendance-format";
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  Clock,
  LogIn,
  LogOut,
} from "lucide-react";
import { useMemo, useState } from "react";
import { AttendanceMapCard } from "../attendance-map-card";

interface AttendanceActionCardProps {
  className?: string;
}

export function AttendanceActionCard({ className = "" }: AttendanceActionCardProps) {
  const { data: today, isLoading: isLoadingToday } = useTodayAttendance();
  const { data: scheduleData } = useWorkSchedule();

  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"check-in" | "check-out">("check-in");

  const record = today?.data;
  const schedule = scheduleData?.data;
  const hasCheckedIn = today?.hasCheckedIn ?? false;
  const hasCheckedOut = today?.hasCheckedOut ?? false;

  const earlyMinutes = useMemo(() => {
    if (record?.earlyLeaveMinutes != null && record.earlyLeaveMinutes > 0) {
      return record.earlyLeaveMinutes;
    }
    if (!record?.checkOut || !schedule?.workEndTime) return 0;
    const checkOutDate = new Date(record.checkOut);
    const [endH, endM] = schedule.workEndTime.split(":").map(Number);
    const scheduledEnd = new Date(checkOutDate);
    scheduledEnd.setHours(endH ?? 17, endM ?? 0, 0, 0);

    const diff = Math.floor(
      (scheduledEnd.getTime() - checkOutDate.getTime()) / (1000 * 60)
    );
    return diff > 0 ? diff : 0;
  }, [record?.earlyLeaveMinutes, record?.checkOut, schedule?.workEndTime]);

  const handleOpenCheckIn = () => {
    setModalType("check-in");
    setModalOpen(true);
  };

  const handleOpenCheckOut = () => {
    setModalType("check-out");
    setModalOpen(true);
  };

  return (
    <>
      <Card className={cn("border-border shadow-sm flex flex-col ", className)}>
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="size-4 text-primary shrink-0" />
              <div>
                <CardTitle className="text-sm font-semibold">
                  Daily Attendance Log
                </CardTitle>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Record your work presence accurately with GPS coordinate verification.
                </p>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4 ">
          <div className="block lg:hidden">
            <AttendanceMapCard variant="embedded" />
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-muted/30 border border-border/60">
            <LiveClock />
            <div className="flex flex-col sm:items-end text-xs text-muted-foreground">
              <span className="flex items-center gap-1 font-medium text-foreground">
                <Building2 className="size-3.5 text-primary" /> Office Hours:{" "}
                {schedule?.workStartTime ?? "08:00"} - {schedule?.workEndTime ?? "17:00"}
              </span>
              <span className="mt-0.5">
                Late tolerance: {schedule?.lateToleranceMinutes ?? 15} minutes
              </span>
            </div>
          </div>

          {isLoadingToday ? (
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-24 w-full" />
              <Skeleton className="h-24 w-full" />
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium">
                    <LogIn className="size-3.5 text-emerald-500" /> Check In
                  </span>
                  {record?.lateMinutes ? (
                    <span className="text-destructive font-medium">
                      +{record.lateMinutes}m late
                    </span>
                  ) : null}
                </div>
                <div className="text-2xl font-bold font-mono text-foreground">
                  {formatTime(record?.checkIn)}
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  {record?.checkIn ? "Recorded today" : "Not yet checked in"}
                </p>
              </div>

              <div className="p-4 rounded-lg border border-border/60 bg-muted/20 space-y-1">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1 font-medium">
                    <LogOut className="size-3.5 text-amber-500" /> Check Out
                  </span>
                  {earlyMinutes > 0 ? (
                    <span className="text-amber-500 font-medium">
                      -{earlyMinutes}m early
                    </span>
                  ) : null}
                </div>
                <div className="text-2xl font-bold font-mono text-foreground">
                  {formatTime(record?.checkOut)}
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  {record?.checkOut
                    ? earlyMinutes > 0
                      ? "Departed before scheduled end"
                      : "Shift completed on time"
                    : "Pending checkout"}
                </p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="border-t border-border/60 pt-3 flex flex-col sm:flex-row gap-3 justify-between items-center">
          <div className="text-xs text-muted-foreground flex items-center gap-1">
            {hasCheckedIn && hasCheckedOut ? (
              <span className="text-emerald-500 font-medium flex items-center gap-1">
                <CheckCircle2 className="size-3.5" /> All shifts completed for today
              </span>
            ) : hasCheckedIn ? (
              <span className="text-amber-500 font-medium flex items-center gap-1">
                <Clock className="size-3.5" /> Currently checked in. Remember to check
                out.
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <AlertTriangle className="size-3.5 text-muted-foreground" /> Please check
                in to begin your workday
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {!hasCheckedIn && (
              <Button
                size="default"
                disabled={isLoadingToday}
                onClick={handleOpenCheckIn}
                className="w-full sm:w-auto"
              >
                <LogIn className="mr-2 size-4" /> Check In Now
              </Button>
            )}

            {hasCheckedIn && !hasCheckedOut && (
              <Button
                size="default"
                disabled={isLoadingToday}
                onClick={handleOpenCheckOut}
                className="w-full sm:w-auto"
              >
                <LogOut className="mr-2 size-4" /> Check Out Now
              </Button>
            )}

            {hasCheckedIn && hasCheckedOut && (
              <Button variant="outline" disabled size="default">
                <CheckCircle2 className="mr-2 size-4 text-emerald-500" /> Completed
              </Button>
            )}
          </div>
        </CardFooter>
      </Card>

      <AttendanceActionModal
        type={modalType}
        open={modalOpen}
        schedule={schedule}
        onOpenChange={setModalOpen}
      />
    </>
  );
}
