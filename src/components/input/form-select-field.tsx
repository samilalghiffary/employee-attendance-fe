"use client";

import { Field, FieldDescription, FieldError, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as React from "react";
import {
  useController,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";

export interface SelectOption {
  label: React.ReactNode;
  value: string;
}

export interface SelectFieldProps {
  id?: string;
  value?: string;
  onValueChange?: (value: string | undefined) => void;
  options: readonly SelectOption[] | SelectOption[];
  label?: React.ReactNode;
  description?: React.ReactNode;
  error?: React.ReactNode;
  placeholder?: string;
  allLabel?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
  size?: "sm" | "default";
}

export function SelectField({
  id,
  value,
  onValueChange,
  options,
  label,
  description,
  error,
  placeholder,
  allLabel,
  disabled,
  className,
  triggerClassName,
  size = "default",
}: SelectFieldProps) {
  const isInvalid = Boolean(error);
  const currentValue = value ?? (allLabel ? "ALL" : undefined);

  const itemsList = React.useMemo(() => {
    if (!allLabel) return options;
    return [{ value: "ALL", label: allLabel }, ...options];
  }, [allLabel, options]);

  const selectTrigger = (
    <Select
      items={itemsList}
      value={currentValue}
      disabled={disabled}
      onValueChange={(val) => {
        if (!onValueChange) return;
        if (allLabel && val === "ALL") {
          onValueChange(undefined);
        } else {
          onValueChange(val ? String(val) : undefined);
        }
      }}
    >
      <SelectTrigger
        id={id}
        size={size}
        aria-invalid={isInvalid || undefined}
        className={triggerClassName ?? (label ? "w-full" : undefined)}
      >
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allLabel && <SelectItem value="ALL">{allLabel}</SelectItem>}
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );

  if (!label && !description && !error) {
    return selectTrigger;
  }

  return (
    <Field
      className={className}
      data-invalid={isInvalid || undefined}
      data-disabled={disabled || undefined}
    >
      {label && <FieldLabel htmlFor={id}>{label}</FieldLabel>}
      {selectTrigger}
      {description && !error && <FieldDescription>{description}</FieldDescription>}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

export interface FormSelectFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends Omit<SelectFieldProps, "value" | "onValueChange" | "error"> {
  control: Control<TFieldValues>;
  name: TName;
}

export function FormSelectField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ control, name, id, ...rest }: FormSelectFieldProps<TFieldValues, TName>) {
  const {
    field,
    fieldState: { error },
  } = useController({
    name,
    control,
  });

  return (
    <SelectField
      {...rest}
      id={id || name}
      value={field.value}
      error={error?.message}
      onValueChange={(v) => field.onChange(v)}
    />
  );
}
