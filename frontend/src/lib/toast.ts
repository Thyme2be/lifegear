"use client";
import { toast, ToastOptions } from "react-toastify";

// ✅ ค่าพื้นฐาน (base option)
const base: ToastOptions = {
  position: "top-center",
  autoClose: 2000,
  theme: "colored",
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

// ✅ helper สำหรับเรียก toast
export const toastSuccess = (msg: string, opt?: ToastOptions) =>
  toast.success(msg, { ...base, ...opt });

export const toastError = (msg: string, opt?: ToastOptions) =>
  toast.error(msg, { ...base, ...opt });

export const toastInfo = (msg: string, opt?: ToastOptions) =>
  toast.info(msg, { ...base, ...opt });
