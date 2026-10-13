"use client";

import { AppSidebar, DashboardNavbar } from "@/components/layout";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { useAuthStore } from "@/stores/use-auth-store";
import { useRouter } from "next/navigation";
import { useEffect, useSyncExternalStore } from "react";

const emptySubscribe = () => () => {};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isClient = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  useEffect(() => {
    if (isClient && !isAuthenticated) {
      router.replace("/login");
    }
  }, [isClient, isAuthenticated, router]);

  if (!isClient || !isAuthenticated) {
    return null;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <DashboardNavbar />
        <div className="flex flex-1 flex-col gap-4 p-4 md:p-6 bg-background">
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
