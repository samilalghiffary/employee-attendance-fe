"use client";

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
import { useLogin } from "@/hooks/use-auth";
import { loginSchema, type LoginFormData } from "@/lib/validations/auth";
import { getDefaultValues } from "@/lib/validations/defaults";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2 } from "lucide-react";
import { useForm } from "react-hook-form";

export default function LoginPage() {
  const { mutate: login, isPending } = useLogin();

  const { control, handleSubmit } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: getDefaultValues(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4 bg-background">
      <Card className="w-full max-w-md shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold tracking-tight">Sign In</CardTitle>
          <CardDescription>
            Enter your email and password to access the attendance system.
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <CardContent>
            <FieldGroup>
              <FormInputField
                name="email"
                type="email"
                label="Email"
                control={control}
                autoComplete="email"
                disabled={isPending}
                placeholder="name@company.com"
              />
              <FormInputField
                name="password"
                type="password"
                label="Password"
                control={control}
                disabled={isPending}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </FieldGroup>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-2">
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Internal attendance portal. Please contact your system administrator or HR
              if you need an account.
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
