import { authApi } from "@/lib/api/auth";
import { useAuthStore } from "@/stores/use-auth-store";
import type { LoginDto, RegisterDto } from "@/types/auth";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function useLogin() {
  const router = useRouter();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: (dto: LoginDto) => authApi.login(dto),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      toast.success(data.message || "Login successful", {
        description: `Welcome back, ${data.user.name}`,
      });
      router.push("/");
    },
    onError: (error: Error) => {
      toast.error("Login failed", {
        description: error.message,
      });
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (dto: RegisterDto) => authApi.register(dto),
    onSuccess: (data) => {
      toast.success(data.message || "Registration successful", {
        description: "Please sign in with your credentials.",
      });
      router.push("/login");
    },
    onError: (error: Error) => {
      toast.error("Registration failed", {
        description: error.message,
      });
    },
  });
}

export function useCurrentUser() {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);

  return useQuery({
    queryKey: ["currentUser", token],
    queryFn: async () => {
      const user = await authApi.getProfile();
      setUser(user);
      return user;
    },
    enabled: !!token,
    staleTime: 1000 * 60 * 5,
  });
}
