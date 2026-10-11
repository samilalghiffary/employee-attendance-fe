export type UserRole = "ADMIN" | "EMPLOYEE";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  createdAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  role?: UserRole;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  accessToken: string;
  tokenType: string;
  expiresIn: string;
  user: UserProfile;
}

export interface RegisterResponse {
  success: boolean;
  message: string;
  user: UserProfile;
}
