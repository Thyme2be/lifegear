// src/components/HomeActivityThumbs.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiRoutes } from "@/lib/apiRoutes";
import type { ActivityThumbnailResponse } from "@/types/activities";

type Props = {
  limit?: number;          // จำกัดจำนวนรูป (เช่น 6 หรือ 9)
  className?: string;      // ใส่คลาสของกริดจากภายนอกได้
};

function resolveImageUrl(path?: string | null) {
  if (!path) return "/fallback-activity.png"; // ← ใส่รูป fallback ใน public
  // ถ้า backend ส่งมาเป็น absolute แล้ว ก็ใช้เลย
  if (/^https?:\/\//i.test(path)) return path;
  // กรณีส่งเป็น relative เช่น "/media/xxx.jpg"
  const base = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") || "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

export default function HomeActivityThumbs({ limit = 9, className = "" }: Props) {
  const [items, setItems] = useState<ActivityThumbnailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const res = await fetch(apiRoutes.getAllActivitiesThumbnails, {
          credentials: "include",
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: ActivityThumbnailResponse[] = await res.json();
        if (alive) setItems(Array.isArray(data) ? data : []);
      } catch (e: any) {
        if (alive) setError(e?.message ?? "โหลดข้อมูลไม่สำเร็จ");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => { alive = false; };
  }, []);

  const list = useMemo(
    () => (limit ? items.slice(0, limit) : items),
    [items, limit]
  );

  return (
    <section aria-label="กิจกรรมทั้งหมด (รูปตัวอย่าง)" className="max-w-6xl mx-auto px-4">
      {/* หัวข้อส่วนนี้ (ถ้าอยากซ่อน ให้ลบ 2 บรรทัดนี้ได้) */}
      <h2 className="heading2 text-main text-center mb-4">กิจกรรมทั้งหมด</h2>

      {/* สถานะโหลด/ผิดพลาด */}
      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {Array.from({ length: Math.min(limit, 9) }).map((_, i) => (
            <div
              key={i}
              className="relative aspect-[4/3] rounded-2xl bg-gray-200 animate-pulse"
              aria-hidden
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <p role="alert" className="text-center text-red-600 bg-red-50 p-3 rounded-lg">
          {error}
        </p>
      )}

      {!loading && !error && list.length === 0 && (
        <p className="text-center text-gray-500">ยังไม่มีกิจกรรม</p>
      )}

      {!loading && !error && list.length > 0 && (
        <div
          className={[
            "grid grid-cols-2 sm:grid-cols-3 gap-4",
            className,
          ].filter(Boolean).join(" ")}
        >
          {list.map((a) => {
            const img = resolveImageUrl(a.image_path);
            return (
              <Link
                key={a.id}
                href={`/activity/${encodeURIComponent(a.id)}`}
                className="group block relative rounded-2xl overflow-hidden shadow hover:shadow-lg transition"
                aria-label={`ไปที่กิจกรรม: ${a.title}`}
              >
                <div className="relative aspect-[4/3]">
                  <Image
                    src={img}
                    alt={a.title}
                    fill
                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px"
                    className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
                  />
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
