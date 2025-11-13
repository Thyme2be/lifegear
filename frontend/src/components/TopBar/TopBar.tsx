// src/components/TopBar/TopBar.tsx
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import type { User } from "@/types/activities";
import { apiRoutes } from "@/lib/apiRoutes";
import { http } from "@/lib/http";
import DesktopNav from "./DesktopNav";
import MobileNav from "./MobileNav";

export default function TopBar() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    let cancelled = false;
    const ctrl = new AbortController();

    http
      .get(apiRoutes.getUserHomeData, { signal: ctrl.signal })
      .then((res) => { if (!cancelled) setUser(res.data as User); })
      .catch((err) => {
        if (cancelled || err.name === "CanceledError" || err.name === "AbortError") return;
        console.error(err);
      });

    return () => { cancelled = true; ctrl.abort(); };
  }, []);

  return (
    <nav role="navigation" className="fixed w-full h-20 bg-main px-6 sm:px-10 flex justify-between items-center z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center">
        <Image
          src="/logo.png"
          alt="LifeGear Logo"
          width={130}
          height={130}
          className="object-contain"
          priority
        />
      </Link>

      <DesktopNav user={user} />
      <MobileNav user={user} />
    </nav>
  );
}
