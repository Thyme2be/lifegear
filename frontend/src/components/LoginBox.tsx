"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import React, { FormEvent, useState } from "react";
import { toast } from "react-toastify"; // ใช้ toast อย่างเดียว; ToastContainer ให้ไปอยู่ที่ layout
import TermsModal from "./TermsModal";
import { apiRoutes } from "@/lib/apiRoutes";
import { FaEye, FaEyeSlash } from "react-icons/fa";

/* ===================== Error helpers ===================== */
type FastAPIValidationItem = { loc?: (string | number)[]; msg?: string };
type FastAPIErrorShape = {
  detail?: string | FastAPIValidationItem[] | unknown;
  errors?: FastAPIValidationItem[];
};

function extractError(err: unknown): string {
  // ดีฟอลต์
  let message = "เข้าสู่ระบบผิดพลาด";

  if (!axios.isAxiosError(err)) return message;

  const status = err.response?.status;
  const data = (err.response?.data ?? {}) as FastAPIErrorShape;

  // 1) ดึงข้อความหลักจาก body
  if (typeof data?.detail === "string") {
    message = data.detail;
  } else if (Array.isArray(data?.detail) && data.detail[0]?.msg) {
    message = data.detail[0].msg as string;
  } else if (Array.isArray(data?.errors) && data.errors[0]?.msg) {
    message = data.errors[0].msg as string;
  }

  // 2) map ตาม status ยอดฮิต ถ้า backend ไม่ส่งข้อความมา
  if (!message || message === "เข้าสู่ระบบผิดพลาด") {
    if (status === 400) message = "คำขอไม่ถูกต้อง (400)";
    else if (status === 401) message = "รหัสนักศึกษาหรือรหัสผ่านไม่ถูกต้อง";
    else if (status === 403) message = "ไม่มีสิทธิ์เข้าถึง";
    else if (status === 422) message = "ข้อมูลไม่ครบถ้วน/รูปแบบไม่ถูกต้อง (422)";
    else if (status === 429) message = "พยายามบ่อยเกินไป กรุณาลองใหม่ภายหลัง";
    else if (status && status >= 500) message = "เซิร์ฟเวอร์ขัดข้อง กรุณาลองใหม่";
  }

  // 3) ถ้า loc ชี้ฟิลด์ ให้เติมข้อมูลช่วยเหลือในข้อความ
  const feed = Array.isArray(data?.detail) ? data.detail : data?.errors;
  if (Array.isArray(feed) && feed.length) {
    const fields = feed
      .map((e) => String((e.loc || [])[ (e.loc || []).length - 1 ] || ""))
      .filter(Boolean);
    if (fields.length) {
      // แปลงชื่อคุ้นเคย
      const pretty = fields
        .map((k) =>
          k.toLowerCase().includes("username") || k.toLowerCase().includes("student")
            ? "รหัสนักศึกษา"
            : k.toLowerCase().includes("password")
            ? "รหัสผ่าน"
            : k
        )
        .join(", ");
      message += ` (ฟิลด์: ${pretty})`;
    }
  }

  // แถมรหัสสถานะท้าย ๆ (ช่วยดีบั๊ก)
  if (status) message += ` [${status}]`;
  return message;
}
/* ======================================================== */

const LoginBox = () => {
  const router = useRouter();
  const [studentId, setStudentId] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);

const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
  e.preventDefault();

  // ดึงค่า checkbox จาก form โดยไม่ต้องแก้ UI/props ของ input
  const formEl = e.currentTarget;
  const termsEl = formEl.querySelector('input[type="checkbox"]') as HTMLInputElement | null;
  const acceptedTerms = !!termsEl?.checked;

  // ฝั่งเรา validate ให้ขึ้น toast ชัดเจน
  if (!studentId.trim()) {
    toast.error("กรุณากรอกรหัสนักศึกษา");
    return;
  }
  if (!password) {
    toast.error("กรุณาใส่รหัสผ่าน");
    return;
  }
  if (!acceptedTerms) {
    toast.error("กรุณายอมรับเงื่อนไขก่อนเข้าสู่ระบบ");
    return;
  }

  // กันผู้ใช้กดรัว ๆ
  if (submitting) return;
  setSubmitting(true);

  const formData = new URLSearchParams();
  formData.append("username", studentId.trim());
  formData.append("password", password);

  try {
    await toast.promise(
      axios.post(apiRoutes.postLogin, formData, { withCredentials: true }),
      {
        pending: "กำลังเข้าสู่ระบบ…",
        success: "เข้าสู่ระบบสำเร็จ!",
        error: {
          render({ data }) {
            return extractError(data); // ใช้ parser เดิม
          },
        },
      }
    );

    // สำเร็จ → ไปหน้าแรก
    router.push("/");
  } catch {
    // อย่า toast ซ้ำใน catch นี้
  } finally {
    setSubmitting(false);
  }
};


  return (
    <section className="relative w-[90%] max-w-md bg-white border border-gray-200 rounded-3xl p-6 sm:p-8 shadow-2xl">
      <div className="w-full">
        <h1 className="heading text-center text-black font-serif-thai">เข้าสู่ระบบ</h1>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit} noValidate>
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
                (e.target as HTMLInputElement).setCustomValidity("กรุณากรอกรหัสนักศึกษา")
              }
              onInput={(e) => (e.target as HTMLInputElement).setCustomValidity("")}
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
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-bf-btn transition"
                aria-label={showPassword ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"}
              >
                {showPassword ? <FaEye size={20} /> : <FaEyeSlash size={20} />}
              </button>
            </div>
          </div>

          {/* Terms */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center text-sm sm:text-base">
            <div className="flex items-center text-black font-medium font-serif-thai">
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

              <span>
                <TermsModal />
              </span>
            </div>
          </div>

          {/* Login Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              disabled={submitting}
              className="py-3 px-10 bg-[#F1D500] text-black font-extrabold rounded-4xl text-xl sm:text-2xl font-serif-thai cursor-pointer
              hover:bg-[#e0c603] transition-colors duration-100 shadow-md/50 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {submitting ? "กำลังเข้าสู่ระบบ…" : "เข้าสู่ระบบ"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default LoginBox;
