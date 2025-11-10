// src/components/ActivityList.tsx
"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import type { ActivityThumbnailResponse } from "@/types/activities";
import { toastSuccess, toastError } from "@/lib/toast";
import AddToLifeButton from "@/components/AddToLifeButton";

interface ActivityListProps {
  activity: ActivityThumbnailResponse & { slug?: string };
}

function buildActivityPath(a: ActivityThumbnailResponse & { slug?: string }) {
  return a.slug ? `/activity/${a.slug}` : `/activity/${a.id}`;
}

export default function ActivityList({ activity }: ActivityListProps) {
  const [imgSrc, setImgSrc] = useState(
    activity.image_path ?? "/fallback_activity.png"
  );

  const href = useMemo(() => buildActivityPath(activity), [activity]);
  const alt = useMemo(
    () =>
      activity.title
        ? `${activity.title} • ${activity.category}`
        : `กิจกรรม ${activity.id} • ${activity.category}`,
    [activity]
  );

  return (
    <Link
      href={href}
      className="group block w-full"
      aria-label={`เปิดอ่านรายละเอียด: ${activity.title ?? activity.id}`}
    >
      <div className="bg-white rounded-4xl shadow-lg/15 p-4 transition-transform duration-300 hover:scale-[1.01]">
        {/* รูป: 16:9 + cover */}
        <div className="relative aspect-[16/9] w-full overflow-hidden rounded-4xl shadow-xl">
          <Image
            src={imgSrc}
            alt={alt}
            width={800}
            height={400}
            className="w-full sm:w-auto rounded-4xl shadow-xl object-cover transition-transform duration-300 group-hover:scale-[1.02]"
            onError={() => setImgSrc("/fallback_activity.png")}
            priority={false}
          />
        </div>

        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between mt-4">
          <div className="text-gray-800 mb-2 sm:mb-0 ">
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

          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            {/* ปุ่ม AddToLife (กัน Link นำทางด้วย preventDefault/stopPropagation) */}
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
              className="w-full sm:w-auto"
            >
              <AddToLifeButton
                activityId={activity.id}
                startAt={activity.start_at ?? undefined}
                endAt={activity.end_at ?? undefined}
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
            </div>

            {/* ปุ่มอ่านเพิ่มเติม */}
            <div
              className="flex items-center justify-center
               w-full sm:w-auto min-h-[48px] px-5 py-2.5 
               rounded-full shadow-md font-bold 
               bg-bf-btn text-white hover:bg-btn-hover 
               transition transform hover:scale-[1.03] 
               active:scale-[0.98] cursor-pointer"
            >
              อ่านเพิ่มเติม
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
