import React from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LifeGear | Activity",
  description: "Time management for event in Engineering faculty",
};

export default function ActivityPage() {
  return (
    <main className="min-h-screen w-full bg-gray-50 p-6 flex flex-col items-center">
      {/* หัวข้อหลัก */}
      <h1 className="text-2xl sm:text-3xl font-bold text-center mb-8">
        กิจกรรมภายในคณะวิศวกรรมศาสตร์
      </h1>

      <div className="w-full max-w-6xl grid grid-cols-1 sm:grid-cols-4 gap-6">
        {/* Sidebar ค้นหา */}
        <aside className="sm:col-span-1 bg-white rounded-xl shadow p-4 space-y-4">
          {/* ช่องค้นหา */}
          <div className="relative">
            <input
              type="text"
              placeholder="ค้นหา..."
              className="w-full rounded-full border border-gray-300 px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="absolute right-3 top-2.5 text-gray-400">🔍</span>
          </div>

          {/* Checkbox filter */}
          <div className="space-y-2 text-sm">
            <label className="flex items-center space-x-2">
              <input type="checkbox" /> <span>ด้านดนตรี</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" /> <span>ด้านกีฬาและการออกกำลังกาย</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" /> <span>ด้านศิลปะและวัฒนธรรม</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" /> <span>ด้านวิชาการและเทคโนโลยี</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" /> <span>ด้านสังคมและบำเพ็ญประโยชน์</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" /> <span>ด้านวิชาชีพและทักษะอาชีพ</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" /> <span>ด้านนันทนาการและสันทนาการ</span>
            </label>
            <label className="flex items-center space-x-2">
              <input type="checkbox" /> <span>ด้านจิตใจและคุณธรรม</span>
            </label>
          </div>

          <button className="w-full bg-blue-600 text-white font-bold py-2 rounded-xl hover:bg-blue-700 transition">
            ค้นหา
          </button>
        </aside>

        {/* รายการกิจกรรม */}
        <section className="sm:col-span-3 space-y-6">
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col sm:flex-row justify-between items-center"
            >
              <div className="text-gray-700">
                <h2 className="font-bold text-lg">กิจกรรมที่ {item}</h2>
                <p className="text-sm text-gray-500 mt-1">
                  รายละเอียดกิจกรรมสั้น ๆ เพื่อดึงดูดความสนใจของนักศึกษา
                </p>
              </div>
              <div className="flex space-x-3 mt-4 sm:mt-0">
                <button className="px-4 py-2 rounded-lg border border-gray-400 hover:bg-gray-100 transition">
                  อ่านเพิ่มเติม
                </button>
                <button className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition">
                  ลงทะเบียน
                </button>
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* ช่องทางการติดต่อ */}
      <footer className="w-full mt-10 bg-white text-center border-t py-6 text-gray-600">
        ช่องทางการติดต่อ
      </footer>
    </main>
  );
}
