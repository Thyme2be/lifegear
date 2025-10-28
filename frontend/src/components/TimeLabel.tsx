"use client";
import React, { useMemo } from "react";
import { formatThaiDateLabel } from "@/lib/datetime";
import { useNow } from "@/hooks/useNow";

type Props = {
  showClock?: boolean;
  className?: string;
};

export default function TimeLabel({ showClock = true, className }: Props) {
  const now = useNow(1000);
  const text = useMemo(() => {
    const timeStr = showClock
      ? now.toLocaleTimeString("th-TH", { hour12: false, hour: "2-digit", minute: "2-digit", second: "2-digit" })
      : "";
    return showClock ? `${formatThaiDateLabel(now)} • ${timeStr}` : formatThaiDateLabel(now);
  }, [now, showClock]);

  return <span className={className}>{text}</span>;
}
