"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { FormInputField, FormSelectField } from "@/components/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { FieldGroup } from "@/components/ui/field";
import { useCreateUser, useUpdateUser } from "@/hooks/use-admin";
import {
  createUserSchema,
  editUserSchema,
  type UserFormData,
} from "@/lib/validations/admin";
import { getDefaultValues } from "@/lib/validations/defaults";
import type { UserItem } from "@/types/user";

const ROLE_OPTIONS = [
  { value: "EMPLOYEE", label: "Employee" },
  { value: "ADMIN", label: "Administrator" },
] as const;

interface UserFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user?: UserItem | null;
}

const EMPTY_FORM = getDefaultValues(createUserSchema);

export function UserFormDialog({ open, onOpenChange, user }: UserFormDialogProps) {
  const isEdit = Boolean(user);
  const createUser = useCreateUser();
  const updateUser = useUpdateUser();
  const isPending = createUser.isPending || updateUser.isPending;

  const form = useForm<UserFormData>({
    resolver: zodResolver(isEdit ? editUserSchema : createUserSchema),
    defaultValues: EMPTY_FORM,
  });

  useEffect(() => {
    if (open) {
      form.reset(
        user
          ? { name: user.name, email: user.email, role: user.role, password: "" }
          : EMPTY_FORM
      );
    }
  }, [open, user, form]);

  const onSubmit = async (values: UserFormData) => {
    try {
      if (user) {
        await updateUser.mutateAsync({
          id: user.id,
          dto: {
            name: values.name,
            email: values.email,
            role: values.role,
            ...(values.password ? { password: values.password } : {}),
          },
        });
      } else {
        await createUser.mutateAsync(values);
      }
      onOpenChange(false);
    } catch {
      // Error toast handled by mutation hooks
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Employee" : "Add Employee"}</DialogTitle>
          <DialogDescription>
            {isEdit
              ? "Update account details. Leave password empty to keep the current one."
              : "Create a new account. Share the initial password with the employee."}
          </DialogDescription>
        </DialogHeader>

        <form id="user-form" onSubmit={form.handleSubmit(onSubmit)} noValidate>
          <FieldGroup>
            <FormInputField
              name="name"
              label="Full Name"
              id="user-form-name"
              autoComplete="off"
              placeholder="John Doe"
              control={form.control}
            />
            <FormInputField
              type="email"
              name="email"
              label="Email"
              autoComplete="off"
              id="user-form-email"
              control={form.control}
              placeholder="john@company.com"
            />
            <FormSelectField
              control={form.control}
              name="role"
              id="user-form-role"
              label="Role"
              options={ROLE_OPTIONS}
            />
            <FormInputField
              name="password"
              type="password"
              control={form.control}
              id="user-form-password"
              placeholder="••••••••"
              autoComplete="new-password"
              label={isEdit ? "New Password (optional)" : "Initial Password"}
            />
          </FieldGroup>
        </form>

        <DialogFooter>
          <Button
            variant="outline"
            disabled={isPending}
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            form="user-form"
            disabled={isPending}
            id="user-form-submit"
          >
            {isPending && <Loader2 className="size-4 animate-spin" />}
            {isEdit ? "Save Changes" : "Create Employee"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
