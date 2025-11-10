// src/components/TopBar/ProfileMenu.tsx
"use client";
import axios from "axios";
import { CgProfile } from "react-icons/cg";
import { FaIdCard } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import type { User } from "@/types/activities";
import { apiRoutes } from "@/lib/apiRoutes";
import Avatar from "./Avatar";
import clsx from "clsx";

type Props = {
  user: User | null;
  className?: string; // พาเรนต์กำหนด absolute/transition ได้
  panelProps?: React.HTMLAttributes<HTMLDivElement>;
};

async function handleLogout() {
  try {
    await axios.post(apiRoutes.postLogout, {}, { withCredentials: true });
    window.location.href = "/login";
  } catch (err) {
    console.error("Logout failed:", err);
  }
}

export default function ProfileMenu({ user, className, panelProps }: Props) {
  return (
    <div
      role="dialog"
      aria-label="ข้อมูลผู้ใช้งาน"
      className={clsx(
        "w-80 max-w-sm bg-red-800 shadow-2xl p-4 rounded-lg z-[10000]",
        "pointer-events-auto",
        className
      )}
      {...panelProps}
    >
      <div className="flex justify-between items-center border-b border-white pb-2 mb-2">
        <h2 className="text-lg font-bold text-white">ข้อมูลผู้ใช้งาน</h2>
        <button
          type="button"
          onClick={handleLogout}
          className="flex items-center gap-1 text-gray-200 hover:text-yellow-200 text-sm cursor-pointer"
        >
          ลงชื่อออก <FiLogOut className="text-base" />
        </button>
      </div>

      <div className="flex items-center gap-3">
        <Avatar user={user} size="lg" />
        <div>
          <p className="flex items-center text-sm text-white">
            <CgProfile className="mr-2 text-lg" />
            {user?.first_name_th} {user?.last_name_th}
          </p>
          <p className="flex items-center text-sm text-white mt-2">
            <FaIdCard className="mr-2 text-lg" />
            {user?.username}
          </p>
        </div>
      </div>
    </div>
  );
}
