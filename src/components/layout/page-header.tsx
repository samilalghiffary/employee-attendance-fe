import * as React from "react";

import { cn } from "@/lib/utils";

export interface PageHeaderProps {
  /** Main heading text or custom node */
  title: React.ReactNode;
  /** Optional subtitle or description text */
  description?: React.ReactNode;
  /** Optional action elements on the right (e.g. CTA button) */
  action?: React.ReactNode;
  /** Custom container class */
  className?: string;
  /** Custom title class */
  titleClassName?: string;
  /** Custom description class */
  descriptionClassName?: string;
}

export function PageHeader({
  title,
  description,
  action,
  className,
  titleClassName,
  descriptionClassName,
}: PageHeaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between",
        className
      )}
    >
      <div className="space-y-1">
        <h1 className={cn("text-2xl font-bold tracking-tight", titleClassName)}>
          {title}
        </h1>
        {description && (
          <p className={cn("text-sm text-muted-foreground", descriptionClassName)}>
            {description}
          </p>
        )}
      </div>

      {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
    </div>
  );
}
