// src/components/BannerSliderWrapper.tsx
"use client";

import dynamic from "next/dynamic";
import type { BannerSliderProps } from "./BannerSlider";

// ✅ ใช้ generic เป็น BannerSliderProps และ .then(m => m.default)
const BannerSlider = dynamic<BannerSliderProps>(
  () => import("./BannerSlider").then((m) => m.default),
  { ssr: false }
);

export default function BannerSliderWrapper() {
  return <BannerSlider source="mine" />;
}
