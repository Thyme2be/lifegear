"use client";

import dynamic from "next/dynamic";

const BannerSlider = dynamic(() => import("./BannerSlider"), { ssr: false });

export default function BannerSliderWrapper() {
  return <BannerSlider />;
}
