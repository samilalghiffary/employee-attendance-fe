"use client";

import type { LucideIcon } from "lucide-react";
import * as React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export interface InputFieldProps extends Omit<
  React.ComponentProps<typeof Input>,
  "size"
> {
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  icon?: LucideIcon;
  iconPosition?: "left" | "right";
  wrapperClassName?: string;
}

export function InputField({
  id,
  label,
  description,
  error,
  icon: Icon,
  iconPosition = "left",
  className,
  wrapperClassName,
  disabled,
  ...props
}: InputFieldProps) {
  const isInvalid = Boolean(error);

  const inputElement = (
    <div className={cn("relative", wrapperClassName)}>
      {Icon && iconPosition === "left" && (
        <Icon className="pointer-events-none absolute left-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      )}
      <Input
        id={id}
        disabled={disabled}
        aria-invalid={isInvalid || undefined}
        className={cn(
          Icon && iconPosition === "left" && "pl-7",
          Icon && iconPosition === "right" && "pr-7",
          className
        )}
        {...props}
      />
      {Icon && iconPosition === "right" && (
        <Icon className="pointer-events-none absolute right-2 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
      )}
    </div>
  );

  if (!label && !description && !error) {
    return inputElement;
  }

  return (
    <Field data-invalid={isInvalid || undefined} data-disabled={disabled || undefined}>
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      {inputElement}
      {description && !error && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

export interface FormInputFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<InputFieldProps, "name" | "defaultValue" | "error"> {
  control: Control<TFieldValues>;
  name: TName;
}

export function FormInputField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, id, disabled, ...props }: FormInputFieldProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  const inputId = id || name;

  return (
    <InputField
      {...props}
      {...field}
      id={inputId}
      disabled={disabled}
      error={error?.message}
      onChange={(e) => {
        if (props.type === "number") {
          const val = e.target.value === "" ? 0 : e.target.valueAsNumber;
          field.onChange(isNaN(val) ? 0 : val);
        } else {
          field.onChange(e);
        }
      }}
    />
  );
}
