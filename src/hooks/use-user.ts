import { userApi } from "@/lib/api/user";
import { useAuthStore } from "@/stores/use-auth-store";
import type { ChangePasswordDto, UpdateProfileDto } from "@/types/user";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const USER_KEYS = {
  profile: ["user", "profile"] as const,
};

export function useUserProfile() {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: USER_KEYS.profile,
    queryFn: async () => {
      const res = await userApi.getProfile();
      setUser(res.data);
      return res.data;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (dto: UpdateProfileDto) => userApi.updateProfile(dto),
    onSuccess: (res) => {
      setUser(res.data);
      queryClient.setQueryData(USER_KEYS.profile, res.data);
      toast.success(res.message || "Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to update profile", {
        description: error.message,
      });
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (dto: ChangePasswordDto) => userApi.changePassword(dto),
    onSuccess: (res) => {
      toast.success(res.message || "Password changed successfully");
    },
    onError: (error: Error) => {
      toast.error("Failed to change password", {
        description: error.message,
      });
    },
  });
}
