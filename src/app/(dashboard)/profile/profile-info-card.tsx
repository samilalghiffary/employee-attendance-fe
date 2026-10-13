"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, User } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { FormInputField } from "@/components/input";
import { Badge } from "@/components/ui/badge";
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
import { useUpdateProfile } from "@/hooks/use-user";
import { getDefaultValues } from "@/lib/validations/defaults";
import { updateProfileSchema, type UpdateProfileFormData } from "@/lib/validations/user";
import type { UserItem } from "@/types/user";

export interface ProfileInfoCardProps {
  user?: UserItem | null;
  isLoading?: boolean;
}

export function ProfileInfoCard({ user, isLoading = false }: ProfileInfoCardProps) {
  const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const form = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: getDefaultValues(updateProfileSchema),
  });

  useEffect(() => {
    if (user) {
      form.reset({
        name: user.name,
        email: user.email,
      });
    }
  }, [user, form]);

  const onSubmit = (data: UpdateProfileFormData) => {
    updateProfile(data);
  };

  if (isLoading) {
    return <Skeleton className="h-64 w-full" />;
  }

  return (
    <Card className="shadow-sm border-border flex flex-col justify-between">
      <div>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <User className="size-4 text-primary" />
              <CardTitle className="text-lg">Personal Profile</CardTitle>
            </div>
            {user?.role && (
              <Badge variant="outline" className="text-xs">
                {user.role}
              </Badge>
            )}
          </div>
          <CardDescription>
            Update your full name and primary email address.
          </CardDescription>
        </CardHeader>

        <form noValidate id="profile-form" onSubmit={form.handleSubmit(onSubmit)}>
          <CardContent>
            <FieldGroup>
              <FormInputField
                name="name"
                label="Full Name"
                disabled={isUpdating}
                placeholder="John Doe"
                control={form.control}
              />
              <FormInputField
                name="email"
                type="email"
                label="Email Address"
                disabled={isUpdating}
                control={form.control}
                placeholder="name@company.com"
              />
            </FieldGroup>
          </CardContent>
        </form>
      </div>

      <CardFooter className="border-t border-border/50 pt-4 flex justify-end">
        <Button type="submit" form="profile-form" disabled={isUpdating}>
          {isUpdating && <Loader2 className="mr-2 size-3.5 animate-spin" />}
          Save Changes
        </Button>
      </CardFooter>
    </Card>
  );
}
