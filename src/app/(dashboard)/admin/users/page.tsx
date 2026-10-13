"use client";

import { UserPlus } from "lucide-react";
import { Suspense, useEffect, useState } from "react";

import { UserFormDialog, UserStatusDialog } from "@/components/admin";
import { PageHeader } from "@/components/layout";
import { Button } from "@/components/ui/button";
import { useAdminUsers, useUpdateUserStatus } from "@/hooks/use-admin";
import { useUrlParams } from "@/hooks/use-url-params";
import { useAuthStore } from "@/stores/use-auth-store";
import type { UserRole } from "@/types/auth";
import type { UserItem } from "@/types/user";
import { DataTable } from "./data-table";

function UsersContent() {
  const {
    get,
    page,
    limit,
    sortBy,
    sortOrder,
    update,
    setFilters,
    setSorting,
    setPage,
    hrefForPage,
  } = useUrlParams();
  const currentUserId = useAuthStore((s) => s.user?.id);

  const searchParam = get("search") ?? "";
  const role = get("role") as UserRole | undefined;
  const isActiveParam = get("isActive");

  const [search, setSearch] = useState(searchParam);
  const [formOpen, setFormOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<UserItem | null>(null);
  const [statusTarget, setStatusTarget] = useState<UserItem | null>(null);

  useEffect(() => {
    if (search === searchParam) return;
    const timer = setTimeout(
      () => setFilters({ search: search.trim() || undefined }),
      400
    );
    return () => clearTimeout(timer);
  }, [search, searchParam, setFilters]);

  const { data, isLoading, isFetching, isError } = useAdminUsers({
    page,
    limit,
    search: searchParam || undefined,
    role,
    isActive: isActiveParam === undefined ? undefined : isActiveParam === "true",
    sortBy,
    sortOrder,
  });
  const updateStatus = useUpdateUserStatus();

  const users = data?.data ?? [];
  const hasFilters = Boolean(searchParam || role || isActiveParam);

  const openCreate = () => {
    setEditingUser(null);
    setFormOpen(true);
  };

  const openEdit = (user: UserItem) => {
    setEditingUser(user);
    setFormOpen(true);
  };

  const confirmStatusChange = async () => {
    if (!statusTarget) return;
    try {
      await updateStatus.mutateAsync({
        id: statusTarget.id,
        isActive: !statusTarget.isActive,
      });
    } finally {
      setStatusTarget(null);
    }
  };

  return (
    <div className="space-y-6 w-full">
      <PageHeader
        title="Employees"
        description="Manage employee accounts, roles, and access status."
        action={
          <Button id="add-employee-button" onClick={openCreate} className="w-fit gap-2">
            <UserPlus className="size-4" /> Add Employee
          </Button>
        }
      />

      <DataTable
        users={users}
        sortBy={sortBy}
        isError={isError}
        sortOrder={sortOrder}
        isLoading={isLoading}
        onEditUser={openEdit}
        isFetching={isFetching}
        hasFilters={hasFilters}

        onSortingChange={setSorting}
        onSearchChange={setSearch}
        onFilterChange={setFilters}
        currentUserId={currentUserId}
        filters={{ search, role, isActiveParam, limit }}
        onToggleStatus={(user) => setStatusTarget(user)}
        onLimitChange={(lim) => update({ limit: String(lim), page: undefined })}
        pagination={{
          meta: data?.meta,
          itemLabel: "accounts",
          hrefForPage,
          onPageChange: setPage,
        }}
      />

      <UserFormDialog open={formOpen} onOpenChange={setFormOpen} user={editingUser} />

      <UserStatusDialog
        user={statusTarget}
        open={Boolean(statusTarget)}
        onConfirm={confirmStatusChange}
        isPending={updateStatus.isPending}
        onOpenChange={(o) => !o && setStatusTarget(null)}
      />
    </div>
  );
}

export default function AdminUsersPage() {
  return (
    <Suspense fallback={null}>
      <UsersContent />
    </Suspense>
  );
}
