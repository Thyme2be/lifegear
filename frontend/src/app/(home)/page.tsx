import type { Metadata } from "next";
import BannerSliderWrapper from "@/components/BannerSliderWrapper";
import FeatureCard from "@/components/FeatureCard";

export const metadata: Metadata = {
  title: "LifeGear | Homepage",
  description: "Time management for event in Engineering faculty",
};

export default function Home() {
  return (
    <main className="bg-main-bg">

      {/* Hero Section with Slider */}
      <BannerSliderWrapper />

      {/* Welcome Section */}
      <article className="p-6 sm:p-10 my-10 max-w-4xl mx-auto text-center ">
        <h1 className="heading mb-4 text-center text-main">
          ขอต้อนรับเข้าสู่เว็บไซต์ <span className="text-black">LifeGear</span>
        </h1>
        <p className="mb-10 leading-relaxed whitespace-pre-line text-sm text-secondary sm:text-base">
          &quot;...หมดปัญหาสับสนเรื่องตารางเรียนหรือกิจกรรมคณะ! LifeGear ช่วยจัดระเบียบชีวิตนักศึกษาวิศวะให้ลงตัว <br />
          ด้วยระบบปฏิทินรายเดือนที่รวมทุกอย่างไว้ครบ ทั้งตารางเรียน กิจกรรม และการเพิ่มกิจกรรมส่วนตัว ใช้งานสะดวก <br />
          ครบจบในเว็บเดียว...&quot;
        </p>
      </article>

      {/* Feature Section */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">

        {/* การ์ดกิจกรรม */}
        <FeatureCard
          title="กิจกรรมทั้งหมด"
          subTitle="ดูรายละเอียด"
          link="/activity"
          imgSrc="/activity.png"
          alt="Activity card"
        />

        {/* การ์ดรายเดือน */}
        <FeatureCard
          title="ตารางชีวิต"
          subTitle="รายเดือน"
          link="/monthly"
          imgSrc="/mothly.png"
          alt="Monthly card"
        />

        {/* การ์ดรายวัน */}
        <FeatureCard
          title="ตารางชีวิต"
          subTitle="รายวัน"
          link="/daily"
          imgSrc="/daily.png"
          alt="Daily card"
        />
      </section>
    </main>
  );
}
