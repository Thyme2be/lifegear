import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import LoginBox from "@/components/LoginBox";
import Image from "next/image";

export default async function Page() {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (token) {
    // Redirect to home page if user is already logged in
    redirect("/");
  }

  return (
    <main className="min-h-screen w-full bg-[url('/background_login2.png')] bg-no-repeat bg-cover bg-center flex items-center justify-center p-4 sm:p-45 relative">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full px-4 sm:px-10 py-5 flex items-center z-[99]">
        <Image
          src="/logo.png"
          alt="LifeGear Logo"
          width={250}
          height={250}
          className="object-contain w-[180px] sm:w-[250px] md:w-[300px]"
        />
      </header>

      {/* Login Box */}
      <LoginBox />
    </main>
  );
}
