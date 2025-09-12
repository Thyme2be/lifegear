"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ProfileInfo from "./ProfileInfo";
import axios from "axios";
import type { User } from "@/lib/types";

export default function TopBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/v1/api/auth/user/home", {
        withCredentials: true,
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, []);

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

      {/* เมนูปกติ (Tablet/Desktop) */}
      <ul className="hidden sm:flex space-x-10 text-white font-bold items-center text-lg">
        <li>
          <a href="#" className="hover:text-blue-400">
            หน้าหลัก
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-blue-400">
            กิจกรรม
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-blue-400">
            ตารางชีวิต
          </a>
        </li>
        <li>
          <a href="#" className="hover:text-blue-400">
            วิธีใช้งาน
          </a>
        </li>
      </ul>

      {/* Group Hamburger and Profile */}
      <div className=" flex gap-5 ">
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
        </div>

        {/* ปุ่ม Profile */}
        <div className="relative">
          <button
            title="Toggle Profile Menu"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setIsOpen(false); // ปิดเมนูถ้าเปิด profile
            }}
          >
            {/* Profile Image */}
            <div className="p-6 bg-gray-300 rounded-full cursor-pointer"></div>
          </button>

          {profileOpen && <ProfileInfo user={user} />}
        </div>
      </div>

      {/* เมนู Dropdown (มือถือ) */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#730217] text-white flex flex-col items-center py-6 sm:hidden space-y-4">
          <a href="#" className="hover:text-blue-400">
            หน้าหลัก
          </a>
          <a href="#" className="hover:text-blue-400">
            กิจกรรม
          </a>
          <a href="#" className="hover:text-blue-400">
            ตารางชีวิต
          </a>
          <a href="#" className="hover:text-blue-400">
            วิธีใช้งาน
          </a>
        </div>
      )}
    </nav>
  );
}
