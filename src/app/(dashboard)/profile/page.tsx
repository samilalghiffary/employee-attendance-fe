"use client";

import { PageHeader } from "@/components/layout";
import { ChangePasswordCard, ProfileInfoCard } from "@/components/profile";
import { Skeleton } from "@/components/ui/skeleton";
import { useUserProfile } from "@/hooks/use-user";
import { ShieldCheck } from "lucide-react";

export default function ProfilePage() {
  const { data: user, isLoading } = useUserProfile();

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Account Settings"
        description="Manage your personal profile details and security credentials."
      />

      <div className="grid gap-6 md:grid-cols-2">
        <ProfileInfoCard user={user} isLoading={isLoading} />
        <ChangePasswordCard isLoading={isLoading} />
      </div>

      {isLoading ? (
        <Skeleton className="h-14 w-full rounded-lg" />
      ) : (
        <div className="rounded-lg border border-border/60 bg-muted/40 p-4 flex items-center gap-3">
          <ShieldCheck className="size-5 text-primary shrink-0" />
          <p className="text-xs text-muted-foreground">
            Account active since{" "}
            <span className="font-semibold text-foreground">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : "-"}
            </span>
            . For role changes or departmental reassignment, please contact Human
            Resources.
          </p>
        </div>
      )}
    </div>
  );
}
