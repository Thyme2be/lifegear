"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { toast, ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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

  const handleAddToSchedule = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();

    // Toast แสดงข้อความสำเร็จ
    toast.success("เพิ่มลงในตารางชีวิตสำเร็จ!", {
      position: "top-center",
      autoClose: 2000,
      theme: "colored",
      transition: Bounce,
    });
  };

  return (
    <Link
      href={href}
      className="group block w-full"
      aria-label={`เปิดอ่านรายละเอียด: ${activity.title ?? activity.id}`}
    >
      <div className="bg-white rounded-4xl shadow-lg/15 p-4 transition-transform duration-300 hover:scale-[1.01]">
        <ToastContainer />

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

        {/* แถวข้อมูล + ปุ่ม */}
        <div className="w-full flex flex-col sm:flex-row sm:items-center justify-between mt-4">
          {/* ข้อมูลกิจกรรม */}
          <div className="text-gray-800 mb-2 sm:mb-0 ">
            <p className="text-xl font-semibold line-clamp-2">{activity.title}</p>
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

          {/* ปุ่ม */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto shrink-0">
            <button
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full shadow-md font-bold 
            bg-bf-btn text-white hover:bg-btn-hover transition transform hover:scale-[1.03] 
            active:scale-[0.98] cursor-pointer"
            onClick={handleAddToSchedule}
          >
            เพิ่มลงในตารางชีวิต
          </button>
            <span className="w-full sm:w-auto text-center px-5 py-2.5 rounded-full shadow-md font-bold 
            bg-bf-btn text-white hover:bg-btn-hover transition transform hover:scale-[1.03] 
            active:scale-[0.98] cursor-pointer">
              อ่านเพิ่มเติม
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
