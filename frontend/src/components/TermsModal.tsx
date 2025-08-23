"use client";

import { useState } from "react";

const TermsModal = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ปุ่มเปิด Modal */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-blue-700 hover:underline decoration-2 ml-1"
      >
        อ่านเพิ่มเติม
      </button>

      {/* Overlay */}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          {/* กล่อง Modal */}
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-[90%] p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">
              เงื่อนไขการใช้งาน
            </h2>
            <div className="text-sm text-gray-700 space-y-3 max-h-72 overflow-y-auto">
              <p>
                1. ผู้ใช้งานต้องใช้ระบบ LifeGear
                อย่างสุจริต ไม่ละเมิดสิทธิ์หรือก่อความเสียหายแก่ผู้อื่น
              </p>
              <p>
                2. ห้ามเผยแพร่หรือใช้งานระบบเพื่อการทุจริต
                รวมถึงการเข้าถึงข้อมูลที่ไม่ได้รับอนุญาต
              </p>
              <p>
                3. ทีมพัฒนาอาจมีการเปลี่ยนแปลง/ปรับปรุงบริการ
                โดยไม่ต้องแจ้งล่วงหน้า
              </p>
              <p>
                4. ข้อมูลที่กรอกในระบบจะถูกจัดเก็บตามมาตรฐานความปลอดภัย
                และใช้เพื่อวัตถุประสงค์ทางการศึกษาเท่านั้น
              </p>
              <p>
                5. การเข้าสู่ระบบถือว่าผู้ใช้ยอมรับเงื่อนไขข้างต้นโดยสมบูรณ์
              </p>
            </div>

            {/* ปุ่มปิด */}
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setOpen(false)}
                className="px-6 py-2 rounded-full bg-blue-600 text-white font-semibold hover:bg-blue-700"
              >
                ปิด
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TermsModal;
