import type { Column } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import * as React from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface DataTableColumnHeaderProps<
  TData,
  TValue,
> extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>;
  title: string;
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn("text-xs font-semibold", className)}>{title}</div>;
  }

  const isSorted = column.getIsSorted();

  return (
    <div className={cn("flex items-center space-x-1.5", className)}>
      <Button
        size="xs"
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="-ml-2 h-7 px-2 font-semibold text-xs data-[state=open]:bg-accent hover:bg-muted/80 text-foreground"
      >
        <span>{title}</span>
        {isSorted === "desc" ? (
          <ArrowDown className="ml-1 size-3 text-primary" />
        ) : isSorted === "asc" ? (
          <ArrowUp className="ml-1 size-3 text-primary" />
        ) : (
          <ArrowUpDown className="ml-1 size-3 opacity-40 hover:opacity-100" />
        )}
      </Button>
    </div>
  );
}
