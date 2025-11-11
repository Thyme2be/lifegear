"use client";

import React, { useState } from "react";
import type { DailyRow as Row } from "@/types/viewmodels";
import DailyActionCell from "@/components/DailyActionCell";
import {
  formatThaiNoWeekday,
  formatThaiRangeFromISO,
  normalizeIsoToBangkok,
} from "@/lib/datetime";
import { isSameYmd } from "@/lib/datetime";

type Props = {
  row: Row;
  bgColor: string;
  onDelete: (id: string) => void;
  enableDelete?: boolean;
};

export default function MobileRow({
  row,
  bgColor,
  onDelete,
  enableDelete = true,
}: Props) {
  const [open, setOpen] = useState(false);
  const panelId = `row-panel-${row.id}`;
  const btnId = `row-btn-${row.id}`;

  const s = new Date(normalizeIsoToBangkok(row.startISO));
  const e = new Date(normalizeIsoToBangkok(row.endISO || row.startISO));
  const dateLabel =
    row.dateLabel ??
    (isSameYmd(s, e)
      ? formatThaiNoWeekday(s)
      : formatThaiRangeFromISO(row.startISO, row.endISO || row.startISO));

  return (
    <div className={`border rounded-md mb-3 overflow-hidden sm:hidden ${bgColor}`}>
      <button
        id={btnId}
        className="w-full px-4 py-3 bg-opacity-80 flex justify-between items-center font-semibold"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
      >
        <span className="truncate">{row.title}</span>
        <span className="text-xl text-gray-700">{open ? "▴" : "▾"}</span>
      </button>

      {open && (
        <div
          id={panelId}
          role="region"
          aria-labelledby={btnId}
          className="px-4 py-2 bg-white space-y-2"
        >
          <p>
            <span className="font-semibold">วัน: </span>
            {dateLabel}
          </p>
          <p>
            <span className="font-semibold">เวลา: </span>
            {row.time}
          </p>

          <DailyActionCell
            row={row}
            source="mine"
            onDelete={onDelete}
            enableDelete={enableDelete}
            size="sm"
            align="start"
          />
        </div>
      )}
    </div>
  );
}
