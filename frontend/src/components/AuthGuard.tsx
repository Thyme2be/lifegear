"use client";

import { useEffect, useState, ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { checkAuth } from "@/lib/checkAuth";

type AuthGuardProps = { children: ReactNode };

export default function AuthGuard({ children }: AuthGuardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let alive = true;

    if (pathname === "/login") {
      setIsAuthenticated(true);
      setIsLoading(false);
      return;
    }

    async function verify() {
      try {
        const ok = await checkAuth();
        if (!alive) return;

        if (ok) {
          setIsAuthenticated(true);
        } else {
          router.replace("/login");
        }
      } catch {
        if (!alive) return;
        router.replace("/login");
      } finally {
        if (alive) setIsLoading(false);
      }
    }

    router.prefetch?.("/login");
    verify();

    return () => {
      alive = false;
    };
  }, [pathname, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span className="loading loading-infinity loading-xl text-main" />
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
