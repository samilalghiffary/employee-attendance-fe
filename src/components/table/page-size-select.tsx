"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAGE_SIZES } from "@/hooks/use-url-params";

export interface PageSizeSelectProps {
  id: string;
  value: number;
  onChange: (value: number) => void;
}

export function PageSizeSelect({ id, value, onChange }: PageSizeSelectProps) {
  return (
    <Select value={String(value)} onValueChange={(v) => onChange(Number(v))}>
      <SelectTrigger id={id} size="sm">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {PAGE_SIZES.map((size) => (
          <SelectItem key={size} value={String(size)}>
            {size} / page
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
