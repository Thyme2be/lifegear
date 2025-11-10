// src/hooks/useDateQuery.ts
"use client";

import { useMemo, useCallback } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { toYmdLocal } from "@/lib/datetime";

export function useDateQuery(now: Date) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const dateStr = useMemo(() => {
    const qs = (searchParams?.get("date") || "").trim();
    return /^\d{4}-\d{2}-\d{2}$/.test(qs) ? qs : toYmdLocal(now);
  }, [searchParams, now]);

  const setDateQuery = useCallback(
    (nextYmd: string) => {
      const params = new URLSearchParams(searchParams?.toString() ?? "");
      params.set("date", nextYmd);
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [router, pathname, searchParams]
  );

  return { dateStr, setDateQuery };
}
