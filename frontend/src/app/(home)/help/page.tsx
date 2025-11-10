import type { Metadata } from "next"; 
import HelpBannerSlider from "@/components/HelpBannerSlider";
import { FaQuestionCircle } from "react-icons/fa";

export const metadata: Metadata = {
  title: "LifeGear | User Help",
  description: "Time management for event in Engineering faculty",
};
const faqs = [
    {
      q: "LifeGear คืออะไร ?",
      a: "LifeGear คือแพลตฟอร์มผู้ช่วยนักศึกษา ที่รวมตารางเรียน งานที่ต้องส่ง ข่าวสาร และกิจกรรมต่าง ๆ ไว้ในที่เดียว เพื่อช่วยจัดระเบียบชีวิตการเรียนให้สะดวกและมีประสิทธิภาพมากขึ้น",
    },
    {
      q: "ต้องเสียค่าใช้จ่ายในการใช้งานหรือไม่ ?",
      a: "ไม่เสียค่าใช้จ่าย นักศึกษาสามารถใช้งาน LifeGear ได้ฟรี เพียงเข้าสู่ระบบด้วยรหัสนักศึกษา",
    },
    {
      q: "ใช้ได้ในอุปกรณ์อะไรบ้าง ?",
      a: "LifeGear รองรับทั้งคอมพิวเตอร์และมือถือ สามารถใช้งานผ่านเว็บเบราว์เซอร์ได้ทันที โดยไม่ต้องติดตั้งแอปเพิ่มเติม",
    },
  ];

export default function Home() {
  return (
    <main className="bg-primary">
        {/* หัวข้อหลัก */}
      <header className="px-4 sm:px-6 lg:px-10 py-10 heading text-main text-center">
          วิธีใช้งาน LifeGear
      </header>
      {/* Hero Section with Slider */}
      <HelpBannerSlider />
      
      {/* FAQ Section */}
      <section className="p-6 sm:p-10 max-w-4xl mx-auto mt-10">
      {/* หัวข้อ */}
      <div className="flex items-center gap-3 mb-8">
        <FaQuestionCircle className="text-main text-3xl" />
        <h1 className="heading text-main">
          คำถามที่พบบ่อย (FAQ) – LifeGear
        </h1>
      </div>

      {/* FAQ list */}
      <div className="space-y-6">
        {faqs.map((item, idx) => (
          <div key={idx}>
            <p className="font-bold text-[#2E2E2E] text-sm sm:text-base lg:text-lg">
              คำถาม: {item.q}
            </p>
            <p className="text-[#2E2E2E] mt-1 text-sm sm:text-base leading-relaxed">
              <span className="font-bold">ตอบ:</span> {item.a}
            </p>
            {idx < faqs.length - 1 && <hr className="my-4 border-gray-300" />}
          </div>
        ))}
      </div>
    </section>
    </main>
  );
}
