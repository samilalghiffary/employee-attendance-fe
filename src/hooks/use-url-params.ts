"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export const PAGE_SIZES = [10, 20, 50] as const;

export function useUrlParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = useCallback(
    (key: string) => searchParams.get(key) ?? undefined,
    [searchParams]
  );

  const page = Math.max(1, Number(searchParams.get("page")) || 1);
  const limitParam = Number(searchParams.get("limit"));
  const limit = (PAGE_SIZES as readonly number[]).includes(limitParam) ? limitParam : 10;

  const sortBy = searchParams.get("sortBy") ?? undefined;
  const sortOrderParam = searchParams.get("sortOrder");
  const sortOrder: "asc" | "desc" | undefined =
    sortOrderParam === "asc" || sortOrderParam === "desc"
      ? (sortOrderParam as "asc" | "desc")
      : undefined;

  const update = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value) params.set(key, value);
        else params.delete(key);
      });
      const qs = params.toString();
      router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams]
  );

  const setFilters = useCallback(
    (updates: Record<string, string | undefined>) =>
      update({ ...updates, page: undefined }),
    [update]
  );

  const setSorting = useCallback(
    (field?: string, order?: "asc" | "desc") => {
      update({
        sortBy: field,
        sortOrder: order,
        page: undefined,
      });
    },
    [update]
  );

  const hrefForPage = useCallback(
    (target: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(target));
      return `${pathname}?${params.toString()}`;
    },
    [pathname, searchParams]
  );

  const setPage = useCallback(
    (target: number) => update({ page: String(target) }),
    [update]
  );

  return {
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
  };
}
