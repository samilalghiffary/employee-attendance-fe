"use client";

import { Clock, Loader2, RotateCcw, Save, ShieldCheck, Sparkles } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";

import { FormInputField } from "@/components/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import type { WorkScheduleFormData } from "@/lib/validations/admin";

export interface ScheduleFormCardProps {
  form: UseFormReturn<WorkScheduleFormData>;
  watchedStartTime: string;
  watchedTolerance: number;
  isPending: boolean;
  isLoading?: boolean;
  onReset: () => void;
  onSubmit: React.ComponentProps<"form">["onSubmit"];
}

export function ScheduleFormCard({
  form,
  watchedStartTime,
  watchedTolerance,
  isPending,
  isLoading = false,
  onReset,
  onSubmit,
}: ScheduleFormCardProps) {
  const isDirty = form.formState.isDirty;

  if (isLoading) {
    return (
      <Card className="lg:col-span-8 border-border">
        <CardHeader className="space-y-2">
          <Skeleton className="h-6 w-1/3" />
          <Skeleton className="h-4 w-1/2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="lg:col-span-8 flex flex-col">
      <Card className="border-border shadow-sm pb-0">
        <CardHeader className="border-b border-border/50 pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Clock className="size-5" />
              </div>
              <div>
                <CardTitle className="text-base font-semibold">
                  Work Schedule & Shifts
                </CardTitle>
                <CardDescription className="text-xs mt-0.5">
                  Defines standard office shift hours and late determination window.
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="text-xs font-mono">
              24h Format
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-6 pt-6">
          <FieldGroup>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormInputField
                placeholder="08:00"
                name="workStartTime"
                control={form.control}
                id="settings-start-time"
                label="Shift Start Time (HH:mm)"
                description="Standard start of workday check-in (e.g. 08:00)."
              />

              <FormInputField
                placeholder="17:00"
                name="workEndTime"
                control={form.control}
                id="settings-end-time"
                label="Shift End Time (HH:mm)"
                description="Standard conclusion of workday check-out (e.g. 17:00)."
              />
            </div>

            <div className="pt-2">
              <FormInputField
                min={0}
                max={120}
                type="number"
                placeholder="15"
                control={form.control}
                name="lateToleranceMinutes"
                id="settings-late-tolerance"
                label="Late Grace Period Tolerance (Minutes)"
                description="Threshold buffer past shift start time before an attendance record is marked as LATE."
              />
            </div>
          </FieldGroup>

          <div className="rounded-xl border border-primary/20 bg-primary/5 p-4 text-xs text-muted-foreground space-y-2">
            <div className="flex items-center gap-2 font-medium text-foreground">
              <Sparkles className="size-4 text-primary" />
              <span>Real-time Policy Calculation Simulation</span>
            </div>
            <p className="leading-relaxed">
              Check-in logs arriving on or before{" "}
              <span className="font-semibold text-foreground underline decoration-primary underline-offset-2">
                {watchedStartTime} + {watchedTolerance}m (Grace Deadline)
              </span>{" "}
              will be tagged as{" "}
              <Badge
                variant="outline"
                className="text-[10px] bg-emerald-50 text-emerald-600 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-500/30 font-medium"
              >
                PRESENT
              </Badge>
              . Any arrival past this will be tagged as{" "}
              <Badge
                variant="outline"
                className="text-[10px] bg-destructive/10 text-destructive border-destructive/30 font-medium"
              >
                LATE
              </Badge>
              .
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t border-border/60 py-3 bg-muted/20">
          <div className="flex items-center gap-2 text-xs text-muted-foreground w-full sm:w-auto">
            <ShieldCheck className="size-4 text-emerald-500 shrink-0" />
            <span>Modifications take effect immediately for new employee logs.</span>
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            {isDirty && (
              <Button
                size="sm"
                type="button"
                variant="outline"
                onClick={onReset}
                disabled={isPending}
              >
                <RotateCcw className="size-3.5 mr-1" /> Reset
              </Button>
            )}
            <Button
              size="sm"
              type="submit"
              id="settings-save-button"
              disabled={isPending || !isDirty}
              className="gap-2 w-full sm:w-auto"
            >
              {isPending ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Save className="size-4" />
              )}
              Save Schedule Policy
            </Button>
          </div>
        </CardFooter>
      </Card>
    </form>
  );
}
