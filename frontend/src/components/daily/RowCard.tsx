"use client";

import React from "react";
import type { DailyRow as Row } from "@/types/viewmodels";
import DailyActionCell from "@/components/DailyActionCell";
import { formatThaiRangeFromISO } from "@/lib/datetime";
import { rowBg } from "./rowBg";

type Props = {
  row: Row;
  onDelete?: (id: string) => void;
  enableDelete?: boolean;
};

export default function RowCard({ row, onDelete, enableDelete = true }: Props) {
  const bg = rowBg(row.kind);
  const scheduleLabel = formatThaiRangeFromISO(row.startISO, row.endISO);

  return (
    <div
      className={`grid grid-cols-4 items-center rounded-md ${bg} hover:brightness-105 transition`}
    >
      <div
        className="p-3 text-center font-medium truncate"
        title={row.title}
      >
        {row.title}
      </div>
      <div className="p-3 text-center">
        <time>{scheduleLabel}</time>
      </div>
      <div className="p-3 text-center">
        <time>{row.time}</time>
      </div>
      <div className="p-3">
        <DailyActionCell
          row={row}
          source="mine"
          onDelete={onDelete}
          enableDelete={enableDelete}
          size="sm"
          align="center"
        />
      </div>
    </div>
  );
}
