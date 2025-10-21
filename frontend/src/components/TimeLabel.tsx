// src/components/TimeLabel.tsx
"use client";

import React, { useMemo } from "react";
import { formatThaiDateLabel } from "@/lib/datetime";
import { useNow } from "@/hooks/useNow";

type Props = {
  showClock?: boolean;       // default true -> แสดงเวลา hh:mm:ss
  className?: string;
};

export default function TimeLabel({ showClock = true, className }: Props) {
  const now = useNow(1000);
  const text = useMemo(() => {
    const timeStr = showClock
      ? now.toLocaleTimeString("th-TH", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
      : "";
    return showClock ? `${formatThaiDateLabel(now)} • ${timeStr}` : formatThaiDateLabel(now);
  }, [now, showClock]);

  return <span className={className}>{text}</span>;
}
