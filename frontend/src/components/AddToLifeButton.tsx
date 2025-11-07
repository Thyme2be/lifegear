"use client";

import { useState, useCallback } from "react";
import { apiRoutes } from "@/lib/apiRoutes";

type Props = {
  activityId: string;
  onDone?: (id: string) => void;
};

type ErrorBody = { detail?: string };

// parse JSON แบบปลอดภัย
function parseJsonSafe<T>(text: string): T | null {
  try {
    return text ? (JSON.parse(text) as T) : null;
  } catch {
    return null;
  }
}

// ดึง message จาก error แบบ type-safe
function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return "เกิดข้อผิดพลาดไม่ทราบสาเหตุ";
}

export default function AddToLifeButton({ activityId, onDone }: Props) {
  const [loading, setLoading] = useState(false);

  const handleAdd = useCallback(async () => {
    if (!activityId) {
      alert("ไม่พบรหัสกิจกรรม");
      return;
    }
    if (!window.confirm("ยืนยันเพิ่มกิจกรรมนี้ลงในตารางชีวิต?")) return;

    try {
      setLoading(true);

      const res = await fetch(apiRoutes.addActivityToMyLife, {
        method: "POST",
        credentials: "include",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activity_id: activityId }),
        cache: "no-store",
      });

      const text = await res.text().catch(() => "");
      const data = parseJsonSafe<ErrorBody>(text);

      // จัดการสถานะยอดฮิต
      if (res.status === 401) throw new Error("กรุณาเข้าสู่ระบบก่อน");
      if (res.status === 409) throw new Error("คุณได้บันทึกกิจกรรมนี้ไว้แล้ว");
      if (res.status === 422) throw new Error("ข้อมูลไม่ครบถ้วน (activity_id)");
      if (!res.ok) {
        const msg = data?.detail || `ผิดพลาด (${res.status})`;
        throw new Error(msg);
      }

      alert("เพิ่มลงตารางชีวิตสำเร็จ 🎉");
      onDone?.(activityId); // ✅ ส่ง id กลับให้ผู้เรียกใช้
    } catch (e: unknown) {
      console.error(e);
      alert(getErrorMessage(e) || "เพิ่มกิจกรรมไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }, [activityId, onDone]);

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={loading}
      className="px-6 py-3 rounded-full bg-[#B30000] hover:bg-[#880000] disabled:opacity-60 text-white font-bold shadow-md transition"
    >
      {loading ? "กำลังเพิ่ม..." : "เพิ่มลงในตารางชีวิต"}
    </button>
  );
}
