"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ActivityThumbnailResponse } from "@/types/activity";

interface ActivityListProps {
  activity: ActivityThumbnailResponse & { slug?: string };
}

function buildActivityPath(a: ActivityThumbnailResponse & { slug?: string }) {
  // ใช้ slug ถ้ามี, ไม่มีก็ตกกลับเป็น id
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
      {/* รูป: อัตราส่วนคงที่ 16:9 + fill เพื่อลด CLS */}
      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-4xl shadow-xl">
        <Image
          src={imgSrc}
          alt={alt}
          width={800}
          height={400}
          className="w-full sm:w-auto rounded-4xl shadow-xlobject-cover transition-transform duration-300 group-hover:scale-[1.02]"
          onError={() => setImgSrc("/fallback_activity.png")}
          priority={false}
        />
      </div>

      {/* ปุ่ม */}
      <div className="w-full flex justify-end mt-3">
        <span className="px-4 py-2 rounded-full shadow-md font-bold bg-[#B30000] text-white hover:bg-[#880000] transition">
          อ่านเพิ่มเติม
        </span>
      </div>
    </Link>
  );
}
