// src/components/RecycleBinWidget.tsx
"use client";
import * as React from "react";
import { formatTimeThaiFromIso } from "@/lib/datetime";
import type { RemovedEntry } from "@/lib/removed-ids"; // ✅ ใช้ type กลาง

type Props = {
  entries: RemovedEntry[];
  onRestoreOne: (id: string) => void;
  onRestoreAll: () => void;
  loading?: boolean;
  className?: string;
  title?: string;
  emptyHint?: string;

  show?: boolean;                 // controlled
  onToggle?: (v: boolean) => void;

  maxHeight?: number | string;
};

function cx(...parts: Array<string | false | undefined>) {
  return parts.filter(Boolean).join(" ");
}

const EntryRow = React.memo(function EntryRow({
  e,
  onRestoreOne,
}: {
  e: RemovedEntry;
  onRestoreOne: (id: string) => void;
}) {
  const deletedAtText = React.useMemo(() => {
    if (!e.deletedAt) return null;
    try {
      return formatTimeThaiFromIso(new Date(e.deletedAt).toISOString());
    } catch {
      return null;
    }
  }, [e.deletedAt]);

  return (
    <li className="flex items-center justify-between gap-2">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium">{e.title ?? e.id}</p>
        <div className="text-xs text-gray-500">
          {e.kind ? <span>ประเภท: {e.kind}</span> : null}
          {deletedAtText ? <span className="ml-2">ลบเมื่อ: {deletedAtText}</span> : null}
        </div>
      </div>
      <button
        type="button"
        className="text-sm px-2 py-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
        onClick={() => onRestoreOne(e.id)}
        aria-label={`กู้คืน ${e.title ?? e.id}`}
      >
        กู้คืน
      </button>
    </li>
  );
});

export default function RecycleBinWidget({
  entries,
  onRestoreOne,
  onRestoreAll,
  loading = false,
  className,
  title = "แสดงรายการที่ถูกลบ",
  emptyHint = "ไม่มีรายการที่ถูกลบ (รายการที่ไม่ได้กู้คืนจะถูกลบอัตโนมัติภายใน 1 วัน)",
  show,
  onToggle,
  maxHeight = 256,
}: Props) {
  const [internalShow, setInternalShow] = React.useState<boolean>(false);
  const isControlled = typeof onToggle === "function";
  const expanded = isControlled ? !!show : internalShow;

  const handleToggle = React.useCallback(() => {
    if (isControlled) onToggle!(!expanded);
    else setInternalShow((v) => !v);
  }, [expanded, isControlled, onToggle]);

  const listStyle: React.CSSProperties = React.useMemo(
    () => ({ maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : String(maxHeight) }),
    [maxHeight]
  );

  const panelId = "recycle-bin-panel";
  const btnId = "recycle-bin-toggle";

  return (
    <aside className={cx(className)}>
      <div className="shadow-lg rounded-xl bg-white border min-w-72">
        <button
          id={btnId}
          type="button"
          className="w-full flex items-center justify-between px-4 py-2 rounded-t-xl cursor-pointer"
          onClick={handleToggle}
          aria-expanded={expanded}
          aria-controls={panelId}
        >
          <span className="font-semibold">{title}</span>
          <span className="inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full text-xs bg-main text-white">
            {entries.length}
          </span>
        </button>

        {expanded && (
          <div id={panelId} role="region" aria-labelledby={btnId} className="p-3 border-t">
            {loading ? (
              <p className="text-sm text-gray-500" aria-live="polite">กำลังโหลด…</p>
            ) : entries.length === 0 ? (
              <p className="text-sm text-gray-500" aria-live="polite">{emptyHint}</p>
            ) : (
              <>
                <ul className="overflow-auto space-y-2" style={listStyle} role="list">
                  {entries.map((e) => (
                    <EntryRow key={e.id} e={e} onRestoreOne={onRestoreOne} />
                  ))}
                </ul>
                <button
                  type="button"
                  className="mt-3 w-full text-sm px-3 py-2 rounded-md bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 cursor-pointer"
                  onClick={onRestoreAll}
                >
                  กู้คืนทั้งหมด
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
