import React from "react";

const LoginBox = () => {
  return (
    <section className="w-[90%] max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xl">
      <div className="w-full">
        <h1
          className="text-3xl sm:text-4xl text-center text-black font-extrabold
          font-serif-thai"
        >
          เข้าสู่ระบบ
        </h1>

        <form action="#" className="mt-8 space-y-6">
          {/* Student ID */}
          <div className="space-y-2">
            <label className="block text-base sm:text-lg text-black font-extrabold font-serif-thai">
              เลขทะเบียนนักศึกษา
            </label>
            <input
              type="text"
              required
              placeholder="6xxxxxxxxx"
              className="w-full h-12 bg-transparent border border-white rounded-2xl px-3 outline-none
                 text-black font-serif-thai p-4 font-semibold
                shadow-[4px_4px_12px_rgba(107,114,128,0.3),-4px_-4px_12px_rgba(107,114,128,0.3)]"
            />
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="block text-base sm:text-lg text-black font-extrabold font-serif-thai">
              รหัสผ่าน
            </label>
            <input
              type="password"
              required
              placeholder="Tsexxxxx"
              className="w-full h-12 bg-transparent border border-white rounded-2xl px-3 outline-none
                 text-black font-serif-thai p-4 font-semibold
                shadow-[4px_4px_12px_rgba(107,114,128,0.3),-4px_-4px_12px_rgba(107,114,128,0.3)]"
            />
          </div>

          {/* Remember & Forgot */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-base">
            <label className="flex items-center text-black font-medium space-x-2 font-serif-thai">
              <input type="checkbox" className="w-5 h-5 sm:w-7 sm:h-7 cursor-pointer" />
              <span>
                อนุมัติเงื่อนไขบริการ
                <a
                  href="#"
                  className="text-blue-700 hover:underline decoration-2 ml-1"
                >
                  อ่านเพิ่มเติม
                </a>
              </span>
            </label>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="w-full py-3 bg-[#F1D500] text-black font-extrabold rounded-full text-xl sm:text-2xl font-serif-thai cursor-pointer
            hover:bg-[#e0c603] transition-colors duration-100"
          >
            เข้าสู่ระบบ
          </button>
        </form>
      </div>
    </section>
  );
};

export default LoginBox;
