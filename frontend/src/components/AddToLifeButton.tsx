"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { apiRoutes } from "@/lib/apiRoutes";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

type ErrorBody = { detail?: string };

function parseJsonSafe<T>(text: string): T | null {
  try {
    return text ? (JSON.parse(text) as T) : null;
  } catch {
    return null;
  }
}
function getErrorMessage(e: unknown): string {
  if (e instanceof Error) return e.message;
  if (typeof e === "string") return e;
  return "เกิดข้อผิดพลาดไม่ทราบสาเหตุ";
}

const ADDED_IDS_KEY = "lifgear:added-ids";
function readAddedIds(): string[] {
  try {
    return JSON.parse(localStorage.getItem(ADDED_IDS_KEY) || "[]");
  } catch {
    return [];
  }
}
function addAddedId(id: string) {
  const cur = new Set(readAddedIds());
  cur.add(id);
  localStorage.setItem(ADDED_IDS_KEY, JSON.stringify([...cur]));
}

export default function AddToLifeButton({
  activityId,
  startAt,
  endAt,
  onDone,
  forceDisabled = false,
}: {
  activityId: string;
  startAt?: string;
  endAt?: string;
  onDone?: (id: string) => void;
  forceDisabled?: boolean;
}) {
  const router = useRouter(); // ✅ เพิ่ม
  const [loading, setLoading] = useState(false);

  const now = new Date();
  const start = startAt ? new Date(startAt) : undefined;
  const end = endAt ? new Date(endAt) : undefined;
  const isPast = end ? now > end : start ? now > start : false;
  const isOngoing = start && end ? now >= start && now <= end : false;
  const disabled = forceDisabled || loading || (isPast && !isOngoing);

  const handleAdd = useCallback(async () => {
    if (forceDisabled) return;
    if (!activityId) return alert("ไม่พบรหัสกิจกรรม");

    const normalizedId = decodeURIComponent(activityId.trim());
    if (!UUID_RE.test(normalizedId)) {
      alert("รหัสกิจกรรมไม่ถูกต้อง (ต้องเป็น UUID)");
      return;
    }

    if (isPast && !isOngoing)
      return alert("กิจกรรมนี้สิ้นสุดไปแล้ว ไม่สามารถเพิ่มได้");
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
        body: JSON.stringify({ activity_id: normalizedId }),
        cache: "no-store",
      });

      const text = await res.text().catch(() => "");
      const data = parseJsonSafe<ErrorBody>(text);
      if (res.status === 401) throw new Error("กรุณาเข้าสู่ระบบก่อน");
      if (res.status === 409) throw new Error("คุณได้บันทึกกิจกรรมนี้ไว้แล้ว");
      if (res.status === 422) throw new Error("ข้อมูลไม่ครบถ้วน (activity_id)");
      if (!res.ok) throw new Error(data?.detail || `ผิดพลาด (${res.status})`);

      addAddedId(normalizedId);
      window.dispatchEvent(
        new CustomEvent("lifgear:activity-added", {
          detail: { id: normalizedId },
        })
      );

      alert("เพิ่มลงตารางชีวิตสำเร็จ 🎉");
      onDone?.(normalizedId);

      // ✅ เปลี่ยนเส้นทางไป canonical URL แบบ id เสมอ แล้ว refresh
      router.replace(`/activity/${normalizedId}`);
      router.refresh();
    } catch (e) {
      console.error(e);
      alert(getErrorMessage(e) || "เพิ่มกิจกรรมไม่สำเร็จ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }, [activityId, isPast, isOngoing, onDone, router]);

  return (
    <button
      type="button"
      onClick={handleAdd}
      disabled={disabled}
      className="px-6 py-3 rounded-full bg-[#B30000] hover:bg-[#880000] disabled:opacity-60 text-white font-bold shadow-md transition"
      title={disabled ? "กิจกรรมนี้สิ้นสุดไปแล้ว" : undefined}
      aria-disabled={disabled}
    >
      {loading ? "กำลังเพิ่ม..." : "เพิ่มลงในตารางชีวิต"}
    </button>
  );
}
