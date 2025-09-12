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
    const verify = async () => {
      if (pathname === "/login") {
        setIsAuthenticated(true);
        setIsLoading(false);
        return;
      }

      const ok = await checkAuth();
      if (ok) {
        setIsAuthenticated(true);
      } else {
        router.replace("/login");
      }
      setIsLoading(false);
    };

    verify();
  }, [pathname, router]);

  if (isLoading) return <h1>Loading...</h1>;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
