// app/(main)/activities/[activityId]/SubActivityClient.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";

type Props = { activityId: string };

// ใช้ชนิดข้อมูลเฉพาะที่เราต้องการจาก thumbnail
type Thumb = {
  id: string;
  title?: string;
  category?: string;
  image_path?: string | null;
  image_url?: string | null;
};

export default function SubActivityClient({ activityId }: Props) {
  const [thumb, setThumb] = useState<Thumb | null>(null);

  useEffect(() => {
    try {
      const key = `lg:lastActivityThumb:${activityId}`;
      const raw = sessionStorage.getItem(key);
      if (raw) setThumb(JSON.parse(raw));
    } catch {
      /* ignore */
    }
  }, [activityId]);

  const title = thumb?.title ?? "ชื่อกิจกรรม (Mock)";
  const imgSrc = thumb?.image_path || thumb?.image_url || "/fallback_activity.png";

  const mock = useMemo(
    () => ({
      quote:
        "ขอเชิญชวนเพื่อนๆ ทุกคน มาร่วมกิจกรรมวันไหว้ครู ร่วมแสดงความกตัญญูและส่งมอบรอยยิ้ม",
      dateText: "12 มิถุนายน 2568",
      timeText: "11.00 น.",
      locationText: "ณ ห้องวศ.308 คณะวิศวกรรมศาสตร์",
      contactText: "CodeHodeCodeTehCodeUntaraiCodeeyaaow",
    }),
    []
  );

  return (
    <main className="min-h-screen bg-[#F6F1E7] py-10 px-4">
      <section className="max-w-3xl mx-auto bg-white rounded-[28px] shadow-xl p-6 sm:p-10">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-[#730217] tracking-tight mb-6">
          กิจกรรม “{title}”
        </h1>

        <div className="relative aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.15)] mb-8">
          <Image
            src={imgSrc}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 896px"
            className="object-cover"
            priority
          />
        </div>

        <p className="text-center text-[#5B1414] text-lg sm:text-xl leading-relaxed mb-8">
          “{mock.quote}”
        </p>

        <div className="text-[#5B1414] space-y-3 mb-10">
          <p><b className="font-semibold">วันที่จัดกิจกรรม:</b> {mock.dateText}</p>
          <p><b className="font-semibold">เวลาที่จัดกิจกรรม:</b> {mock.timeText}</p>
          <p><b className="font-semibold">สถานที่จัดกิจกรรม:</b> {mock.locationText}</p>
          <p><b className="font-semibold">ติดต่อเพิ่มเติม:</b> {mock.contactText}</p>
          <p className="text-xs text-gray-400 pt-2">รหัสกิจกรรม: {activityId}</p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button className="px-6 py-3 rounded-full bg-[#B30000] hover:bg-[#880000] text-white font-bold shadow-md transition">
            เพิ่มลงในตารางชีวิต
          </button>
          <button className="px-6 py-3 rounded-full border-2 border-[#B30000] text-[#B30000] hover:bg-[#B30000] hover:text-white font-bold transition">
            รายละเอียดวิธีการสมัคร
          </button>
        </div>
      </section>
    </main>
  );
}
