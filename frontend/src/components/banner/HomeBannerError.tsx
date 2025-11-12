// src/components/banner/HomeBannerError.tsx
"use client";

import ErrorBox from "@/components/ui/ErrorBox";
import BannerShell from "./BannerShell";

export default function HomeBannerError({ message, onRetry }: {message?: string; onRetry?: () => void;}) {
  return (
    <>
      <BannerShell>
        <div className="absolute inset-0 bg-neutral-100" />
      </BannerShell>
      <section className="w-full max-w-6xl mx-auto px-3 sm:px-4">
        <ErrorBox message={message ?? "เกิดข้อผิดพลาดในการโหลดรูปกิจกรรม"} onRetry={onRetry} />
      </section>
    </>
  );
}
