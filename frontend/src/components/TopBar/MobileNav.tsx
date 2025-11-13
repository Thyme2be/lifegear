// src/components/TopBar/MobileNav.tsx
"use client";
import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import type { User } from "@/types/activities";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import ProfileMenu from "./ProfileMenu";
import Avatar from "./Avatar";
import { useOutsideClick } from "@/hooks/useOutsideClick";

export default function MobileNav({ user }: { user: User | null }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [lifeOpen, setLifeOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const rootRef = useRef<HTMLDivElement>(null);
  const closeAll = useCallback(() => {
    setMenuOpen(false); setLifeOpen(false); setProfileOpen(false);
  }, []);
  useOutsideClick(rootRef, closeAll, menuOpen || profileOpen);

  return (
    <div className="sm:hidden flex items-center space-x-4" ref={rootRef}>
      {/* Hamburger */}
      <button
        type="button"
        className="text-white text-3xl"
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        onClick={() => {
          setMenuOpen((o) => !o);
          setProfileOpen(false);
        }}
      >
        ☰
      </button>

      {/* Profile (click) */}
      <div className="relative">
        <button
          type="button"
          title="Toggle Profile Menu"
          aria-expanded={profileOpen}
          onClick={() => {
            setProfileOpen((o) => !o);
            setMenuOpen(false);
          }}
        >
          <Avatar user={user} />
        </button>
        {profileOpen && (
          <div className="absolute top-14 right-0">
            <ProfileMenu user={user} />
          </div>
        )}
      </div>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="absolute top-20 left-0 w-full bg-main text-white flex flex-col items-center py-6 space-y-4 z-50"
        >
          <Link href="/" className="hover:text-yellow-400 w-full text-center py-1">หน้าหลัก</Link>
          <Link href="/activity" className="hover:text-yellow-400 w-full text-center py-1">กิจกรรม</Link>

          {/* Life dropdown */}
          <div className="relative w-full">
            <button
              type="button"
              className="w-full text-center py-1 flex justify-center items-center gap-2 hover:text-yellow-400"
              aria-expanded={lifeOpen}
              onClick={() => setLifeOpen((o) => !o)}
            >
              ตารางชีวิต {lifeOpen ? <FaChevronUp /> : <FaChevronDown />}
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 w-full flex flex-col items-center bg-red-900 ${
                lifeOpen ? "max-h-40 py-2" : "max-h-0 py-0"
              }`}
            >
              <Link href="/monthly" className="w-full text-center py-1 hover:text-yellow-400">ตารางชีวิต (รายเดือน)</Link>
              <Link href="/daily" className="w-full text-center py-1 hover:text-yellow-400">ตารางชีวิต (รายวัน)</Link>
            </div>
          </div>

          <Link href="/help" className="hover:text-yellow-400 w-full text-center py-1">วิธีใช้งาน</Link>
        </div>
      )}
    </div>
  );
}
