import type {
  AttendanceStatus,
  PaginationMeta,
  WorkSchedulePolicy,
} from "@/types/attendance";
import type { UserRole } from "@/types/auth";
import type { UserItem } from "@/types/user";

export interface AdminUsersQuery {
  page: number;
  limit: number;
  search?: string;
  role?: UserRole;
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginatedUsersResponse {
  success: boolean;
  data: UserItem[];
  meta: PaginationMeta;
}

export interface CreateUserDto {
  name: string;
  email: string;
  password: string;
  role?: UserRole;
}

export interface AdminUpdateUserDto {
  name?: string;
  email?: string;
  role?: UserRole;
  password?: string;
}

export interface UpdateUserStatusDto {
  isActive: boolean;
}

export interface AdminAttendanceQuery {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
  userId?: string;
  status?: AttendanceStatus;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface AttendanceSummaryQuery {
  startDate?: string;
  endDate?: string;
  userId?: string;
}

export interface AttendanceSummaryMetrics {
  totalEmployees: number;
  totalPresent: number;
  totalLate: number;
  totalLeave: number;
  totalAbsent: number;
  attendanceRate: string;
}

export interface AttendanceSummaryResponse {
  success: boolean;
  message: string;
  data: AttendanceSummaryMetrics;
}

export type UpdateWorkScheduleDto = Partial<WorkSchedulePolicy>;

export interface UpdateWorkScheduleResponse {
  success: boolean;
  message?: string;
  data: WorkSchedulePolicy & { updatedAt: string };
}
