// src/components/ActivityList.tsx
"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ActivityThumbnailResponse } from "@/types/activities";
import { toastSuccess, toastError } from "@/lib/toast";
import AddToLifeButton from "@/components/AddToLifeButton";
import MoreInfoButton from "@/components/ui/MoreInfoButton";

interface ActivityListProps {
  activity: ActivityThumbnailResponse & { slug?: string };
  /** แหล่งที่มา: "mine" = ตารางบน, "reco" = ตารางล่าง (ค่าเริ่มต้น) */
  source?: "mine" | "reco";
}

function buildActivityPath(a: ActivityThumbnailResponse & { slug?: string }) {
  return a.slug ? `/activity/${a.slug}` : `/activity/${a.id}`;
}

export default function ActivityList({
  activity,
  source = "reco",
}: ActivityListProps) {
  const [imgSrc, setImgSrc] = useState(
    activity.image_path ?? "/fallback_activity.png"
  );

  const href = useMemo(() => buildActivityPath(activity), [activity]);
  const hrefWithSrc = useMemo(
    () => (source === "mine" ? `${href}?src=mine` : href),
    [href, source]
  );

  const alt = useMemo(
    () =>
      activity.title
        ? `${activity.title} • ${activity.category}`
        : `กิจกรรม ${activity.id} • ${activity.category}`,
    [activity]
  );

  return (
    <article className="group block w-full">
      <div className="bg-white rounded-4xl shadow-lg/15 p-4 transition-transform duration-300 hover:scale-[1.01]">
        {/* รูป: ลิงก์ไปหน้ารายละเอียด โดยติด ?src=mine ตาม context */}
        <Link
          href={hrefWithSrc}
          aria-label={`เปิดอ่านรายละเอียด: ${activity.title ?? activity.id}`}
          className="relative aspect-[16/9] w-full overflow-hidden rounded-4xl shadow-xl block"
          prefetch={false}
        >
          <Image
            src={imgSrc}
            alt={alt}
            width={800}
            height={400}
            className="w-full h-full rounded-4xl shadow-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            onError={() => setImgSrc("/fallback_activity.png")}
            priority={false}
          />
        </Link>

        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between mt-4 gap-3">
          <div className="text-gray-800">
            <p className="text-xl font-semibold line-clamp-2">
              {activity.title}
            </p>
            <p className="text-lg text-gray-600">
              วันที่{" "}
              {activity.start_at
                ? new Date(activity.start_at).toLocaleDateString("th-TH", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : "ไม่ระบุ"}
            </p>
          </div>

          {/* ปุ่ม: ไม่ครอบการ์ดด้วย Link อีกต่อไป */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <AddToLifeButton
              activityId={activity.id}
              startAt={activity.start_at ?? undefined}
              endAt={activity.end_at ?? undefined}
              // ถ้ามาจาก mine ให้ปุ่มกดไม่ได้
              forceDisabled={source === "mine"}
              onDone={(res) => {
                if (!res.ok) {
                  const msg =
                    typeof res.error === "string" && res.error.trim()
                      ? res.error
                      : "เพิ่มไม่สำเร็จ ลองใหม่อีกครั้ง";
                  toastError(msg);
                } else {
                  toastSuccess("เพิ่มลงในตารางชีวิตสำเร็จ!");
                }
              }}
            />
            <MoreInfoButton href={hrefWithSrc} mode="text">
              อ่านเพิ่มเติม
            </MoreInfoButton>
          </div>
        </div>
      </div>
    </article>
  );
}
