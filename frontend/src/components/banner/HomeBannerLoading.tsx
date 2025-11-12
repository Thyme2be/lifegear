// src/components/banner/HomeBannerLoading.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";
import BannerShell from "./BannerShell";

export default function HomeBannerLoading() {
  return (
    <BannerShell showDots>
      <Skeleton className="absolute inset-0" />
    </BannerShell>
  );
}
