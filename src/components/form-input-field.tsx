"use client";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import * as React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

export interface FormInputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.ComponentProps<typeof Input>, "name" | "defaultValue"> {
  control: Control<TFieldValues>;
  name: TName;
  label?: string;
  description?: string;
}

export function FormInputField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  id,
  disabled,
  ...props
}: FormInputFieldProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error, invalid },
  } = useController({
    name,
    control,
  });

  const inputId = id || name;

  return (
    <Field data-invalid={invalid || undefined} data-disabled={disabled || undefined}>
      {label && <FieldLabel htmlFor={inputId}>{label}</FieldLabel>}
      <Input
        {...props}
        {...field}
        id={inputId}
        disabled={disabled}
        aria-invalid={invalid || undefined}
      />
      {description && !error && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error.message}</FieldError>}
    </Field>
  );
}
