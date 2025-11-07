"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import ProfileInfo from "./ProfileInfo";
import axios from "axios";
import type { User } from "@/types/activity";
import Link from "next/link";
import { apiRoutes } from "@/lib/apiRoutes";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

export default function TopBar() {
  const [isOpen, setIsOpen] = useState(false); // Hamburger Mobile
  const [profileOpen, setProfileOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [lifeOpenMobile, setLifeOpenMobile] = useState(false); // Mobile dropdown

  const profileRef = useRef<HTMLLIElement>(null); // desktop
  const mobileProfileRef = useRef<HTMLDivElement>(null); // mobile

  // โหลดข้อมูลผู้ใช้
  useEffect(() => {
    axios
      .get(apiRoutes.getUserHomeData, { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch((err) => console.error(err));
  }, []);

  // ปิด dropdown เมื่อคลิกนอกพื้นที่
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        profileRef.current && !profileRef.current.contains(target) &&
        mobileProfileRef.current && !mobileProfileRef.current.contains(target)
      ) {
        setProfileOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="fixed w-full h-20 bg-[#730217] px-6 sm:px-10 flex justify-between items-center z-50 overflow-visible">
      {/* โลโก้ */}
      <Link href="/" className="flex items-center cursor-pointer">
        <Image
          src="/logo.png"
          alt="LifeGear Logo"
          width={130}
          height={130}
          className="object-contain"
        />
      </Link>

      {/* Desktop Menu */}
      <ul className="hidden sm:flex items-center space-x-10 text-white font-bold text-lg">
        <li>
          <Link href="/" className="hover:text-yellow-400">หน้าหลัก</Link>
        </li>
        <li>
          <Link href="/activity" className="hover:text-yellow-400">กิจกรรม</Link>
        </li>

        {/* ตารางชีวิต Desktop - Hover Dropdown */}
        <li className="relative group">
          <button className="hover:text-yellow-400 cursor-pointer">ตารางชีวิต</button>
          <div className="absolute top-8 left-0 bg-red-800 rounded-md shadow-lg py-2 w-48 text-base opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
            <Link href="/monthly" className="block px-4 py-2 hover:bg-red-700">
              ตารางชีวิต (รายเดือน)
            </Link>
            <Link href="/daily" className="block px-4 py-2 hover:bg-red-700">
              ตารางชีวิต (รายวัน)
            </Link>
          </div>
        </li>

        <li>
          <Link href="/help" className="hover:text-yellow-400">วิธีใช้งาน</Link>
        </li>

        {/* Profile Desktop */}
        <li ref={profileRef} className="relative">
          <button
            title="Toggle Profile Menu"
            onClick={() => setProfileOpen(!profileOpen)}
          >
            <div className="w-12 h-12 bg-gray-300 rounded-full cursor-pointer"></div>
          </button>
          {profileOpen && <ProfileInfo user={user} />}
        </li>
      </ul>

      {/* Mobile Hamburger + Profile */}
      <div className="sm:hidden flex items-center space-x-4" ref={mobileProfileRef}>
        {/* Hamburger */}
        <button
          className="text-white text-3xl focus:outline-none cursor-pointer"
          onClick={() => {
            setIsOpen(!isOpen);
            setProfileOpen(false);
            setLifeOpenMobile(false);
          }}
        >
          ☰
        </button>

        {/* Profile Mobile */}
        <div className="relative">
          <button
            title="Toggle Profile Menu"
            onClick={() => {
              setProfileOpen(!profileOpen);
              setIsOpen(false);
              setLifeOpenMobile(false);
            }}
          >
            <div className="w-12 h-12 bg-gray-300 rounded-full cursor-pointer"></div>
          </button>
          {profileOpen && <ProfileInfo user={user} />}
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#730217] text-white flex flex-col items-center py-6 sm:hidden space-y-4 z-50">
          <Link href="/" className="hover:text-yellow-400 w-full text-center py-1">หน้าหลัก</Link>
          <Link href="/activity" className="hover:text-yellow-400 w-full text-center py-1">กิจกรรม</Link>

          {/* ตารางชีวิต Mobile Dropdown - Click with Icon */}
          <div className="relative w-full">
            <button
              className="w-full text-white text-center py-1 flex justify-center items-center gap-2 hover:text-yellow-400"
              onClick={() => setLifeOpenMobile(!lifeOpenMobile)}
            >
              ตารางชีวิต
              {lifeOpenMobile ? (
                <FaChevronUp className="inline-block text-sm" />
              ) : (
                <FaChevronDown className="inline-block text-sm" />
              )}
            </button>

            {/* Animate dropdown */}
            <div
              className={`overflow-hidden transition-all duration-300 w-full flex flex-col items-center bg-red-900 ${
                lifeOpenMobile ? "max-h-40 py-2" : "max-h-0 py-0"
              }`}
            >
              <Link href="/monthly" className="w-full text-center py-1 hover:text-yellow-400">
                ตารางชีวิต (รายเดือน)
              </Link>
              <Link href="/daily" className="w-full text-center py-1 hover:text-yellow-400">
                ตารางชีวิต (รายวัน)
              </Link>
            </div>
          </div>

          <Link href="/help" className="hover:text-yellow-400 w-full text-center py-1">วิธีใช้งาน</Link>
        </div>
      )}
    </nav>
  );
}