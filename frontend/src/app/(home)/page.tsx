import type { Metadata } from "next";
import BannerSliderWrapper from "@/components/BannerSliderWrapper";
import FeatureCard from "@/components/FeatureCard";

export const metadata: Metadata = {
  title: "LifeGear | Homepage",
  description: "Time management for event in Engineering faculty",
};

export default function Home() {
  return (
    <main className="bg-[#f6f1e7]">
      
      {/* Hero Section with Slider */}
      <BannerSliderWrapper />

      {/* Welcome Section */}
      <section className="p-6 sm:p-10 my-10 text-center max-w-4xl mx-auto">
        <h1 className="heading text-[#730217] text-center mb-4">
          ขอต้อนรับเข้าสู่เว็บไซต์ <span className="text-black">LifeGear</span>
        </h1>
        <p className="text-[#2E2E2E] leading-relaxed whitespace-pre-line mb-10 text-sm sm:text-base">
          &quot;...หมดปัญหาสับสนเรื่องตารางเรียนหรือกิจกรรมคณะ! LifeGear ช่วยจัดระเบียบชีวิตนักศึกษาวิศวะให้ลงตัว <br />
          ด้วยระบบปฏิทินรายเดือนที่รวมทุกอย่างไว้ครบ ทั้งตารางเรียน กิจกรรม และการเพิ่มกิจกรรมส่วนตัว ใช้งานสะดวก <br />
          ครบจบในเว็บเดียว...&quot;
        </p>
      </section>

      {/* Feature Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">

        {/* การ์ดกิจกรรม */}
        <FeatureCard
          title="กิจกรรมทั้งหมด"
          subTitle="ดูรายละเอียด"
          link="/activity"
          imgSrc="/activity.png"
        />

        {/* การ์ดรายเดือน */}
        <FeatureCard
          title="ตารางชีวิต"
          subTitle="รายเดือน"
          link="/monthly"
          imgSrc="/mothly.png"
        />

        {/* การ์ดรายวัน */}
        <FeatureCard
          title="ตารางชีวิต"
          subTitle="รายวัน"
          link="/daily"
          imgSrc="/daily.png"
        />
      </section>
    </main>
  );
}
