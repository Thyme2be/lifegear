"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { toast, ToastContainer, Bounce } from "react-toastify";
import TermsModal from "./TermsModal";
import "react-toastify/dist/ReactToastify.css";

const LoginBox = () => {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const formData = new URLSearchParams();
      formData.append("username", studentId);
      formData.append("password", password);

      await axios.post(`http://127.0.0.1:8000/v1/api/auth/login`, formData, {
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
        <h1 className="text-3xl sm:text-4xl text-center text-black font-extrabold font-serif-thai text-shadow-lg/20">
          เข้าสู่ระบบ
        </h1>

        <form action="#" className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {/* Student ID */}
          <div className="space-y-2">
            <label className="block text-base sm:text-lg text-black font-extrabold font-serif-thai text-shadow-lg/20">
              เลขทะเบียนนักศึกษา
            </label>
            <input
              type="text"
              required
              placeholder="6xxxxxxxxx"
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
          <div className="space-y-2">
            <label className="block text-base sm:text-lg text-black font-extrabold font-serif-thai text-shadow-lg/20">
              รหัสผ่าน
            </label>
            <input
              type="password"
              required
              placeholder="Tsexxxxx"
              id="password"
              value={password}
              onInvalid={(e) =>
                (e.target as HTMLInputElement).setCustomValidity(
                  "กรุณาใส่รหัสผ่าน"
                )
              }
              onInput={(e) =>
                (e.target as HTMLInputElement).setCustomValidity("")
              }
              onChange={(e) => setPassword(e.target.value)}
              className="w-full h-12 bg-transparent border border-white rounded-2xl px-3 outline-none
                 text-black font-serif-thai p-4 font-semibold
                shadow-[4px_4px_12px_rgba(107,114,128,0.3),-4px_-4px_12px_rgba(107,114,128,0.3)]"
            />
          </div>

          {/* Remember & Forgot */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-base">
            <label className="flex items-center text-black font-medium space-x-2 font-serif-thai">
              <input
                type="checkbox"
                className="w-5 h-5 sm:w-7 sm:h-7 cursor-pointer"
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
              <span>
                อนุมัติเงื่อนไขบริการ
                <TermsModal />
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
