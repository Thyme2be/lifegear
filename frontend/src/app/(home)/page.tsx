import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LifeGear | Homepage",
  description: "Time management for event in Engineering faculty",
};

export default function Home() {
  return (
    <>
      <main className="pt-20">
        {/* Hero Section */}
        <section className="relative w-full h-[400px] bg-gray-200 flex items-center justify-center">
          <div className="absolute left-4 text-3xl cursor-pointer">⬅</div>
          <div className="absolute right-4 text-3xl cursor-pointer">➡</div>
          <span className="text-gray-500">[แบนเนอร์สไลด์รูปภาพ]</span>
        </section>

        {/* Welcome Section */}
        <section className="text-center my-10">
          <h1 className="text-2xl font-bold">
            ขอต้อนรับเข้าสู่เว็บไซต์ <span className="text-blue-600">LifeGear</span>
          </h1>
          <div className="mt-6 mx-auto max-w-xl p-6 bg-gray-100 rounded-xl">
            <p className="text-gray-700">
              พื้นที่สำหรับแสดงข้อความ แนะนำเว็บไซต์ หรือข่าวสาร
            </p>
          </div>
        </section>

        {/* Feature Section */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-5xl mx-auto mb-12">
          <div className="flex flex-col items-center">
            <h2 className="font-semibold">กิจกรรม</h2>
            <div className="p-6 bg-white shadow-md rounded-2xl">
              <div className="w-24 h-24 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
                📌
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="font-semibold">ตารางรายเดือน</h2>
            <div className="p-6 bg-white shadow-md rounded-2xl">
              <div className="w-24 h-24 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
                📅
              </div>
            </div>
          </div>

          <div className="flex flex-col items-center">
            <h2 className="font-semibold">ตารางรายวัน</h2>
            <div className="p-6 bg-white shadow-md rounded-2xl">
              <div className="w-24 h-24 bg-gray-200 rounded-xl mb-4 flex items-center justify-center">
                🗓
              </div>
            </div>
          </div>
        </section>
      </main>
    </>
  );
}
