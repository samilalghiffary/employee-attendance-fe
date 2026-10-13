"use client";

import {
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  parseISO,
  startOfMonth,
  startOfWeek,
  subDays,
  subMonths,
} from "date-fns";
import { CalendarRange, Check, RotateCcw } from "lucide-react";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";

const DATE_PARAM = "yyyy-MM-dd";

export interface DateRangeFilterProps {
  id: string;
  startDate?: string;
  endDate?: string;
  onChange: (range: { startDate?: string; endDate?: string }) => void;
}

interface DatePreset {
  label: string;
  getRange: () => { from: Date; to: Date };
}

export function DateRangeFilter({
  id,
  startDate,
  endDate,
  onChange,
}: DateRangeFilterProps) {
  const [open, setOpen] = useState(false);

  const range: DateRange | undefined = useMemo(() => {
    if (!startDate) return undefined;
    return {
      from: parseISO(startDate),
      to: endDate ? parseISO(endDate) : undefined,
    };
  }, [startDate, endDate]);

  const now = useMemo(() => new Date(), []);

  const presets: DatePreset[] = useMemo(() => {
    return [
      {
        label: "Today",
        getRange: () => ({ from: now, to: now }),
      },
      {
        label: "This Week",
        getRange: () => ({
          from: startOfWeek(now, { weekStartsOn: 1 }),
          to: endOfWeek(now, { weekStartsOn: 1 }),
        }),
      },
      {
        label: "Last 7 Days",
        getRange: () => ({
          from: subDays(now, 6),
          to: now,
        }),
      },
      {
        label: "This Month",
        getRange: () => ({
          from: startOfMonth(now),
          to: endOfMonth(now),
        }),
      },
      {
        label: "Last Month",
        getRange: () => {
          const lastMonth = subMonths(now, 1);
          return {
            from: startOfMonth(lastMonth),
            to: endOfMonth(lastMonth),
          };
        },
      },
      {
        label: "Last 30 Days",
        getRange: () => ({
          from: subDays(now, 29),
          to: now,
        }),
      },
    ];
  }, [now]);

  const monthShortcuts = useMemo(() => {
    return [0, 1, 2, 3].map((offset) => {
      const monthDate = subMonths(now, offset);
      return {
        label: format(monthDate, "MMMM yyyy"),
        from: startOfMonth(monthDate),
        to: endOfMonth(monthDate),
      };
    });
  }, [now]);

  const activePresetLabel = useMemo(() => {
    if (!range?.from || !range.to) return null;
    for (const preset of presets) {
      const p = preset.getRange();
      if (isSameDay(range.from, p.from) && isSameDay(range.to, p.to)) {
        return preset.label;
      }
    }
    for (const m of monthShortcuts) {
      if (isSameDay(range.from, m.from) && isSameDay(range.to, m.to)) {
        return m.label;
      }
    }
    return null;
  }, [range, presets, monthShortcuts]);

  const applyRange = (from: Date, to: Date) => {
    onChange({
      startDate: format(from, DATE_PARAM),
      endDate: format(to, DATE_PARAM),
    });
    setOpen(false);
  };

  const label = range?.from
    ? range.to
      ? isSameDay(range.from, range.to)
        ? format(range.from, "MMM d, yyyy")
        : `${format(range.from, "MMM d, yyyy")} – ${format(range.to, "MMM d, yyyy")}`
      : format(range.from, "MMM d, yyyy")
    : "All dates";

  return (
    <>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger
          render={
            <Button
              id={id}
              size="sm"
              variant="outline"
              className={cn(
                "gap-2",
                startDate && "border-primary/50 bg-primary/5 font-medium"
              )}
            >
              <CalendarRange className="size-3.5 text-primary" />
              <span>{activePresetLabel ?? label}</span>
            </Button>
          }
        />
        <PopoverContent align="start" className="w-auto p-0 shadow-lg border-border">
          <div className="flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-border">
            <div className="flex flex-col p-3 md:w-44 bg-muted/20 space-y-3">
              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1.5">
                  Presets
                </p>
                <div className="space-y-0.5">
                  {presets.map((preset) => {
                    const isActive = activePresetLabel === preset.label;
                    return (
                      <button
                        type="button"
                        key={preset.label}
                        onClick={() => {
                          const p = preset.getRange();
                          applyRange(p.from, p.to);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between text-left text-xs px-2.5 py-1.5 rounded-md transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "hover:bg-muted text-foreground"
                        )}
                      >
                        <span>{preset.label}</span>
                        {isActive && <Check className="size-3" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <p className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wider px-2 mb-1.5">
                  By Month
                </p>
                <div className="space-y-0.5">
                  {monthShortcuts.map((m) => {
                    const isActive = activePresetLabel === m.label;
                    return (
                      <button
                        key={m.label}
                        type="button"
                        onClick={() => applyRange(m.from, m.to)}
                        className={cn(
                          "w-full flex items-center justify-between text-left text-xs px-2.5 py-1.5 rounded-md transition-colors",
                          isActive
                            ? "bg-primary text-primary-foreground font-medium"
                            : "hover:bg-muted text-foreground"
                        )}
                      >
                        <span className="truncate">{m.label}</span>
                        {isActive && <Check className="size-3 shrink-0" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="p-3">
              <div className="pb-2 px-1 text-xs font-semibold text-muted-foreground flex justify-between items-center">
                <span>Select Custom Range</span>
                {range?.from && (
                  <span className="text-[11px] font-normal text-muted-foreground font-mono">
                    {format(range.from, "yyyy-MM-dd")}
                    {range.to && ` → ${format(range.to, "yyyy-MM-dd")}`}
                  </span>
                )}
              </div>
              <Calendar
                mode="range"
                selected={range}
                numberOfMonths={2}
                disabled={{ after: now }}
                defaultMonth={range?.from ?? now}
                onSelect={(next) => {
                  onChange({
                    startDate: next?.from ? format(next.from, DATE_PARAM) : undefined,
                    endDate: next?.to ? format(next.to, DATE_PARAM) : undefined,
                  });
                  if (next?.from && next?.to) {
                    setOpen(false);
                  }
                }}
              />
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {startDate && (
        <Button
          size="sm"
          variant="ghost"
          id={`${id}-reset`}
          className="gap-2 text-muted-foreground hover:text-foreground"
          onClick={() => onChange({ startDate: undefined, endDate: undefined })}
        >
          <RotateCcw className="size-3.5" /> Reset
        </Button>
      )}
    </>
  );
}
