// src/components/TimeLabel.tsx
"use client";
import React, { useMemo } from "react";
import { formatThaiDateLabel, parseYmd } from "@/lib/datetime";
import { useNow } from "@/hooks/useNow";

type Props = {
  /** ถ้าส่งมา จะใช้ค่านี้เป็น "วันที่" แทน now */
  dateYmd?: string;
  /** แสดงนาฬิกาเวลาปัจจุบันต่อท้ายด้วยจุด •  */
  showClock?: boolean;
  className?: string;
};

export default function TimeLabel({ dateYmd, showClock = true, className }: Props) {
  const now = useNow(1000);

  const text = useMemo(() => {
    // วันที่: ใช้ dateYmd (ถ้ามี) ไม่งั้นใช้ now
    const baseDate = dateYmd ? parseYmd(dateYmd) : now;
    const dateLabel = formatThaiDateLabel(baseDate);

    if (!showClock) return dateLabel;

    const timeStr = now.toLocaleTimeString("th-TH", {
      hour12: false,
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    // รูปแบบเหมือนในภาพ: วันที่ • HH:MM:SS
    return `วัน${dateLabel}`;
  }, [dateYmd, now, showClock]);

  return <span className={className}>{text}</span>;
}
