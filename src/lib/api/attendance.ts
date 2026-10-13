import { apiClient } from "@/lib/api-client";
import type {
  TodayAttendanceResponse,
  AttendanceResponse,
  CheckInDto,
  CheckOutDto,
  WorkScheduleResponse,
  AttendanceHistoryQuery,
  PaginatedAttendanceResponse,
} from "@/types/attendance";

export const attendanceApi = {
  getTodayStatus: async (): Promise<TodayAttendanceResponse> => {
    const res = await apiClient.get<TodayAttendanceResponse>("/attendance/today");
    return res.data;
  },

  checkIn: async (dto: CheckInDto): Promise<AttendanceResponse> => {
    const res = await apiClient.post<AttendanceResponse>("/attendance/check-in", dto);
    return res.data;
  },

  checkOut: async (dto: CheckOutDto): Promise<AttendanceResponse> => {
    const res = await apiClient.post<AttendanceResponse>("/attendance/check-out", dto);
    return res.data;
  },

  getWorkSchedule: async (): Promise<WorkScheduleResponse> => {
    const res = await apiClient.get<WorkScheduleResponse>("/settings/work-schedule");
    return res.data;
  },

  getMyHistory: async (query: AttendanceHistoryQuery): Promise<PaginatedAttendanceResponse> => {
    const res = await apiClient.get<PaginatedAttendanceResponse>("/attendance/my-history", {
      params: query,
    });
    return res.data;
  },
};
