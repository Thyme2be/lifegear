import type { Metadata } from "next";
import BannerSliderWrapper from "@/components/BannerSliderWrapper";
import Image from "next/image";
import HelpBannerSlider from "@/components/HelpBannerSlider";

export const metadata: Metadata = {
  title: "LifeGear | User Help",
  description: "Time management for event in Engineering faculty",
};

export default function Home() {
  return (
    <main className="bg-[#f6f1e7]">
        <div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#730217] p-10 text-shadow-lg text-center">
        วิธีใช้งาน LifeGear
        </h1>
        </div>

      {/* Hero Section with Slider */}
      <HelpBannerSlider />
      
      {/* Welcome Section */}
      <section className="p-6 sm:p-10 my-10 text-center max-w-4xl mx-auto">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#730217] mb-4 text-shadow-lg">
          ขอต้อนรับเข้าสู่เว็บไซต์ <span className="text-black">LifeGear</span>
        </h1>
        <p className="text-[#2E2E2E] leading-relaxed whitespace-pre-line mb-10 text-sm sm:text-base">
          "...หมดปัญหาสับสนเรื่องตารางเรียนหรือกิจกรรมคณะ! LifeGear ช่วยจัดระเบียบชีวิตนักศึกษาวิศวะให้ลงตัว <br />
          ด้วยระบบปฏิทินรายเดือนที่รวมทุกอย่างไว้ครบ ทั้งตารางเรียน กิจกรรม และการเพิ่มกิจกรรมส่วนตัว ใช้งานสะดวก <br />
          ครบจบในเว็บเดียว..."
        </p>
      </section>
    </main>
  );
}
