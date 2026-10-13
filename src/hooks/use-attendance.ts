import { attendanceApi } from "@/lib/api/attendance";
import type { AttendanceHistoryQuery, CheckInDto, CheckOutDto } from "@/types/attendance";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const ATTENDANCE_KEYS = {
  today: ["attendance", "today"] as const,
  history: ["attendance", "my-history"] as const,
  summary: ["attendance", "my-summary"] as const,
  workSchedule: ["settings", "work-schedule"] as const,
};

export function useMyAttendanceHistory(query: AttendanceHistoryQuery) {
  return useQuery({
    queryKey: [...ATTENDANCE_KEYS.history, query],
    queryFn: () => attendanceApi.getMyHistory(query),
    placeholderData: keepPreviousData,
  });
}

export function useMyAttendanceSummary(query?: { startDate?: string; endDate?: string }) {
  return useQuery({
    queryKey: [...ATTENDANCE_KEYS.summary, query],
    queryFn: () => attendanceApi.getMySummary(query),
    placeholderData: keepPreviousData,
  });
}

export function useTodayAttendance() {
  return useQuery({
    queryKey: ATTENDANCE_KEYS.today,
    queryFn: () => attendanceApi.getTodayStatus(),
    refetchInterval: 30000, // Sync status every 30s
  });
}

export function useWorkSchedule() {
  return useQuery({
    queryKey: ATTENDANCE_KEYS.workSchedule,
    queryFn: () => attendanceApi.getWorkSchedule(),
    staleTime: 1000 * 60 * 30, // 30 minutes
  });
}

export function useCheckIn() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CheckInDto) => attendanceApi.checkIn(dto),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_KEYS.today });
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_KEYS.history });
      toast.success(res.message || "Check-in recorded successfully");
    },
    onError: (error: Error) => {
      toast.error("Check-in failed", {
        description: error.message,
      });
    },
  });
}

export function useCheckOut() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (dto: CheckOutDto) => attendanceApi.checkOut(dto),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_KEYS.today });
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_KEYS.history });
      toast.success(res.message || "Check-out recorded successfully");
    },
    onError: (error: Error) => {
      toast.error("Check-out failed", {
        description: error.message,
      });
    },
  });
}
