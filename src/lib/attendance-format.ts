import type { AttendanceItem } from "@/types/attendance";
import { differenceInMinutes, format, parseISO } from "date-fns";

export function formatTime(iso?: string | null) {
  if (!iso) return "-";
  return format(parseISO(iso), "HH:mm");
}

export function formatDate(date: string) {
  return format(parseISO(date), "EEE, MMM d, yyyy");
}

export function formatDuration(item: Pick<AttendanceItem, "checkIn" | "checkOut">) {
  if (!item.checkIn || !item.checkOut) return "-";
  const minutes = differenceInMinutes(parseISO(item.checkOut), parseISO(item.checkIn));
  if (minutes <= 0) return "-";
  return `${Math.floor(minutes / 60)}h ${minutes % 60}m`;
}
