import { Skeleton } from "@/components/ui/skeleton";
import React from "react";

export default function SubActivityLoading() {
  return (
    <section
      className="max-w-3xl mx-auto bg-white rounded-[28px] shadow-xl p-6 sm:p-10"
      aria-busy="true"
      aria-live="polite"
    >
      {/* ===== Title (bar ความสูงใกล้หัวข้อจริง) ===== */}
      <Skeleton className="h-8 w-2/3 mb-6 rounded-xl" />

      {/* ===== Image ===== */}
      <div className="mb-8">
        <Skeleton className="aspect-[16/9] w-full rounded-3xl" />
      </div>

      {/* ===== Description (2 บรรทัด) ===== */}
      <div className="space-y-3 mb-8 text-center">
        <Skeleton className="h-4 w-2/3 mx-auto" />
        <Skeleton className="h-4 w-1/3 mx-auto" />
      </div>

      {/* ===== Info Rows (3 แถบ) ===== */}
      <div className="space-y-3 mb-10">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-4 w-1/2" />
      </div>

      {/* ===== Button ===== */}
      <div className="flex justify-end">
        <Skeleton className="h-10 w-48 rounded-full" />
      </div>
    </section>
  );
}
