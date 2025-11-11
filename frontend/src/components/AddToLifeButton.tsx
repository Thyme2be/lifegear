"use client";

"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter } from "next/navigation";
import { apiRoutes } from "@/lib/apiRoutes";
import AddToLifeModal from "@/components/ui/AddToLifeModal";
import { toast } from "react-toastify/unstyled";
import {
  buttonClasses,
  type BtnSize,
  type BtnVariant,
} from "@/lib/ui/buttonStyles"; // ⬅️ เพิ่ม

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
  // บังคับให้ผ่านตัวแปลไทยเสมอ
  const raw = e instanceof Error ? e.message : typeof e === "string" ? e : "";
  return getThaiErrorMessage(raw);
}

function getThaiErrorMessage(raw: string): string {
  const msg = (raw || "").toLowerCase().trim();

  // สถานะทั่วไป/ข้อความจากเบราว์เซอร์
  if (!navigator.onLine) return "ออฟไลน์อยู่ กรุณาเชื่อมต่ออินเทอร์เน็ต";
  if (msg.includes("failed to fetch") || msg.includes("network"))
    return "เชื่อมต่อเซิร์ฟเวอร์ไม่ได้ กรุณาลองใหม่อีกครั้ง";
  if (msg.includes("timeout")) return "หมดเวลารอการตอบสนอง กรุณาลองใหม่";
  if (msg.includes("unauthorized") || msg.includes("401"))
    return "กรุณาเข้าสู่ระบบก่อน";
  if (msg.includes("forbidden") || msg.includes("403"))
    return "ไม่มีสิทธิ์ทำรายการนี้";
  if (msg.includes("not found") || msg.includes("404"))
    return "ไม่พบข้อมูลที่ต้องการ";
  if (msg.includes("conflict") || msg.includes("409"))
    return "คุณได้บันทึกกิจกรรมนี้ไว้แล้ว";
  if (msg.includes("unprocessable") || msg.includes("422"))
    return "ข้อมูลไม่ครบถ้วนหรือไม่ถูกต้อง";

  // ⬇️ เคสข้อความอังกฤษที่ BE มักส่งมา
  if (
    /already added|already exists|duplicate|you have already added/i.test(raw)
  ) {
    return "คุณได้บันทึกกิจกรรมนี้ไว้แล้ว";
  }

  // ถ้าเป็นข้อความไทยอยู่แล้ว ก็คืนกลับ
  if (/[ก-๙]/.test(raw)) return raw;

  // ค่าปริยาย
  return raw ? `เกิดข้อผิดพลาด: ${raw}` : "เกิดข้อผิดพลาดไม่ทราบสาเหตุ";
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
  className,
  fullWidth = false,
  size = "sm", // ⬅️ เพิ่ม: ให้ค่าเริ่มต้นเท่ากับปุ่มตัวหนังสือ
  variant = "primary", // ⬅️ เพิ่ม: ให้โทนสีเดียวกับ MoreInfo แบบ text
}: {
  activityId: string;
  startAt?: string;
  endAt?: string;
  onDone?: (
    result: { ok: true; id: string } | { ok: false; error: unknown }
  ) => void;
  forceDisabled?: boolean;
  className?: string;
  fullWidth?: boolean;
  size?: BtnSize; // ⬅️ เพิ่ม
  variant?: BtnVariant; // ⬅️ เพิ่ม
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // ⬇️ ใช้ buttonClasses เหมือน MoreInfoButton (โทน/ขนาดจะตรงกัน)
  const btnClasses = buttonClasses({
    size,
    variant,
    className: [
      fullWidth ? "w-full" : "w-auto",
      // interaction + disabled states ให้เหมือนกัน
      "transition hover:scale-[1.03] active:scale-[0.98] cursor-pointer",
      "disabled:bg-gray-400 disabled:text-gray-100 disabled:cursor-not-allowed disabled:pointer-events-none",
      className ?? "",
    ].join(" "),
  });

  useEffect(() => {
    if (!showConfirm) return;
    const onKey = (e: KeyboardEvent) =>
      e.key === "Escape" && setShowConfirm(false);
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [showConfirm]);

  const now = new Date();
  const start = startAt ? new Date(startAt) : undefined;
  const end = endAt ? new Date(endAt) : undefined;

  const startValid = !startAt || !Number.isNaN(start?.valueOf());
  const endValid = !endAt || !Number.isNaN(end?.valueOf());

  const isPast =
    endValid && end ? now > end : startValid && start ? now > start : false;
  const isOngoing =
    startValid && endValid && start && end ? now >= start && now <= end : false;

  const disabled = forceDisabled || loading || (isPast && !isOngoing);

  const doAdd = useCallback(async () => {
    const fail = (err: unknown) => {
      const msg = getErrorMessage(err);
      toast.error(msg);
      onDone?.({ ok: false, error: msg });
    };

    try {
      if (!activityId) return fail("ไม่พบรหัสกิจกรรม");

      const normalizedId = decodeURIComponent(activityId.trim());
      if (!UUID_RE.test(normalizedId))
        return fail("รหัสกิจกรรมไม่ถูกต้อง (ต้องเป็น UUID)");

      if (isPast && !isOngoing)
        return fail("กิจกรรมนี้สิ้นสุดไปแล้ว ไม่สามารถเพิ่มได้");

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

      router.replace(`/activity/${normalizedId}`);
      router.refresh();

      onDone?.({ ok: true, id: normalizedId });
    } catch (e) {
      console.error(e);
      fail(e);
    } finally {
      setLoading(false);
      setShowConfirm(false);
    }
  }, [activityId, isPast, isOngoing, onDone, router]);

  return (
    <>
      <button
        type="button"
        onClick={() => !disabled && setShowConfirm(true)}
        disabled={disabled}
        className={btnClasses}
        title={disabled ? "กิจกรรมนี้สิ้นสุดไปแล้ว" : undefined}
        aria-disabled={disabled}
      >
        {loading ? "กำลังเพิ่ม..." : "เพิ่มลงในตารางชีวิต"}
      </button>

      <AddToLifeModal
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        onConfirm={doAdd}
        startAt={startAt}
        endAt={endAt}
      />
    </>
  );
}
