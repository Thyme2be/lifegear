"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import TermsModal from "./TermsModal";
import "react-toastify/dist/ReactToastify.css";
import { apiRoutes } from "@/lib/apiRoutes";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginBox = () => {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append("username", studentId);
      formData.append("password", password);

      await axios.post(apiRoutes.postLogin, formData, {
        withCredentials: true,
      });

      // If login is successful, backend has already set HttpOnly cookie
      toast.success("เข้าสู่ระบบสำเร็จ!", {
        position: "top-center",
        autoClose: 2000,
        theme: "colored",
        transition: Bounce,
      });

      setTimeout(() => router.push("/"), 2000);
    } catch (err) {
      console.error("BACKEND ERROR: " + err);

      toast.error("เข้าสู่ระบบผิดพลาด!", {
        position: "top-center",
        autoClose: 3000,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  return (
    <section className="relative w-[90%] max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xl">
      {/* Toast ด้านบน */}
      <ToastContainer />
      <div className="w-full"></div>

      <div className="w-full">
        <h1 className="heading text-center text-black font-serif-thai">
          เข้าสู่ระบบ
        </h1>

        <form action="#" className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Student ID */}
          <div className="space-y-2">
            <label className="block text-base sm:text-lg text-black font-extrabold font-serif-thai">
              เลขทะเบียนนักศึกษา
            </label>
            <input
              type="text"
              required
              placeholder="Student ID"
              id="studentId"
              value={studentId}
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "กรุณากรอกรหัสนักศึกษา"
                )
              }
              onInput={(e) =>
                (e.target as HTMLInputElement).setCustomValidity("")
              }
              onChange={(e) => setStudentId(e.target.value)}
              className="w-full h-12 bg-transparent border no-spinner border-white rounded-2xl px-3 outline-none
                 text-black font-serif-thai p-4 font-semibold
                shadow-[4px_4px_12px_rgba(107,114,128,0.3),-4px_-4px_12px_rgba(107,114,128,0.3)]"
            />
          </div>

          {/* Password */}
          <div className="space-y-2 relative">
            <label className="block text-base sm:text-lg text-black font-extrabold font-serif-thai">
              รหัสผ่าน
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                id="password"
                value={password}
                onInvalid={(e) =>
                  (e.target as HTMLInputElement).setCustomValidity("กรุณาใส่รหัสผ่าน")
                }
                onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-12 bg-transparent border border-white rounded-2xl pl-3 pr-12 outline-none
                  text-black font-serif-thai p-4 font-semibold
                  shadow-[4px_4px_12px_rgba(107,114,128,0.3),-4px_-4px_12px_rgba(107,114,128,0.3)]"
              />

              {/* Button Eye Toggle */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#B30000] transition"
              >
                {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
              </button>
            </div>
          </div>

          {/* Remember & Forgot */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-base">
            <div className="flex items-center text-black font-medium font-serif-thai">
              {/* checkbox + label */}
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  className="w-5 h-5 sm:w-7 sm:h-7 cursor-pointer appearance-none border-none outline-none
                  shadow-[4px_4px_12px_rgba(107,114,128,0.3),_-4px_-4px_12px_rgba(107,114,128,0.3)]
                  rounded-md bg-white
                  checked:bg-blue-500 checked:shadow-inner
                  transition-all duration-200
                  flex items-center justify-center
                  checked:before:content-['✔'] checked:before:text-white checked:before:text-sm"
                  required
                  onInvalid={(e) =>
                    (e.target as HTMLInputElement).setCustomValidity(
                      "กรุณายอมรับเงื่อนไขก่อนเข้าสู่ระบบ"
                    )
                  }
                  onInput={(e) =>
                    (e.target as HTMLInputElement).setCustomValidity("")
                  }
                />
                <span>อนุมัติเงื่อนไขบริการ</span>
              </label>

              {/* อ่านเพิ่มเติม */}
              <span>
                <TermsModal />
              </span>
            </div>
          </div>

          {/* Login Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="py-3 px-10 bg-[#F1D500] text-black font-extrabold rounded-4xl text-xl sm:text-2xl font-serif-thai cursor-pointer
              hover:bg-[#e0c603] transition-colors duration-100 shadow-md/50"
            >
              เข้าสู่ระบบ
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginBox;
