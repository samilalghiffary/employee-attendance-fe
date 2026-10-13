import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useMyAttendanceHistory, useWorkSchedule } from "@/hooks/use-attendance";
import { ArrowRight, Calendar, TrendingUp } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

export function AttendanceOverviewCards() {
  const { data: scheduleData } = useWorkSchedule();
  const schedule = scheduleData?.data;

  const { data: historyData, isLoading } = useMyAttendanceHistory({
    page: 1,
    limit: 30,
  });

  const records = useMemo(() => historyData?.data ?? [], [historyData]);

  const stats = useMemo(() => {
    const total = records.length;
    const present = records.filter((r) => r.status === "PRESENT").length;
    const late = records.filter((r) => r.status === "LATE").length;
    const absent = records.filter((r) => r.status === "ABSENT").length;
    const onTimeRate = total > 0 ? Math.round((present / total) * 100) : 100;
    return { total, present, late, absent, onTimeRate };
  }, [records]);

  const currentMonthName = useMemo(() => {
    return new Date().toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  }, []);

  return (
    <div className="grid gap-6 md:grid-cols-2">
      <Card className="border-border shadow-sm flex flex-col justify-between">
        <div>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-primary" />
              <CardTitle className="text-sm font-semibold">
                Work Policy & Schedule
              </CardTitle>
            </div>
            <Badge variant="outline" className="text-[11px] font-mono">
              Standard Shift
            </Badge>
          </CardHeader>

          <CardContent className="space-y-2.5 text-xs">
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Office Shift Hours</span>
              <span className="font-semibold text-foreground font-mono">
                {schedule?.workStartTime ?? "08:00"} - {schedule?.workEndTime ?? "17:00"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Check-in Window</span>
              <span className="font-semibold text-foreground">
                Opens at {schedule?.workStartTime ?? "08:00"}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-border/40">
              <span className="text-muted-foreground">Late Tolerance</span>
              <span className="font-semibold text-foreground">
                {schedule?.lateToleranceMinutes ?? 15} minutes grace period
              </span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Location Verification</span>
              <span className="font-semibold text-foreground">GPS Required</span>
            </div>
          </CardContent>
        </div>
      </Card>

      <Card className="border-border shadow-sm flex flex-col justify-between">
        <div>
          <CardHeader className="flex flex-row items-center justify-between pb-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="size-4 text-primary" />
              <div>
                <CardTitle className="text-sm font-semibold">
                  Monthly Attendance Summary
                </CardTitle>
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Period: {currentMonthName}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <Link href="/history">
                <Button
                  size="xs"
                  variant="ghost"
                  className="text-xs gap-1 text-primary hover:text-primary cursor-pointer"
                >
                  View Log <ArrowRight className="size-3" />
                </Button>
              </Link>
            </div>
          </CardHeader>

          <CardContent className="space-y-4">
            {isLoading ? (
              <div className="grid grid-cols-3 gap-3">
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
                <Skeleton className="h-16 w-full rounded-lg" />
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-emerald-500 shrink-0" />
                      <span>Present</span>
                    </div>
                    <div className="text-xl font-bold font-mono text-foreground mt-1">
                      {stats.present}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-amber-500 shrink-0" />
                      <span>Late</span>
                    </div>
                    <div className="text-xl font-bold font-mono text-foreground mt-1">
                      {stats.late}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg border border-border/60 bg-muted/20">
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <span className="size-1.5 rounded-full bg-rose-500 shrink-0" />
                      <span>Absent</span>
                    </div>
                    <div className="text-xl font-bold font-mono text-foreground mt-1">
                      {stats.absent}
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between p-2.5 rounded-lg bg-muted/30 border border-border/60 text-xs">
                  <span className="text-muted-foreground flex items-center gap-2">
                    <span className="size-1.5 rounded-full bg-primary" />
                    Punctuality Score
                  </span>
                  <span className="font-semibold text-foreground font-mono">
                    {stats.onTimeRate}% on-time
                  </span>
                </div>
              </>
            )}
          </CardContent>
        </div>
      </Card>
    </div>
  );
}
