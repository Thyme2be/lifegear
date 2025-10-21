// src/hooks/useNow.ts
"use client";

import { useEffect, useState } from "react";

export function useNow(tickMs = 1000) {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), tickMs);
    return () => clearInterval(t);
  }, [tickMs]);
  return now;
}
