// src/components/HomeActivityThumbs.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { apiRoutes } from "@/lib/apiRoutes";
import type { ActivityThumbnailResponse } from "@/types/activities";
// ⬇️ ลบ axios ที่ไม่ได้ใช้ (กัน ESLint อื่น ๆ โผล่)
// import axios, { AxiosError } from "axios";

type ServerError = { message?: string; detail?: string; error?: string };

type Props = {
  limit?: number;          // จำกัดจำนวนรูป (เช่น 6 หรือ 9)
  className?: string;      // ใส่คลาสของกริดจากภายนอกได้
};

function getServerMessage(data: unknown): string | undefined {
  if (data && typeof data === "object") {
    const d = data as ServerError;
    return d.message || d.detail || d.error;
  }
  return undefined;
}

// ⬇️ type guard: ข้อมูล 1 ชิ้นต้องมี id/title เป็น string
function isThumb(x: unknown): x is ActivityThumbnailResponse {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.id === "string" && typeof o.title === "string";
}

function resolveImageUrl(path?: string | null) {
  if (!path) return "/fallback-activity.png";
  if (/^https?:\/\//i.test(path)) return path;
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
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const raw: unknown = await res.json();
        // ⬇️ validate ให้เป็น array ของ ActivityThumbnailResponse
        const data: ActivityThumbnailResponse[] = Array.isArray(raw)
          ? raw.filter(isThumb)
          : [];
        if (alive) setItems(data);
      } catch (e: unknown) { // ⬅️ แทน any ด้วย unknown
        if (!alive) return;
        const msg =
          (e instanceof Error && e.message) ||
          getServerMessage(e) ||
          "โหลดข้อมูลไม่สำเร็จ";
        setError(msg);
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

  // ⬇️ ทำ index สำหรับ skeleton ให้เป็น number[] (เลี่ยง any จาก Array.from แบบเปล่า)
  const skeletonIndices = useMemo(
    () => Array.from({ length: Math.min(limit, 9) }, (_, i) => i),
    [limit]
  );

  return (
    <section aria-label="กิจกรรมทั้งหมด (รูปตัวอย่าง)" className="max-w-6xl mx-auto px-4">
      <h2 className="heading2 text-main text-center mb-4">กิจกรรมทั้งหมด</h2>

      {loading && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {skeletonIndices.map((i) => (
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
