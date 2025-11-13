// src/hooks/useLocalIds.ts
"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import {
  readRemovedIds,
  readRemovedEntries,
  addRemovedEntry,
  removeRemovedId as _removeRemovedId,
  clearRemovedIds as _clearRemovedIds,
  purgeExpired,
  REMOVED_IDS_KEY,
} from "@/lib/removed-ids";

const ADDED_IDS_KEY = "lifgear:added-ids";

function readAddedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(ADDED_IDS_KEY) || "[]");
  } catch {
    return [];
  }
}

export function useAddedIds() {
  const [addedIds, setAddedIds] = useState<string[]>(() => readAddedIds());

  useEffect(() => {
    const onStorage = (e: StorageEvent) => {
      if (e.key === ADDED_IDS_KEY) setAddedIds(readAddedIds());
    };
    const onAdded = () => setAddedIds(readAddedIds());

    window.addEventListener("storage", onStorage);
    window.addEventListener("lifgear:activity-added", onAdded);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("lifgear:activity-added", onAdded);
    };
  }, []);

  return addedIds;
}

export function useRemovedBin(autoPurgeDays = 1) {
  const [removedIds, setRemovedIds] = useState<string[]>(() => readRemovedIds());
  const [removedEntries, setRemovedEntries] = useState(() => readRemovedEntries());
  const purgeIvRef = useRef<number | null>(null);

  const refetch = useCallback(() => {
    setRemovedIds(readRemovedIds());
    setRemovedEntries(readRemovedEntries());
  }, []);

  useEffect(() => {
    purgeExpired(autoPurgeDays);
    refetch();

    if (purgeIvRef.current) window.clearInterval(purgeIvRef.current);
    purgeIvRef.current = window.setInterval(() => {
      purgeExpired(autoPurgeDays);
      refetch();
    }, 15 * 60 * 1000);

    const onStorage = (e: StorageEvent) => {
      if (e.key === REMOVED_IDS_KEY) {
        purgeExpired(autoPurgeDays);
        refetch();
      }
    };
    window.addEventListener("storage", onStorage);

    return () => {
      if (purgeIvRef.current) window.clearInterval(purgeIvRef.current);
      window.removeEventListener("storage", onStorage);
    };
  }, [autoPurgeDays, refetch]);

  const handleDelete = useCallback(
    (id: string, title?: string, kind?: "class" | "activity") => {
      addRemovedEntry({ id, title, kind });
      refetch();
    },
    [refetch]
  );

  const restoreOne = useCallback((id: string) => {
    _removeRemovedId(id);
    refetch();
  }, [refetch]);

  const restoreAll = useCallback(() => {
    _clearRemovedIds();
    refetch();
  }, [refetch]);

  return { removedIds, removedEntries, handleDelete, restoreOne, restoreAll };
}
