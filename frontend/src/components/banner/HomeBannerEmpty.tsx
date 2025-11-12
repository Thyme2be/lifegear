// src/components/banner/HomeBannerEmpty.tsx
"use client";

import BannerShell from "./BannerShell";

export default function HomeBannerEmpty() {
  return (
    <BannerShell>
      <div className="absolute inset-0 bg-neutral-100" />
    </BannerShell>
  );
}
