export type AttendanceStatus = "PRESENT" | "LATE" | "ABSENT";

export interface AttendanceItem {
  id: string;
  userId: string;
  date: string;
  checkIn: string | null;
  checkInLat: number | null;
  checkInLng: number | null;
  checkOut: string | null;
  checkOutLat: number | null;
  checkOutLng: number | null;
  status: AttendanceStatus;
  notes: string | null;
  createdAt: string;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface TodayAttendanceResponse {
  success: boolean;
  hasCheckedIn: boolean;
  hasCheckedOut: boolean;
  isAbsent: boolean;
  canCheckIn: boolean;
  data: AttendanceItem | null;
}

export interface AttendanceResponse {
  success: boolean;
  message: string;
  data: AttendanceItem;
}

export interface CheckInDto {
  latitude: number;
  longitude: number;
  notes?: string;
}

export interface CheckOutDto {
  latitude: number;
  longitude: number;
  notes?: string;
}

export interface WorkSchedulePolicy {
  workStartTime: string;
  workEndTime: string;
  lateToleranceMinutes: number;
}

export interface WorkScheduleResponse {
  success: boolean;
  data: WorkSchedulePolicy;
}

export interface AttendanceHistoryQuery {
  page: number;
  limit: number;
  startDate?: string;
  endDate?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PaginatedAttendanceResponse {
  success: boolean;
  data: AttendanceItem[];
  meta: PaginationMeta;
}

export interface MyAttendanceSummaryData {
  totalRecords: number;
  present: number;
  late: number;
  absent: number;
  lateMinutes: number;
  earlyLeaveMinutes: number;
  onTimeRate: string;
}

export interface MyAttendanceSummaryResponse {
  success: boolean;
  message: string;
  data: MyAttendanceSummaryData;
}
