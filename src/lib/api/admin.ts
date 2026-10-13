import { apiClient } from "@/lib/api-client";
import type {
  AdminAttendanceQuery,
  AdminUpdateUserDto,
  AdminUsersQuery,
  AttendanceSummaryQuery,
  AttendanceSummaryResponse,
  CreateUserDto,
  PaginatedUsersResponse,
  UpdateUserStatusDto,
  UpdateWorkScheduleDto,
  UpdateWorkScheduleResponse,
} from "@/types/admin";
import type { PaginatedAttendanceResponse } from "@/types/attendance";
import type { UserResponse } from "@/types/user";

export const adminApi = {
  getUsers: async (params: AdminUsersQuery): Promise<PaginatedUsersResponse> => {
    const res = await apiClient.get<PaginatedUsersResponse>("/admin/users", { params });
    return res.data;
  },

  createUser: async (dto: CreateUserDto): Promise<UserResponse> => {
    const res = await apiClient.post<UserResponse>("/admin/users", dto);
    return res.data;
  },

  updateUser: async (id: string, dto: AdminUpdateUserDto): Promise<UserResponse> => {
    const res = await apiClient.patch<UserResponse>(`/admin/users/${id}`, dto);
    return res.data;
  },

  updateUserStatus: async (
    id: string,
    dto: UpdateUserStatusDto
  ): Promise<UserResponse> => {
    const res = await apiClient.patch<UserResponse>(`/admin/users/${id}/status`, dto);
    return res.data;
  },

  getAttendanceOverview: async (
    params: AdminAttendanceQuery
  ): Promise<PaginatedAttendanceResponse> => {
    const res = await apiClient.get<PaginatedAttendanceResponse>(
      "/admin/attendance/overview",
      {
        params,
      }
    );
    return res.data;
  },

  getAttendanceSummary: async (
    params: AttendanceSummaryQuery
  ): Promise<AttendanceSummaryResponse> => {
    const res = await apiClient.get<AttendanceSummaryResponse>(
      "/admin/attendance/summary",
      {
        params,
      }
    );
    return res.data;
  },

  updateWorkSchedule: async (
    dto: UpdateWorkScheduleDto
  ): Promise<UpdateWorkScheduleResponse> => {
    const res = await apiClient.patch<UpdateWorkScheduleResponse>(
      "/admin/settings/work-schedule",
      dto
    );
    return res.data;
  },

  deleteAttendance: async (
    id: string
  ): Promise<{ success: boolean; message: string }> => {
    const res = await apiClient.delete<{ success: boolean; message: string }>(
      `/admin/attendance/${id}`
    );
    return res.data;
  },
};
