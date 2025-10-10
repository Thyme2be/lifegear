"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import ProfileInfo from "./ProfileInfo";
import axios from "axios";
import type { User } from "@/lib/types";
import Link from "next/link";
import { apiRoutes } from "@/lib/apiRoutes";

export default function TopBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    axios
      .get(apiRoutes.getUserHomeData, {
        withCredentials: true,
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, []);

  return (
    <nav className="w-full h-20 bg-[#730217] px-6 sm:px-10 flex justify-between items-center z-50 relative">
      {/* ---------- โลโก้ ---------- */}
      <div className="flex items-center">
        <Image
          src="/logo.png"
          alt="LifeGear Logo"
          width={120}
          height={120}
          className="object-contain"
        />
      </div>

      {/* ---------- เมนูปกติ (Desktop/Tablet) ---------- */}
      <ul className="hidden sm:flex items-center space-x-10 text-white font-bold text-lg">
        <li>
          <Link href="/" className="hover:text-yellow-400">
            หน้าหลัก
          </Link>
        </li>
        <li>
          <Link href="/activity" className="hover:text-yellow-400">
            กิจกรรม
          </Link>
        </li>
        <li>
          <Link href="/monthly" className="hover:text-yellow-400">
            ตารางชีวิต
          </Link>
        </li>
        <li>
          <Link href="/help" className="hover:text-yellow-400">
            วิธีใช้งาน
          </Link>
        </li>
        {/* ปุ่มโปรไฟล์ */}
        <li className="relative">
          <button
            title="Toggle Profile Menu"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setIsOpen(false); // ปิดเมนู mobile ถ้าเปิด profile
            }}
          >
            <div className="w-12 h-12 bg-gray-300 rounded-full cursor-pointer"></div>
          </button>
          {profileOpen && <ProfileInfo user={user} />}
        </li>
      </ul>

      {/* ---------- ปุ่ม Hamburger + Profile (Mobile) ---------- */}
      <div className="sm:hidden flex items-center space-x-4">
        {/* Hamburger */}
        <button
          className="text-white text-3xl focus:outline-none cursor-pointer"
          onClick={() => {
            setIsOpen(!isOpen);
            setProfileOpen(false);
          }}
        >
          ☰
        </button>

        {/* ปุ่มโปรไฟล์ */}
        <div className="relative">
          <button
            title="Toggle Profile Menu"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setIsOpen(false);
            }}
          >
            <div className="w-12 h-12 bg-gray-300 rounded-full cursor-pointer"></div>
          </button>
          {profileOpen && <ProfileInfo user={user} />}
        </div>
      </div>

      {/* ---------- เมนู Dropdown (Mobile) ---------- */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#730217] text-white flex flex-col items-center py-6 sm:hidden space-y-4">
          <Link href="/" className="hover:text-yellow-400">
            หน้าหลัก
          </Link>
          <Link href="/activity" className="hover:text-yellow-400">
            กิจกรรม
          </Link>
          <Link href="/monthly" className="hover:text-yellow-400">
            ตารางชีวิต
          </Link>
          <Link href="/help" className="hover:text-yellow-400">
            วิธีใช้งาน
          </Link>
        </div>
      )}
    </nav>
  );
}
