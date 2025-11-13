// src/components/TopBar/DesktopNav.tsx
"use client";
import Link from "next/link";
import type { User } from "@/types/activities";
import Avatar from "./Avatar";
import ProfileMenu from "./ProfileMenu";

export default function DesktopNav({ user }: { user: User | null }) {
  return (
    <ul className="hidden sm:flex items-center space-x-10 text-white font-bold text-lg">
      <li><Link href="/" className="hover:text-yellow-400">หน้าหลัก</Link></li>
      <li><Link href="/activity" className="hover:text-yellow-400">กิจกรรม</Link></li>

      {/* Life menu (hover) */}
      <li className="relative group">
        <button className="hover:text-yellow-400 cursor-pointer" aria-haspopup="true">
          ตารางชีวิต
        </button>
        <div className="absolute top-8 left-0 bg-red-800 rounded-md shadow-lg py-2 w-48 text-base opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
          <Link href="/monthly" className="block px-4 py-2 hover:bg-red-700">ตารางชีวิต (รายเดือน)</Link>
          <Link href="/daily" className="block px-4 py-2 hover:bg-red-700">ตารางชีวิต (รายวัน)</Link>
        </div>
      </li>

      <li><Link href="/help" className="hover:text-yellow-400">วิธีใช้งาน</Link></li>

      {/* Profile (hover reveal, ตำแหน่งคงเดิม) */}
      <li className="relative group">
        <div className="inline-flex" tabIndex={0} aria-haspopup="dialog" aria-expanded="false">
          <Avatar user={user} />
        </div>

        {/* Render ตลอดที่เดิม แต่ซ่อนไว้จน hover/focus */}
        <div
          className={[
            "absolute top-14 right-0",
            "opacity-0 invisible translate-y-1 pointer-events-none",
            "group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 group-hover:pointer-events-auto",
            "group-focus-within:opacity-100 group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:pointer-events-auto",
            "transition-all duration-150",
          ].join(" ")}
        >
          <ProfileMenu user={user} />
        </div>
      </li>
    </ul>
  );
}
