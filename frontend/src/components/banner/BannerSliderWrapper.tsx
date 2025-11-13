"use client";

import dynamic from "next/dynamic";
import HomeBannerLoading from "@/components/banner/HomeBannerLoading";
import type { BannerSliderProps } from "./HomeBanner"

const BannerSlider = dynamic<BannerSliderProps>(
  () => import("./HomeBanner").then((m) => m.default),
  {
    ssr: false,                             
    loading: () => <HomeBannerLoading />     
  }
);

export default function BannerSliderWrapper() {
  return <BannerSlider source="mine" />;
}
