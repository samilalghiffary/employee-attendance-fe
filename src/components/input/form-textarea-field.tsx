"use client";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Textarea } from "@/components/ui/textarea";
import * as React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

export interface FormTextareaFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<React.ComponentProps<typeof Textarea>, "name" | "defaultValue"> {
  control: Control<TFieldValues>;
  name: TName;
  label?: React.ReactNode;
  description?: React.ReactNode;
}

export function FormTextareaField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  id,
  disabled,
  rows = 3,
  ...props
}: FormTextareaFieldProps<TFieldValues, TName>) {
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
      <Textarea
        rows={rows}
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
