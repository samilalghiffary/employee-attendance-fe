"use client";

import { FormTextareaField } from "@/components/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useCheckIn, useCheckOut } from "@/hooks/use-attendance";
import { useGeolocation } from "@/hooks/use-geolocation";
import {
  createAttendanceActionSchema,
  type AttendanceActionFormValues,
} from "@/lib/validations/attendance";
import { getDefaultValues } from "@/lib/validations/defaults";
import type { WorkSchedulePolicy } from "@/types/attendance";
import { zodResolver } from "@hookform/resolvers/zod";
import { AlertCircle, Clock, Loader2, MapPin } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";

interface AttendanceActionModalProps {
  type: "check-in" | "check-out";
  open: boolean;
  onOpenChange: (open: boolean) => void;
  schedule?: WorkSchedulePolicy | null;
}

export function AttendanceActionModal({
  type,
  open,
  onOpenChange,
  schedule,
}: AttendanceActionModalProps) {
  const geo = useGeolocation({ enabled: open });

  const { mutate: doCheckIn, isPending: isCheckingIn } = useCheckIn();
  const { mutate: doCheckOut, isPending: isCheckingOut } = useCheckOut();

  const isPending = isCheckingIn || isCheckingOut;
  const isCheckIn = type === "check-in";

  const actionTime = useMemo(() => new Date(), []);

  const lateInfo = useMemo(() => {
    if (!isCheckIn || !schedule?.workStartTime) {
      return { isLate: false, lateMinutes: 0 };
    }

    const [startH, startM] = schedule.workStartTime.split(":").map(Number);
    const scheduledStart = new Date(actionTime);
    scheduledStart.setHours(startH ?? 8, startM ?? 0, 0, 0);

    const tolerance = schedule.lateToleranceMinutes ?? 0;
    const diffMinutes = Math.floor(
      (actionTime.getTime() - scheduledStart.getTime()) / (1000 * 60)
    );

    if (diffMinutes > tolerance) {
      return { isLate: true, lateMinutes: diffMinutes };
    }
    return { isLate: false, lateMinutes: 0 };
  }, [isCheckIn, schedule, actionTime]);

  const earlyCheckoutInfo = useMemo(() => {
    if (isCheckIn || !schedule?.workEndTime) {
      return { isEarly: false, earlyMinutes: 0 };
    }

    const [endH, endM] = schedule.workEndTime.split(":").map(Number);
    const scheduledEnd = new Date(actionTime);
    scheduledEnd.setHours(endH ?? 17, endM ?? 0, 0, 0);

    const diffMinutes = Math.floor(
      (scheduledEnd.getTime() - actionTime.getTime()) / (1000 * 60)
    );

    if (diffMinutes > 0) {
      return { isEarly: true, earlyMinutes: diffMinutes };
    }
    return { isEarly: false, earlyMinutes: 0 };
  }, [isCheckIn, schedule, actionTime]);

  const isNotesRequired = isCheckIn ? lateInfo.isLate : earlyCheckoutInfo.isEarly;

  const formSchema = useMemo(
    () => createAttendanceActionSchema(isNotesRequired, type),
    [isNotesRequired, type]
  );

  const {
    control,
    handleSubmit: handleFormSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<AttendanceActionFormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: getDefaultValues(formSchema),
  });

  useEffect(() => {
    if (open) {
      reset(getDefaultValues(formSchema));
    }
  }, [open, reset, formSchema]);

  const onSubmit = (values: AttendanceActionFormValues) => {
    if (geo.latitude === null || geo.longitude === null) return;

    const payload = {
      latitude: geo.latitude,
      longitude: geo.longitude,
      notes: values.notes?.trim() || undefined,
    };

    if (isCheckIn) {
      doCheckIn(payload, {
        onSuccess: () => {
          reset({ notes: "" });
          onOpenChange(false);
        },
      });
    } else {
      doCheckOut(payload, {
        onSuccess: () => {
          reset({ notes: "" });
          onOpenChange(false);
        },
      });
    }
  };

  const hasCoordinates = geo.latitude !== null && geo.longitude !== null;
  const delta = 0.005;
  const bbox = hasCoordinates
    ? `${geo.longitude! - delta},${geo.latitude! - delta},${geo.longitude! + delta},${geo.latitude! + delta}`
    : "";
  const embedUrl = hasCoordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${geo.latitude},${geo.longitude}`
    : "";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form onSubmit={handleFormSubmit(onSubmit)} className="space-y-4">
          <DialogHeader>
            <DialogTitle>
              {isCheckIn ? "Confirm Attendance Check-In" : "Confirm Attendance Check-Out"}
            </DialogTitle>
            <DialogDescription>
              {isCheckIn
                ? "Your current timestamp and GPS coordinates will be recorded for today's entry."
                : "Your departure timestamp and GPS coordinates will be recorded for today's exit."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-4 p-3 rounded-lg border border-border/70 bg-muted/30 text-xs">
            <div className="flex items-center gap-2.5 min-w-0">
              <Clock className="size-4 text-primary shrink-0" />
              <div className="leading-tight">
                <span className="font-semibold text-foreground">Time Recording: </span>
                <span className="text-muted-foreground">
                  Recorded automatically via Server Time
                </span>
              </div>
            </div>

            {isCheckIn ? (
              <div className="self-start sm:self-auto shrink-0 pl-6.5 sm:pl-0">
                {lateInfo.isLate ? (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-destructive/15 text-destructive border border-destructive/20 whitespace-nowrap">
                    Late +{lateInfo.lateMinutes}m
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                    On Time
                  </span>
                )}
              </div>
            ) : (
              earlyCheckoutInfo.isEarly && (
                <div className="self-start sm:self-auto shrink-0 pl-6.5 sm:pl-0">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/20 whitespace-nowrap">
                    Early -{earlyCheckoutInfo.earlyMinutes}m
                  </span>
                </div>
              )
            )}
          </div>

          {isNotesRequired && (
            <div className="flex items-start gap-2.5 rounded-lg border border-destructive/20 bg-destructive/10 p-2.5 text-xs text-destructive">
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <div className="leading-relaxed">
                <span className="font-semibold">
                  {isCheckIn ? "Late Arrival Notice: " : "Early Checkout Notice: "}
                </span>
                <span>
                  {isCheckIn
                    ? "You are checking in past the tolerance threshold. A reason (minimum 10 characters) is required in the notes below."
                    : "You are checking out before the scheduled end time. A reason (minimum 10 characters) is required in the notes below."}
                </span>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <div className="relative w-full h-52 rounded-lg overflow-hidden border border-border bg-muted/20">
              {hasCoordinates ? (
                <iframe
                  src={embedUrl}
                  loading="lazy"
                  title="Confirmation Location Map"
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center text-xs text-muted-foreground">
                  <MapPin className="size-6 text-muted-foreground/50 mb-1" />
                  <span>GPS signal not available</span>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border/80 bg-muted/30 px-3 py-2 text-xs">
              <div className="flex items-center gap-2">
                <MapPin className="size-3.5 text-primary shrink-0" />
                {geo.loading ? (
                  <span className="text-muted-foreground flex items-center gap-1">
                    <Loader2 className="size-3 animate-spin" /> Detecting GPS location...
                  </span>
                ) : geo.error ? (
                  <span className="text-destructive font-medium flex items-center gap-1">
                    <AlertCircle className="size-3" /> {geo.error}
                  </span>
                ) : geo.latitude !== null && geo.longitude !== null ? (
                  <span className="font-mono text-muted-foreground">
                    {geo.latitude.toFixed(5)}, {geo.longitude.toFixed(5)}
                  </span>
                ) : (
                  <span className="text-muted-foreground">Waiting for GPS...</span>
                )}
              </div>
              <Button
                size="sm"
                type="button"
                variant="ghost"
                onClick={geo.refetch}
                disabled={geo.loading || isPending}
                className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground"
              >
                Refresh GPS
              </Button>
            </div>
          </div>

          <FormTextareaField
            control={control}
            name="notes"
            id="notes"
            rows={3}
            maxLength={255}
            disabled={isPending}
            label={
              <span className="flex items-center gap-1.5 text-xs">
                <span>Notes</span>
                {isNotesRequired ? (
                  <span className="text-destructive font-medium">(Required)</span>
                ) : (
                  <span className="text-muted-foreground font-normal">(Optional)</span>
                )}
              </span>
            }
            placeholder={
              isNotesRequired
                ? isCheckIn
                  ? "Please explain your late arrival reason (at least 10 characters)..."
                  : "Please explain why you are leaving early before scheduled time (at least 10 characters)..."
                : isCheckIn
                  ? "E.g. Traffic delay or morning assignment notes..."
                  : "E.g. Completed daily deliverables or overtime notes..."
            }
          />

          <DialogFooter className="sm:gap-0 md:gap-2">
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-primary text-primary-foreground"
              disabled={
                isPending ||
                geo.loading ||
                geo.latitude === null ||
                geo.longitude === null ||
                (isNotesRequired && (!isValid || Boolean(errors.notes)))
              }
            >
              {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
              {isCheckIn ? "Check In Now" : "Check Out Now"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
