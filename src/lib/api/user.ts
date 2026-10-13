import { apiClient } from "@/lib/api-client";
import type {
  ChangePasswordDto,
  ChangePasswordResponse,
  UpdateProfileDto,
  UserResponse,
} from "@/types/user";

export const userApi = {
  getProfile: async (): Promise<UserResponse> => {
    const res = await apiClient.get<UserResponse>("/users/profile");
    return res.data;
  },

  updateProfile: async (dto: UpdateProfileDto): Promise<UserResponse> => {
    const res = await apiClient.patch<UserResponse>("/users/profile", dto);
    return res.data;
  },

  changePassword: async (dto: ChangePasswordDto): Promise<ChangePasswordResponse> => {
    const res = await apiClient.patch<ChangePasswordResponse>(
      "/users/change-password",
      dto
    );
    return res.data;
  },
};
