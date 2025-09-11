"use client";

import { useState } from "react";
import Image from "next/image";
import { CgProfile } from "react-icons/cg";
import { FaIdCard } from "react-icons/fa";

// mock data
const mockUser = {
  id: "6710742187",
  name: "นางสาวพรรษชล บุญมาก",
};

const ProfileInfo = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* ============ จอใหญ่ (Desktop / Tablet) ============ */}
      <div className="hidden sm:block relative">
        <button type="button" onClick={() => setOpen(!open)}>
          <Image
            src="/profile.png"
            alt="Profile"
            width={60}
            height={60}
            className="object-contain rounded-full cursor-pointer"
          />
        </button>

        {open && (
          <div className="absolute top-16 right-0 w-80 max-w-sm bg-red-800 shadow-2xl p-4 rounded-lg z-50">
            {/* ส่วนหัว */}
            <div className="flex justify-between items-center border-b border-white pb-2 mb-2">
              <h2 className="text-lg font-bold text-white">
                ข้อมูลผู้ใช้งาน
              </h2>
              <button
                onClick={() => alert("logout ที่ backend จะมาทำ")}
                className="text-gray-200 hover:text-red-400 text-sm cursor-pointer"
              >
                ลงชื่อออก
              </button>
            </div>

            {/* โปรไฟล์ */}
            <div className="flex items-center">
              <Image
                src="/profile.png"
                alt="Profile"
                width={60}
                height={60}
                className="object-contain rounded-full mr-3"
              />
              <div>
                <p className="flex items-center text-sm text-white">
                  <CgProfile className="mr-2 text-lg" />
                  {mockUser.name}
                </p>
                <p className="flex items-center text-sm text-white mt-2">
                  <FaIdCard className="mr-2 text-lg" />
                  {mockUser.id}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============ จอเล็ก (Mobile) ============ */}
      <div className="sm:hidden relative">
        <button type="button" onClick={() => setOpen(!open)}>
          <Image
            src="/profile.png"
            alt="Profile"
            width={40}
            height={40}
            className="object-contain rounded-full cursor-pointer"
          />
        </button>

        {open && (
          <div className="absolute right-0 top-12 w-64 bg-red-800 text-white shadow-lg rounded-lg p-4">
            {/* ส่วนหัว */}
            <div className="flex justify-between items-center border-b border-gray-600 pb-2 mb-2">
              <h2 className="text-base font-bold ">ข้อมูลผู้ใช้งาน</h2>
              <button
                onClick={() => alert("logout ที่ backend จะมาทำ")}
                className="text-gray-200 hover:text-red-400 text-sm cursor-pointer"
              >
                ลงชื่อออก
              </button>
            </div>

            {/* โปรไฟล์ */}
            <div className="flex flex-col items-center">
              <Image
                src="/profile.png"
                alt="Profile"
                width={50}
                height={50}
                className="object-contain rounded-full mb-3"
              />
              <p className="flex items-center text-sm text-white">
                <CgProfile className="mr-2 text-lg" />
                {mockUser.name}
              </p>
              <p className="flex items-center text-sm text-white mt-2">
                <FaIdCard className="mr-2 text-lg" />
                {mockUser.id}
              </p>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfileInfo;
