import { Building2, CalendarCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export interface PolicySummarySidebarProps {
  startTime: string;
  endTime: string;
  toleranceMinutes: number;
  duration: string;
  isLoading?: boolean;
}

export function PolicySummarySidebar({
  startTime,
  endTime,
  toleranceMinutes,
  duration,
  isLoading = false,
}: PolicySummarySidebarProps) {
  if (isLoading) {
    return (
      <div className="lg:col-span-4 flex flex-col gap-6">
        <Card className="border-border">
          <CardHeader>
            <Skeleton className="h-6 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-3">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="lg:col-span-4 flex flex-col gap-6">
      <Card className="border-border shadow-sm">
        <CardHeader className="pb-3 border-b border-border/50">
          <div className="flex items-center gap-2">
            <CalendarCheck className="size-4 text-primary" />
            <CardTitle className="text-sm font-semibold">Policy Summary</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-4 text-xs">
          <div className="flex items-center justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Standard Shift Hours</span>
            <span className="font-mono font-medium text-foreground">
              {startTime} - {endTime}
            </span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Shift Work Duration</span>
            <span className="font-medium text-foreground">{duration}</span>
          </div>

          <div className="flex items-center justify-between py-1 border-b border-border/40">
            <span className="text-muted-foreground">Tolerance Window</span>
            <span className="font-mono font-medium text-foreground">
              +{toleranceMinutes} mins
            </span>
          </div>

          <div className="flex items-center justify-between py-1">
            <span className="text-muted-foreground">Enforcement Status</span>
            <Badge
              variant="outline"
              className="text-[11px] text-emerald-600 dark:text-emerald-400 border-emerald-500/30"
            >
              Active
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card className="border-border/60 bg-muted/30 shadow-none">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-foreground">
            <Building2 className="size-4 text-primary" />
            <span>Company Attendance Guidelines</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 text-xs text-muted-foreground">
          <p>
            Setting reasonable tolerance buffers reduces accidental late marks caused by
            short elevator delays or traffic spikes.
          </p>
          <p className="pt-1">
            Past logs won&apos;t be altered retroactively when updating these hours.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
