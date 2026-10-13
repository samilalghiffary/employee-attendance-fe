import type { ColumnDef } from "@tanstack/react-table";
import { format, parseISO } from "date-fns";
import { MoreHorizontal, Pencil, ShieldCheck, UserCheck, UserX } from "lucide-react";

import { DataTableColumnHeader } from "@/components/table";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { getInitials } from "@/lib/utils";
import type { UserItem } from "@/types/user";

export function getUsersColumns({
  currentUserId,
  onEdit,
  onToggleStatus,
}: {
  currentUserId?: string;
  onEdit: (user: UserItem) => void;
  onToggleStatus: (user: UserItem) => void;
}): ColumnDef<UserItem>[] {
  return [
    {
      accessorKey: "name",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Employee" />,
      cell: ({ row }) => {
        const user = row.original;
        const isSelf = user.id === currentUserId;

        return (
          <div className="flex items-center gap-3">
            <Avatar size="sm">
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-semibold">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="grid leading-tight">
              <span className="font-medium flex items-center gap-1.5">
                {user.name}
                {isSelf && (
                  <Badge variant="outline" className="text-[10px] px-1 py-0">
                    You
                  </Badge>
                )}
              </span>
              <span className="text-xs text-muted-foreground">{user.email}</span>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Role" />,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
            {user.role === "ADMIN" && <ShieldCheck className="size-3" />}
            {user.role === "ADMIN" ? "Administrator" : "Employee"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "isActive",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
      cell: ({ row }) => {
        const user = row.original;
        return (
          <Badge variant={user.isActive ? "outline" : "destructive"}>
            {user.isActive ? "Active" : "Inactive"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => <DataTableColumnHeader column={column} title="Joined" />,
      cell: ({ row }) => (
        <span className="whitespace-nowrap text-muted-foreground">
          {format(parseISO(row.original.createdAt), "MMM d, yyyy")}
        </span>
      ),
    },
    {
      id: "actions",
      header: () => <span className="sr-only">Actions</span>,
      cell: ({ row }) => {
        const user = row.original;
        const isSelf = user.id === currentUserId;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger
              render={
                <Button
                  size="icon-sm"
                  variant="ghost"
                  id={`user-actions-${user.id}`}
                  aria-label={`Actions for ${user.name}`}
                />
              }
            >
              <MoreHorizontal className="size-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-40">
              <DropdownMenuItem onClick={() => onEdit(user)}>
                <Pencil className="size-4" /> Edit
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                disabled={isSelf}
                onClick={() => onToggleStatus(user)}
                variant={user.isActive ? "destructive" : "default"}
              >
                {user.isActive ? (
                  <>
                    <UserX className="size-4" /> Deactivate
                  </>
                ) : (
                  <>
                    <UserCheck className="size-4" /> Activate
                  </>
                )}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
