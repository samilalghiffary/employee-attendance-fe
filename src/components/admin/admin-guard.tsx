"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";
import { toast } from "sonner";

interface AdminGuardProps {
  children: React.ReactNode;
}

const emptySubscribe = () => () => {};

export function AdminGuard({ children }: AdminGuardProps) {
  const router = useRouter();
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const role = useAuthStore((state) => state.user?.role);
  const isAdmin = role === "ADMIN";

  useEffect(() => {
    if (isClient && role && !isAdmin) {
      toast.error("Access denied", {
        description: "This area is restricted to administrators.",
      });
      router.replace("/");
    }
  }, [isClient, role, isAdmin, router]);

  return <>{!isClient || !isAdmin ? <Skeleton className="h-96 w-full" /> : children}</>;
}
