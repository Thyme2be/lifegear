// src/components/RecycleBinWidget.tsx
"use client";
import * as React from "react";

export type RemovedEntry = {
  id: string;
  title?: string;
  kind?: "class" | "activity";
  deletedAt?: number;
};

type Props = {
  entries: RemovedEntry[];
  onRestoreOne: (id: string) => void;
  onRestoreAll: () => void;
  loading?: boolean;
  className?: string;
  title?: string;
  emptyHint?: string;

  // ✅ ใหม่
  show?: boolean;
  onToggle?: (v: boolean) => void;
};

export default function RecycleBinWidget({
  entries,
  onRestoreOne,
  onRestoreAll,
  loading = false,
  className,
  title = "แสดงรายการที่ถูกลบ",
  emptyHint = "ไม่มีรายการที่ถูกลบ (รายการที่ไม่ได้กู้คืนจะถูกลบอัตโนมัติภายใน 1 วัน)",
  show = false,
  onToggle,
}: Props) {
  return (
    <aside
      className={[className]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="shadow-lg rounded-xl bg-white border min-w-72">
        <button
          className="w-full flex items-center justify-between px-4 py-2 rounded-t-xl hover:bg-gray-50 cursor-pointer"
          onClick={() => onToggle?.(!show)}
          aria-expanded={show}
        >
          <span className="font-semibold">{title}</span>
          <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full text-xs bg-main text-white">
            {entries.length}
          </span>
        </button>

        {show && (
          <div className="p-3 border-t">
            {loading ? (
              <p className="text-sm text-gray-500">กำลังโหลด…</p>
            ) : entries.length === 0 ? (
              <p className="text-sm text-gray-500">{emptyHint}</p>
            ) : (
              <ul className="max-h-64 overflow-auto space-y-2">
                {entries.map((e) => (
                  <li
                    key={e.id}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium">
                        {e.title ?? e.id}
                      </p>
                      {e.kind && (
                        <p className="text-xs text-gray-500">
                          ประเภท: {e.kind}
                        </p>
                      )}
                    </div>
                    <button
                      className="text-sm px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                      onClick={() => onRestoreOne(e.id)}
                    >
                      กู้คืน
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {entries.length > 0 && (
              <button
                className="mt-3 w-full text-sm px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 cursor-pointer"
                onClick={onRestoreAll}
              >
                กู้คืนทั้งหมด
              </button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
