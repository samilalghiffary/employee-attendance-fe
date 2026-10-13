"use client";

import {
  Popover,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { FileText } from "lucide-react";

interface NotesCellProps {
  notes: string | null | undefined;
  maxLength?: number;
  className?: string;
  title?: string;
}

export function NotesCell({
  notes,
  maxLength = 28,
  className,
  title = "Attendance Note",
}: NotesCellProps) {
  if (!notes || notes.trim() === "") {
    return <span className="text-muted-foreground">-</span>;
  }

  const cleanNotes = notes.trim();
  const isLong = cleanNotes.length > maxLength;

  if (!isLong) {
    return (
      <span className={cn("text-muted-foreground block", className)}>{cleanNotes}</span>
    );
  }

  return (
    <Popover>
      <PopoverTrigger
        className={cn(
          "group inline-flex items-center gap-1.5 text-left text-xs cursor-pointer select-none rounded-md px-1.5 py-0.5 -mx-1.5 transition-colors",
          "hover:bg-muted/80 hover:text-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring",
          className
        )}
      >
        <span className="truncate max-w-44 text-muted-foreground group-hover:text-foreground transition-colors">
          {cleanNotes}
        </span>
        <span className="shrink-0 text-[10px] font-medium text-primary/80 group-hover:text-primary transition-colors underline underline-offset-2">
          more
        </span>
      </PopoverTrigger>

      <PopoverContent
        side="top"
        align="start"
        sideOffset={6}
        className="w-80 p-3.5 shadow-lg border border-border/80 bg-popover rounded-xl"
      >
        <PopoverHeader className="flex flex-row items-center gap-1.5 pb-2 border-b border-border/40">
          <FileText className="size-3.5 text-primary shrink-0" />
          <PopoverTitle className="text-xs font-semibold text-foreground">
            {title}
          </PopoverTitle>
        </PopoverHeader>

        <div className="pt-2.5 max-h-56 overflow-y-auto pr-1">
          <p className="text-xs leading-relaxed text-foreground/90 whitespace-pre-wrap wrap-break-word select-text font-normal">
            {cleanNotes}
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
