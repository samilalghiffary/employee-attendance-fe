"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGeolocation } from "@/hooks/use-geolocation";
import { cn } from "@/lib/utils";
import { ExternalLink, LocateFixed, MapPin, RefreshCw } from "lucide-react";

interface AttendanceMapCardProps {
  currentLat?: number | null;
  currentLng?: number | null;
  onRefreshCurrentLocation?: () => void;
  isLoadingLocation?: boolean;
  label?: string;
  notes?: string | null;
  className?: string;
  variant?: "card" | "embedded";
}

export function AttendanceMapCard({
  currentLat,
  currentLng,
  onRefreshCurrentLocation,
  isLoadingLocation,
  label = "Current Location",
  notes,
  className = "",
  variant = "card",
}: AttendanceMapCardProps) {
  const autoGeo = useGeolocation({
    enabled: currentLat === undefined && currentLng === undefined,
  });

  const displayLat = currentLat !== undefined ? currentLat : autoGeo.latitude;
  const displayLng = currentLng !== undefined ? currentLng : autoGeo.longitude;
  const effectiveLoading =
    isLoadingLocation !== undefined ? isLoadingLocation : autoGeo.loading;
  const handleRefresh = onRefreshCurrentLocation || autoGeo.refetch;
  const hasCoordinates = displayLat !== null && displayLng !== null;

  const delta = 0.005;
  const bbox = hasCoordinates
    ? `${displayLng! - delta},${displayLat! - delta},${displayLng! + delta},${displayLat! + delta}`
    : "";
  const embedUrl = hasCoordinates
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${displayLat},${displayLng}`
    : "";
  const openUrl = hasCoordinates
    ? `https://www.openstreetmap.org/?mlat=${displayLat}&mlon=${displayLng}#map=17/${displayLat}/${displayLng}`
    : "#";

  const isEmbedded = variant === "embedded";

  if (isEmbedded) {
    return (
      <div className={`space-y-2 w-full ${className}`}>
        <div className="relative w-full h-48 sm:h-64 md:h-72 rounded-xl overflow-hidden border border-border/80 bg-muted/20 shadow-xs">
          {hasCoordinates ? (
            <iframe
              title={label}
              src={embedUrl}
              loading="lazy"
              className="w-full h-full border-0 absolute inset-0"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-4 text-center text-xs text-muted-foreground bg-muted/10">
              <MapPin className="size-6 mb-1 opacity-40 text-primary" />
              <p className="font-medium text-foreground text-xs">Location Not Detected</p>
              <p className="text-[10px] mt-0.5 max-w-50">
                Please enable browser location access to detect your current position.
              </p>
            </div>
          )}

          <div className="absolute top-2.5 left-2.5 pointer-events-none">
            <div className="pointer-events-auto flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/85 backdrop-blur-md border border-border/70 shadow-xs text-xs font-medium text-foreground">
              <LocateFixed className="size-3 text-primary" />
              <span>{label}</span>
              <span className="text-[10px] text-muted-foreground flex items-center gap-1 font-mono ml-0.5">
                {hasCoordinates ? (
                  <>
                    <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Live GPS
                  </>
                ) : (
                  <>
                    <span className="size-1.5 rounded-full bg-muted-foreground/50" />
                    No GPS
                  </>
                )}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between px-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <MapPin className="size-3.5 text-primary shrink-0" />
            {hasCoordinates ? (
              <span className="flex items-center gap-1 font-mono text-[11px]">
                Coordinates:
                <a
                  href={openUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline flex items-center gap-0.5 ml-0.5"
                >
                  {displayLat?.toFixed(4)}, {displayLng?.toFixed(4)}
                  <ExternalLink className="size-2.5" />
                </a>
              </span>
            ) : (
              <span className="text-[11px]">GPS signal not detected</span>
            )}
          </div>

          {handleRefresh && (
            <Button
              size="xs"
              type="button"
              variant="ghost"
              onClick={handleRefresh}
              disabled={effectiveLoading}
              className="h-6 px-2 text-[11px] text-muted-foreground hover:text-foreground cursor-pointer flex items-center gap-1"
            >
              <RefreshCw className={`size-3 ${effectiveLoading ? "animate-spin" : ""}`} />
              <span>Refresh GPS</span>
            </Button>
          )}
        </div>

        {notes && (
          <div className="p-2 rounded-md bg-muted/40 border border-border/50 text-[11px] text-muted-foreground">
            <span className="font-semibold text-foreground mr-1">Note:</span>
            {notes}
          </div>
        )}
      </div>
    );
  }

  return (
    <Card
      className={cn(
        "border-border shadow-sm overflow-hidden flex flex-col h-full gap-0 py-0",
        className
      )}
    >
      <CardHeader className="flex flex-row items-center justify-between pt-4 pb-3 px-4 shrink-0 border-b border-border/50">
        <div className="flex items-center gap-2.5">
          <LocateFixed className="size-4 text-primary shrink-0" />
          <div>
            <CardTitle className="text-sm font-semibold">{label}</CardTitle>
            <p className="text-[11px] text-muted-foreground flex items-center gap-1 mt-0.5 font-mono">
              {hasCoordinates ? (
                <>
                  <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Live GPS Active
                </>
              ) : (
                <>
                  <span className="size-1.5 rounded-full bg-muted-foreground/50" />
                  No GPS Signal
                </>
              )}
            </p>
          </div>
        </div>

        {handleRefresh && (
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            title="Refresh GPS"
            onClick={handleRefresh}
            disabled={effectiveLoading}
            className="size-7 text-muted-foreground hover:text-foreground cursor-pointer"
          >
            <RefreshCw className={`size-3.5 ${effectiveLoading ? "animate-spin" : ""}`} />
          </Button>
        )}
      </CardHeader>

      <CardContent className="flex flex-col flex-1 p-0 min-h-0 overflow-hidden">
        <div className="relative flex-1 w-full min-h-0 bg-muted/20 overflow-hidden">
          {hasCoordinates ? (
            <iframe
              title={label}
              src={embedUrl}
              loading="lazy"
              className="w-full h-full border-0 absolute inset-0"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center text-xs text-muted-foreground border-y border-dashed border-border/70 bg-muted/10">
              <MapPin className="size-8 mb-2 opacity-40 text-primary" />
              <p className="font-medium text-foreground">Location Not Detected</p>
              <p className="text-[11px] mt-1 max-w-55">
                Please enable browser location access to detect your current position.
              </p>
            </div>
          )}
        </div>

        <div className="px-3.5 py-2 text-xs shrink-0 bg-card border-t border-border/60">
          {hasCoordinates ? (
            <div className="flex items-center justify-between leading-none">
              <span className="text-muted-foreground flex items-center gap-1 text-[11px]">
                <MapPin className="size-3 text-primary" />
                Coordinates:
              </span>
              <a
                href={openUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 font-mono text-[11px] text-primary hover:underline leading-none"
              >
                {displayLat?.toFixed(5)}, {displayLng?.toFixed(5)}
                <ExternalLink className="size-2.5" />
              </a>
            </div>
          ) : null}

          {notes ? (
            <div className="p-2.5 rounded-md bg-muted/40 border border-border/50 text-[11px]">
              <span className="font-semibold text-foreground">Notes:</span>{" "}
              <span className="text-muted-foreground">{notes}</span>
            </div>
          ) : null}
        </div>
      </CardContent>
    </Card>
  );
}
