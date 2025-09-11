"use client";

import { useState } from "react";
import Image from "next/image";
import { CgProfile } from "react-icons/cg";
import { FaIdCard } from "react-icons/fa";
import ProfileInfo from "./ProfileInfo";

export default function TopBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // mock data
  const mockUser = {
    id: "6710742187",
    name: "นางสาวพรรษชล บุญมาก",
  };

  return (
    <nav className="w-full h-20 bg-[#730217] px-6 sm:px-10 flex justify-between items-center z-50 relative">
      {/* โลโก้ */}
      <div className="flex items-center space-x-3">
        <Image
          src="/logo.png"
          alt="LifeGear Logo"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>

      {/* ปุ่ม Hamburger + Profile (มือถือ) */}
      <div className="flex items-center space-x-4">
        {/* ปุ่ม Hamburger */}
        <button
          className="sm:hidden text-white text-3xl focus:outline-none cursor-pointer"
          onClick={() => {
            setIsOpen(!isOpen);
            setProfileOpen(false); // ปิด profile ถ้าเปิดเมนู
          }}
        >
          ☰
        </button>

        {/* ปุ่ม Profile */}
        <div className="sm:hidden relative">
          <button
            onClick={() => {
              setProfileOpen(!profileOpen);
              setIsOpen(false); // ปิดเมนูถ้าเปิด profile
            }}
          >
            <Image
              src="/profile.png"
              alt="Profile"
              width={40}
              height={40}
              className="object-contain rounded-full cursor-pointer"
            />
          </button>

          {profileOpen && (
            <div className="absolute right-0 top-12 w-64 bg-red-800 text-white shadow-lg rounded-lg p-4">
              {/* ส่วนหัว */}
              <div className="flex justify-between items-center border-b border-white pb-2 mb-2">
                <h2 className="text-base font-bold">ข้อมูลผู้ใช้งาน</h2>
                <button
                  onClick={() => alert("ทำฟังก์ชัน logout ได้ตรงนี้")}
                  className="text-gray-200 hover:text-red-400 text-sm cursor-pointer"
                >
                  ลงชื่อออก
                </button>
              </div>

              {/* ข้อมูลโปรไฟล์ */}
              <div className="flex items-center">
                <Image
                  src="/profile.png"
                  alt="Profile"
                  width={50}
                  height={50}
                  className="object-contain rounded-full mr-3"
                />
                <div>
                  <p className="flex items-center text-sm text-white">
                    <CgProfile className="mr-2" />
                    {mockUser.name}
                  </p>
                  <p className="flex items-center text-sm text-white mt-2">
                    <FaIdCard className="mr-2" />
                    {mockUser.id}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* เมนูปกติ (Tablet/Desktop) */}
      <ul className="hidden sm:flex space-x-10 text-white font-bold items-center text-lg">
        <li><a href="#" className="hover:text-blue-400">หน้าหลัก</a></li>
        <li><a href="#" className="hover:text-blue-400">กิจกรรม</a></li>
        <li><a href="#" className="hover:text-blue-400">ตารางชีวิต</a></li>
        <li><a href="#" className="hover:text-blue-400">วิธีใช้งาน</a></li>
        <li>
          {/* บนจอใหญ่ใช้ Profile ปกติ */}
          <ProfileInfo />
        </li>
      </ul>

      {/* เมนู Dropdown (มือถือ) */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#730217] text-white flex flex-col items-center py-6 sm:hidden space-y-4">
          <a href="#" className="hover:text-blue-400">หน้าหลัก</a>
          <a href="#" className="hover:text-blue-400">กิจกรรม</a>
          <a href="#" className="hover:text-blue-400">ตารางชีวิต</a>
          <a href="#" className="hover:text-blue-400">วิธีใช้งาน</a>
        </div>
      )}
    </nav>
  );
}

