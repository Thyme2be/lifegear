"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import LoginBox from "@/components/LoginBox";
import { checkAuth } from "@/lib/checkAuth";

export default function Page() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  // Bypass authenticated user
  useEffect(() => {
    const verifyAuth = async () => {
      const isAuthenticated = await checkAuth();
      if (isAuthenticated) {
        router.replace("/");
      } else {
        setIsChecking(false);
      }
    };

    verifyAuth();
  }, [router]);

  // Show a loading state while checking auth
  if (isChecking) return <div>Checking login status...</div>;

  return (
    <main className="min-h-screen w-full bg-[url('/background_login2.png')] bg-no-repeat bg-cover bg-center flex items-center justify-center p-4 sm:p-45 relative">
      {/* Header */}
      <header className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-3 w-full px-4 sm:px-10 py-0 flex justify-center items-center z-[99]">
        <Image
          src="/logo.png"
          alt="LifeGear Logo"
          width={250}
          height={250}
          className="object-contain w-[250px] sm:w-[350px] md:w-[400px]"
        />
      </header>

      {/* Login Box */}
      <LoginBox />
    </main>
  );
}
