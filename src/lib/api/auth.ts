import { apiClient } from "@/lib/api-client";
import type {
  LoginDto,
  LoginResponse,
  RegisterDto,
  RegisterResponse,
  UserProfile,
} from "@/types/auth";

export const authApi = {
  login: async (dto: LoginDto): Promise<LoginResponse> => {
    const res = await apiClient.post<LoginResponse>("/auth/login", dto);
    return res.data;
  },

  register: async (dto: RegisterDto): Promise<RegisterResponse> => {
    const res = await apiClient.post<RegisterResponse>("/auth/register", dto);
    return res.data;
  },

  getProfile: async (): Promise<UserProfile> => {
    const res = await apiClient.get<UserProfile>("/users/me");
    return res.data;
  },
};
