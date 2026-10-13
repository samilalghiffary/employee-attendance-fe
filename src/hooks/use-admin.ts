import { ATTENDANCE_KEYS } from "@/hooks/use-attendance";
import { adminApi } from "@/lib/api/admin";
import type {
  AdminAttendanceQuery,
  AdminUpdateUserDto,
  AdminUsersQuery,
  AttendanceSummaryQuery,
  CreateUserDto,
  UpdateWorkScheduleDto,
} from "@/types/admin";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const ADMIN_KEYS = {
  users: ["admin", "users"] as const,
  overview: ["admin", "attendance", "overview"] as const,
  summary: ["admin", "attendance", "summary"] as const,
};

export function useAdminUsers(query: AdminUsersQuery) {
  return useQuery({
    queryKey: [...ADMIN_KEYS.users, query],
    queryFn: () => adminApi.getUsers(query),
    placeholderData: keepPreviousData,
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: CreateUserDto) => adminApi.createUser(dto),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.users });
      toast.success(res.message || "Employee created successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to create employee", { description: error.message });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, dto }: { id: string; dto: AdminUpdateUserDto }) =>
      adminApi.updateUser(id, dto),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.users });
      toast.success(res.message || "Employee updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update employee", { description: error.message });
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, isActive }: { id: string; isActive: boolean }) =>
      adminApi.updateUserStatus(id, { isActive }),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.users });
      toast.success(res.message || "Account status updated");
    },
    onError: (error: Error) => {
      toast.error("Failed to update account status", { description: error.message });
    },
  });
}

export function useAdminAttendanceOverview(query: AdminAttendanceQuery) {
  return useQuery({
    queryKey: [...ADMIN_KEYS.overview, query],
    queryFn: () => adminApi.getAttendanceOverview(query),
    placeholderData: keepPreviousData,
  });
}

export function useAdminAttendanceSummary(query: AttendanceSummaryQuery) {
  return useQuery({
    queryKey: [...ADMIN_KEYS.summary, query],
    queryFn: () => adminApi.getAttendanceSummary(query),
    placeholderData: keepPreviousData,
  });
}

export function useUpdateWorkSchedule() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (dto: UpdateWorkScheduleDto) => adminApi.updateWorkSchedule(dto),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ATTENDANCE_KEYS.workSchedule });
      toast.success(res.message || "Work schedule updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update work schedule", { description: error.message });
    },
  });
}

export function useDeleteAttendance() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => adminApi.deleteAttendance(id),
    onSuccess: (res) => {
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.overview });
      queryClient.invalidateQueries({ queryKey: ADMIN_KEYS.summary });
      toast.success(res.message || "Attendance record deleted successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to delete attendance record", { description: error.message });
    },
  });
}
