"use client";

import axios from "axios";
import { CgProfile } from "react-icons/cg";
import { FaIdCard } from "react-icons/fa";
import type { User } from "@/types/activities";
import { apiRoutes } from "@/lib/apiRoutes";
import { FiLogOut } from "react-icons/fi";
import { getInitials, pickAvatarBg } from "@/utils/avatar";

type ProfileInfoProps = {
  user: User | null;
  /** ใช้ absolute วางลอย (เดิม) ถ้า false จะเป็นกล่องปกติ เหมาะกับใช้งานร่วมกับ group-hover */
  floating?: boolean;
  className?: string;
};

const handleLogout = async () => {
  try {
    await axios.post(apiRoutes.postLogout, {}, { withCredentials: true });
    window.location.href = "/login";
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

const ProfileInfo = ({ user, floating = true, className }: ProfileInfoProps) => {
  return (
    <div
      className={[
        floating
          ? "absolute top-14 right-0"
          : "mt-2", // วางถัดจาก avatar สำหรับโหมด hover
        "w-80 max-w-sm bg-red-800 shadow-2xl p-4 rounded-lg z-[10000] pointer-events-auto",
        className || "",
      ].join(" ")}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white pb-2 mb-2">
        <h2 className="text-lg font-bold text-white">ข้อมูลผู้ใช้งาน</h2>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleLogout();
          }}
          className="flex items-center gap-1 text-gray-200 hover:text-yellow-200 text-sm cursor-pointer transition"
        >
          ลงชื่อออก
          <FiLogOut className="text-base" />
        </button>
      </div>

      {/* Profile */}
      <div className="flex items-center gap-3">
        <div
          className={[
            "w-16 h-16 rounded-full",
            "flex items-center justify-center select-none",
            "text-white font-bold text-lg",
            pickAvatarBg(user),
          ].join(" ")}
          aria-hidden="true"
        >
          {getInitials(user)}
        </div>
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
};

export default ProfileInfo;
