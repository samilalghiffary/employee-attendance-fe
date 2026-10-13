import type { LucideIcon } from "lucide-react";
import * as React from "react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

export interface TableCardProps {
  /** Title of the table card */
  title: React.ReactNode;
  /** Optional secondary description text */
  description?: React.ReactNode;
  /** Optional leading icon next to title */
  icon?: LucideIcon;
  /** Filter or action controls placed on the right side of the card header */
  filters?: React.ReactNode;
  /** Primary table content (e.g. DataTable) */
  children: React.ReactNode;
  /** Optional class name for the Card container */
  className?: string;
  /** Optional class name for the CardHeader */
  headerClassName?: string;
  /** Optional class name for the CardContent wrapper */
  contentClassName?: string;
  /** HTML id for targeting/testing */
  id?: string;
}

export function TableCard({
  title,
  description,
  icon: Icon,
  filters,
  children,
  className,
  headerClassName,
  contentClassName,
  id,
}: TableCardProps) {
  return (
    <Card id={id} className={cn("border-border shadow-sm", className)}>
      <CardHeader
        className={cn(
          "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
          headerClassName
        )}
      >
        <div className="space-y-1">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            {Icon && <Icon className="size-4 shrink-0 text-muted-foreground" />}
            <span>{title}</span>
          </CardTitle>
          {description && <CardDescription>{description}</CardDescription>}
        </div>

        {filters && <div className="flex flex-wrap items-center gap-2">{filters}</div>}
      </CardHeader>

      <CardContent className={contentClassName}>{children}</CardContent>
    </Card>
  );
}
