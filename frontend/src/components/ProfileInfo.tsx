"use client";

import axios from "axios";
import { CgProfile } from "react-icons/cg";
import { FaIdCard } from "react-icons/fa";
import type { User } from "@/types/activities";
import { apiRoutes } from "@/lib/apiRoutes";
import { FiLogOut } from "react-icons/fi";

type ProfileInfoProps = {
  user: User | null;
};

const handleLogout = async () => {
  try {
    await axios.post(
      apiRoutes.postLogout,
      {},
      { withCredentials: true }
    );
    window.location.href = "/login";
  } catch (err) {
    console.error("Logout failed:", err);
  }
};

const ProfileInfo = ({ user }: ProfileInfoProps) => {
  return (
    <div
      className="absolute top-14 right-0 w-80 max-w-sm bg-red-800 shadow-2xl p-4 rounded-lg z-[10000] pointer-events-auto"
      onClick={(e) => e.stopPropagation()} // ป้องกันคลิกใน popup ไปปิดเอง
    >
      {/* Header */}
      <div className="flex justify-between items-center border-b border-white pb-2 mb-2">
        <h2 className="text-lg font-bold text-white">ข้อมูลผู้ใช้งาน</h2>
        <button
          onClick={(e) => {
            e.stopPropagation(); // ป้องกัน bubble
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
        <div className="p-7 bg-gray-300 rounded-full"></div>
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