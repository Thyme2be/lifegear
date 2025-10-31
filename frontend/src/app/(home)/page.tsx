// src/app/(home)/page/page.tsx
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import BannerSliderWrapper from "@/components/BannerSliderWrapper";

export const metadata: Metadata = {
  title: "LifeGear | Homepage",
  description: "Time management for event in Engineering faculty",
};

export default function Home() {
  return (
      <main className="bg-cream">
        {/* Hero Section with Slider */}
        <BannerSliderWrapper />

        {/* Welcome Section */}
        <section className="p-6 sm:p-10 my-10 text-center max-w-4xl mx-auto">
          <h1 className="heading text-main text-center mb-4">
            ขอต้อนรับเข้าสู่เว็บไซต์{" "}
            <span className="text-black">LifeGear</span>
          </h1>
          <p className="text-[#2E2E2E] leading-relaxed whitespace-pre-line mb-10 text-sm sm:text-base">
            &quot;...หมดปัญหาสับสนเรื่องตารางเรียนหรือกิจกรรมคณะ! LifeGear
            ช่วยจัดระเบียบชีวิตนักศึกษาวิศวะให้ลงตัว <br />
            ด้วยระบบปฏิทินรายเดือนที่รวมทุกอย่างไว้ครบ ทั้งตารางเรียน กิจกรรม
            และการเพิ่มกิจกรรมส่วนตัว ใช้งานสะดวก <br />
            ครบจบในเว็บเดียว...&quot;
          </p>
        </section>

        {/* Feature Section */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
          {/* การ์ดกิจกรรม */}
          <div className="flex flex-col items-center text-center max-w-sm mx-auto">
            <h2 className="heading2 text-main text-center">กิจกรรมทั้งหมด</h2>
            <Link
              href="/activity"
              className="relative w-full h-full rounded-3xl overflow-hidden cursor-pointer mb-10"
            >
              <Image
                src="/activity.png"
                alt="Activity Icon"
                width={420}
                height={370}
                className="object-contain mt-8"
              />
            </Link>
          </div>

          {/* การ์ดรายเดือน */}
          <div className="flex flex-col items-center text-center max-w-sm mx-auto">
            <h2 className="heading2 text-main text-center">ตารางชีวิต</h2>
            <h3 className="text-lg sm:text-xl font-bold text-main mb-2 text-shadow-lg">
              (รายเดือน)
            </h3>
            <Link
              href="/monthly"
              className="relative w-full h-full rounded-3xl overflow-hidden cursor-pointer mb-10"
            >
              <Image
                src="/mothly.png"
                alt="Monthly Icon"
                width={420}
                height={370}
                className="object-contain"
              />
            </Link>
          </div>

          {/* การ์ดรายวัน */}
          <div className="flex flex-col items-center text-center max-w-sm mx-auto">
            <h2 className="heading2 text-main text-center">ตารางชีวิต</h2>
            <h3 className="text-lg sm:text-xl font-bold text-main mb-2 text-shadow-lg">
              (รายวัน)
            </h3>
            <Link
              href="/daily"
              className="relative w-full h-full rounded-3xl overflow-hidden cursor-pointer mb-10"
            >
              <Image
                src="/daily.png"
                alt="Daily Icon"
                width={420}
                height={370}
                className="object-contain"
              />
            </Link>
          </div>
        </section>
      </main>
  );
}
