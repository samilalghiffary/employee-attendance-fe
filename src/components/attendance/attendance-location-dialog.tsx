"use client";

import { ExternalLink, LogIn, LogOut, MapPin, Navigation } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatDate, formatTime } from "@/lib/attendance-format";
import { cn } from "@/lib/utils";
import type { AttendanceItem } from "@/types/attendance";

export interface AttendanceLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  record: AttendanceItem | null;
  initialType?: "check-in" | "check-out";
}

export function AttendanceLocationDialog({
  open,
  onOpenChange,
  record,
  initialType = "check-in",
}: AttendanceLocationDialogProps) {
  const [userSelectedTab, setUserSelectedTab] = React.useState<
    "check-in" | "check-out" | null
  >(null);

  const hasCheckInLocation = record?.checkInLat != null && record?.checkInLng != null;
  const hasCheckOutLocation = record?.checkOutLat != null && record?.checkOutLng != null;

  const defaultTab: "check-in" | "check-out" = React.useMemo(() => {
    if (initialType === "check-out" && hasCheckOutLocation) {
      return "check-out";
    }
    if (hasCheckInLocation) {
      return "check-in";
    }
    if (hasCheckOutLocation) {
      return "check-out";
    }
    return initialType;
  }, [initialType, hasCheckInLocation, hasCheckOutLocation]);

  if (!record) return null;

  const activeTab = userSelectedTab ?? defaultTab;

  const currentLat = activeTab === "check-in" ? record.checkInLat : record.checkOutLat;
  const currentLng = activeTab === "check-in" ? record.checkInLng : record.checkOutLng;
  const currentTime = activeTab === "check-in" ? record.checkIn : record.checkOut;

  const hasCurrentCoords = currentLat != null && currentLng != null;

  const delta = 0.005;
  const bbox = hasCurrentCoords
    ? `${currentLng - delta},${currentLat - delta},${currentLng + delta},${currentLat + delta}`
    : "";
  const embedUrl = hasCurrentCoords
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${currentLat},${currentLng}`
    : "";
  const googleMapsUrl = hasCurrentCoords
    ? `https://www.google.com/maps/search/?api=1&query=${currentLat},${currentLng}`
    : "#";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl p-0 overflow-hidden gap-0 rounded-2xl border-border bg-card shadow-xl">
        <DialogHeader className="p-5 pb-3">
          <div className="flex items-center gap-2 text-foreground">
            <MapPin className="size-4 text-muted-foreground" />
            <DialogTitle className="text-sm font-semibold">
              Attendance Location Details
            </DialogTitle>
          </div>
          <DialogDescription className="text-xs text-muted-foreground mt-0.5">
            {record.user?.name ? `${record.user.name} • ` : ""}
            {formatDate(record.date)}
          </DialogDescription>
        </DialogHeader>

        <div className="px-5 pt-1 pb-3 flex gap-2 border-b border-border/50 bg-muted/10">
          <button
            type="button"
            disabled={!hasCheckInLocation}
            onClick={() => setUserSelectedTab("check-in")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border",
              activeTab === "check-in"
                ? "bg-background text-foreground border-border shadow-xs"
                : "bg-transparent text-muted-foreground border-transparent hover:bg-muted/60 hover:text-foreground",
              !hasCheckInLocation &&
                "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground"
            )}
          >
            <LogIn className="size-3.5 text-muted-foreground" />
            <span>Check In</span>
            {record.checkIn ? (
              <span className="text-[11px] text-muted-foreground font-mono ml-1">
                ({formatTime(record.checkIn)})
              </span>
            ) : null}
          </button>

          <button
            type="button"
            disabled={!hasCheckOutLocation}
            onClick={() => setUserSelectedTab("check-out")}
            className={cn(
              "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer border",
              activeTab === "check-out"
                ? "bg-background text-foreground border-border shadow-xs"
                : "bg-transparent text-muted-foreground border-transparent hover:bg-muted/60 hover:text-foreground",
              !hasCheckOutLocation &&
                "opacity-40 cursor-not-allowed hover:bg-transparent hover:text-muted-foreground"
            )}
          >
            <LogOut className="size-3.5 text-muted-foreground" />
            <span>Check Out</span>
            {record.checkOut ? (
              <span className="text-[11px] text-muted-foreground font-mono ml-1">
                ({formatTime(record.checkOut)})
              </span>
            ) : null}
          </button>
        </div>

        {/* Map Container */}
        <div className="relative w-full h-72 sm:h-80 bg-muted/10 border-b border-border/50">
          {hasCurrentCoords ? (
            <iframe
              title={`Location for ${activeTab}`}
              src={embedUrl}
              loading="lazy"
              className="w-full h-full border-0 absolute inset-0"
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center text-xs text-muted-foreground">
              <Navigation className="size-8 opacity-30 mb-2" />
              <p className="font-medium text-foreground">No GPS Coordinates</p>
              <p className="text-[11px] max-w-64 mt-0.5">
                Location coordinates were not recorded for this action.
              </p>
            </div>
          )}
        </div>

        {/* Footer info & external link */}
        <div className="p-4 bg-muted/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-0.5">
            <div className="text-muted-foreground flex items-center gap-1.5">
              <span>Timestamp:</span>
              <span className="font-semibold text-foreground font-mono">
                {currentTime ? formatTime(currentTime) : "-"}
              </span>
            </div>
            {hasCurrentCoords ? (
              <div className="text-[11px] text-muted-foreground font-mono">
                GPS: {currentLat.toFixed(6)}, {currentLng.toFixed(6)}
              </div>
            ) : null}
          </div>

          {hasCurrentCoords && (
            <Button
              variant="outline"
              size="xs"
              className="gap-1.5 self-start sm:self-auto cursor-pointer"
              render={
                <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" />
              }
            >
              <span>Open in Google Maps</span>
              <ExternalLink className="size-3" />
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
