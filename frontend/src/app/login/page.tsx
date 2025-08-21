import Image from "next/image";

export default function Page() {
  return (
    <div className="h-screen w-full bg-[url('/background_login2.png')] bg-no-repeat bg-cover bg-center flex items-center justify-center p-120">
      {/* Header */}
      <header className="absolute top-0 left-0 w-full px-10 py-5 flex items-center z-[99]">
        <Image 
          src="/logo.png" 
          alt="LifeGear Logo" 
          width={300} 
          height={300} 
          className="object-contain"
        />
      </header>

      {/* Login Box */}
      <div className="w-[400px] h-[500px] bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl">
        <div className="w-full p-5">
          <h1 className="text-4xl font-serifthai text-center text-black font-extrabold">
            เข้าสู่ระบบ
          </h1>

          <form action="#" className="mt-10 space-y-6">
            {/* Student ID */}
            <div className="space-y-2">
              <label className="block text-lg text-black font-extrabold">
                เลขทะเบียนนักศึกษา
              </label>
              <input
                type="text"
                required
                placeholder="6xxxxxxxxx"
                className="w-full h-12 bg-transparent border border-white rounded-2xl px-3 outline-none text-black p-4
                shadow-[4px_4px_12px_rgba(107,114,128,0.3),-4px_-4px_12px_rgba(107,114,128,0.3)]"
              />
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label className="block text-lg text-black font-extrabold">
                รหัสผ่าน
              </label>
              <input
                type="password"
                required
                placeholder="Tsexxxxx"
                className="w-full h-12 bg-transparent border border-white rounded-2xl px-3 outline-none text-black p-4
                shadow-[4px_4px_12px_rgba(107,114,128,0.3),-4px_-4px_12px_rgba(107,114,128,0.3)]"
              />
            </div>

            {/* Remember & Forgot */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center text-black font-bold">
                <input type="checkbox" className="w-7 h-7 mr-2" />
                 อนุมัติเงื่อนไขบริการ
                <a href="#" className="text-blue-700 hover:underline decoration-2">
                อ่านเพิ่มเติม
              </a>
              </label>
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full py-3 bg-[#F1D500] text-black font-extrabold rounded-full text-2xl "
            >
              เข้าสู่ระบบ
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
