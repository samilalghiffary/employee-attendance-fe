"use client";

import { Loader2 } from "lucide-react";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { UserItem } from "@/types/user";

export interface UserStatusDialogProps {
  user: UserItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isPending: boolean;
  onConfirm: () => void;
}

export function UserStatusDialog({
  user,
  open,
  onOpenChange,
  isPending,
  onConfirm,
}: UserStatusDialogProps) {
  const isDeactivating = user?.isActive ?? false;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {isDeactivating ? "Deactivate account?" : "Activate account?"}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {isDeactivating
              ? `${user?.name} will no longer be able to sign in or record attendance.`
              : `${user?.name} will regain access to sign in and record attendance.`}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            id="confirm-status-change"
            variant={isDeactivating ? "destructive" : "default"}
            onClick={(e) => {
              e.preventDefault();
              onConfirm();
            }}
          >
            {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
            {isDeactivating ? "Deactivate" : "Activate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
