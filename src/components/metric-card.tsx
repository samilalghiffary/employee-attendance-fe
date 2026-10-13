import type { LucideIcon } from "lucide-react";
import * as React from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

export interface MetricCardProps {
  label: React.ReactNode;
  value: React.ReactNode;
  icon: LucideIcon;
  isLoading?: boolean;
  id?: string;
  className?: string;
}

export function MetricCard({
  label,
  value,
  icon: Icon,
  isLoading = false,
  id,
  className,
}: MetricCardProps) {
  return (
    <Card id={id} className={cn("border-border shadow-sm", className)}>
      <CardContent className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium text-muted-foreground">{label}</p>
          {isLoading ? (
            <Skeleton className="h-7 w-12" />
          ) : (
            <p className="text-2xl font-bold tabular-nums">{value}</p>
          )}
        </div>
        <div className="flex size-9 items-center justify-center rounded-md bg-muted text-muted-foreground">
          <Icon className="size-4" />
        </div>
      </CardContent>
    </Card>
  );
}
