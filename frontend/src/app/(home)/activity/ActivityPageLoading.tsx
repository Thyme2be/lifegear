// src/app/(home)/activity/loading.tsx
"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityPageLoading() {
  return (
    <main
      className="min-h-screen bg-primary px-4 sm:px-6 lg:px-8 py-6"
      aria-busy="true"
      aria-live="polite"
    >
      <div className="w-full max-w-7xl mx-auto">
        {/* ===== Header ===== */}
        <header className="mb-8 mt-2 text-center">
          <Skeleton className="h-10 w-2/3 mx-auto rounded-xl" />
        </header>

        {/* ===== SearchBox (บนสุด แบบบาร์เดียว) ===== */}
        <section className="mb-6">
          <div className="bg-white rounded-4xl shadow p-4">
            {/* ช่องค้นหา */}
            <Skeleton className="h-10 w-full rounded-full" />
            {/* ชิปตัวกรองเวลา */}
            <div className="mt-4 flex gap-3 flex-wrap">
              <Skeleton className="h-8 w-20 rounded-full" />
              <Skeleton className="h-8 w-24 rounded-full" />
            </div>
            {/* ชิปหมวดหมู่ (ย่อ) */}
            <div className="mt-3 flex gap-2 flex-wrap">
              <Skeleton className="h-7 w-20 rounded-full" />
              <Skeleton className="h-7 w-24 rounded-full" />
              <Skeleton className="h-7 w-16 rounded-full" />
              <Skeleton className="h-7 w-28 rounded-full" />
            </div>
          </div>
        </section>

        {/* ===== List (การ์ดกิจกรรม) ===== */}
        <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <article
              key={i}
              className="rounded-4xl overflow-hidden bg-white shadow-lg"
            >
              <Skeleton className="aspect-[16/9] w-full" />
              <div className="p-4 space-y-3">
                <Skeleton className="h-5 w-3/4 rounded-md" />   {/* ชื่อกิจกรรม */}
                <Skeleton className="h-4 w-1/2 rounded-md" />   {/* วันที่ */}
                <div className="flex gap-3">
                  <Skeleton className="h-10 w-28 rounded-full" /> {/* ปุ่ม Add */}
                  <Skeleton className="h-10 w-32 rounded-full" /> {/* ปุ่ม อ่านเพิ่มเติม */}
                </div>
              </div>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
