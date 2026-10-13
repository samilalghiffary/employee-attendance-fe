"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { KeyRound, Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

import { FormInputField } from "@/components/input";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Skeleton } from "@/components/ui/skeleton";
import { useChangePassword } from "@/hooks/use-user";
import { getDefaultValues } from "@/lib/validations/defaults";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/lib/validations/user";

export interface ChangePasswordCardProps {
  isLoading?: boolean;
}

export function ChangePasswordCard({ isLoading = false }: ChangePasswordCardProps) {
  const { mutate: changePassword, isPending: isChanging } = useChangePassword();

  const form = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: getDefaultValues(changePasswordSchema),
  });

  const onSubmit = (data: ChangePasswordFormData) => {
    changePassword(
      {
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      },
      {
        onSuccess: () => {
          form.reset();
        },
      }
    );
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <Card className="shadow-sm border-border flex flex-col justify-between">
      <div>
        <CardHeader>
          <div className="flex items-center gap-2">
            <KeyRound className="size-4 text-primary" />
            <CardTitle className="text-lg">Change Password</CardTitle>
          </div>
          <CardDescription>
            Ensure your account uses a strong and secure password.
          </CardDescription>
        </CardHeader>

        <form onSubmit={form.handleSubmit(onSubmit)} noValidate id="password-form">
          <CardContent>
            <FieldGroup>
              <FormInputField
                type="password"
                name="oldPassword"
                disabled={isChanging}
                placeholder="••••••••"
                control={form.control}
                label="Current Password"
                autoComplete="current-password"
              />
              <FormInputField
                type="password"
                name="newPassword"
                label="New Password"
                disabled={isChanging}
                placeholder="••••••••"
                control={form.control}
                autoComplete="new-password"
              />
              <FormInputField
                type="password"
                disabled={isChanging}
                placeholder="••••••••"
                name="confirmPassword"
                control={form.control}
                autoComplete="new-password"
                label="Confirm New Password"
              />
            </FieldGroup>
          </CardContent>
        </form>
      </div>

      <CardFooter className="border-t border-border/50 pt-4 flex justify-end">
        <Button type="submit" form="password-form" disabled={isChanging}>
          {isChanging && <Loader2 className="mr-2 size-3.5 animate-spin" />}
          Update Password
        </Button>
      </CardFooter>
    </Card>
  );
}
