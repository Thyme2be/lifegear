"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  formatDateThaiFromIso,
  formatTimeThaiFromIso,
  sameDay,
} from "@/lib/datetime";

type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  startAt?: string;
  endAt?: string;
};

export default function AddToLifeModal({
  open,
  onCancel,
  onConfirm,
  title = "ยืนยันเพิ่มกิจกรรมนี้ลงในตารางชีวิต?",
  startAt,
  endAt,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const confirmBtnRef = useRef<HTMLButtonElement | null>(null);

  // mount สำหรับ portal
  useEffect(() => setMounted(true), []);

  // ล็อกสกอร์ลหน้าเมื่อเปิด
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // ESC + focus trap + autofocus
  useEffect(() => {
    if (!open) return;

    confirmBtnRef.current?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
      if (e.key === "Tab") {
        const root = panelRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;

        if (e.shiftKey && active === first) {
          last?.focus();
          e.preventDefault();
        } else if (!e.shiftKey && active === last) {
          first?.focus();
          e.preventDefault();
        }
      }
    };

    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onCancel]);

  if (!mounted || !open) return null;

  // ===== แปลงวันที่/เวลาแบบที่ต้องการ =====
  const startD = startAt ? new Date(startAt) : null;
  const endD = endAt ? new Date(endAt) : null;
  const startValid = !!(startD && !Number.isNaN(startD.valueOf()));
  const endValid = !!(endD && !Number.isNaN(endD.valueOf()));

  const dateBlock = (() => {
    if (startValid && endValid && startD && endD) {
      if (sameDay(startD, endD)) {
        // วันเดียวกัน: "พ., 12 พ.ย. 2568 • 10:00–12:00 น."
        const dLabel = formatDateThaiFromIso(startAt!) ?? "";
        const tStart =
          formatTimeThaiFromIso(startAt!)?.replace(" น.", "") ?? "";
        const tEnd = formatTimeThaiFromIso(endAt!) ?? "";
        return `${dLabel} • ${tStart}–${tEnd}`;
      } else {
        // คนละวัน: "12 พ.ย. 2568 10:00 น. → 13 พ.ย. 2568 12:00 น."
        const s = `${formatDateThaiFromIso(startAt!) ?? ""} ${
          formatTimeThaiFromIso(startAt!) ?? ""
        }`;
        const e = `${formatDateThaiFromIso(endAt!) ?? ""} ${
          formatTimeThaiFromIso(endAt!) ?? ""
        }`;
        return `${s} → ${e}`;
      }
    }
    if (startValid && startAt) {
      const s = `${formatDateThaiFromIso(startAt) ?? ""} ${
        formatTimeThaiFromIso(startAt) ?? ""
      }`;
      return s;
    }
    if (endValid && endAt) {
      const e = `${formatDateThaiFromIso(endAt) ?? ""} ${
        formatTimeThaiFromIso(endAt) ?? ""
      }`;
      return e;
    }
    return null;
  })();

  const body = (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px] animate-fadeIn cursor-pointer"
        onClick={onCancel}
      />
      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="addlife-title"
        onClick={(e) => e.stopPropagation()}
        className="relative mx-4 w-full max-w-md rounded-2xl bg-white shadow-2xl border border-neutral-200 animate-scaleIn"
      >
        {/* close x */}
        <button
          type="button"
          aria-label="Close"
          onClick={onCancel}
          className="absolute right-3 top-3 rounded-full p-1 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-main/40 cursor-pointer"
        >
          <svg viewBox="0 0 20 20" className="h-5 w-5">
            <path
              d="M6 6l8 8M14 6l-8 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        <div className="px-6 pt-8 pb-5 text-center">
          {/* icon */}
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-main/10">
            <svg viewBox="0 0 24 24" className="h-9 w-9 text-main">
              <path
                d="M12 5v14M5 12h14"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>

          <h2 id="addlife-title" className="text-2xl font-bold text-main">
            {title}
          </h2>

          <p className="mt-2 text-sm text-neutral-600">
            ระบบจะบันทึกกิจกรรมไว้ใน “ตารางชีวิต” ของคุณ
          </p>

          {dateBlock && (
            <div className="mt-4 text-sm text-neutral-700 bg-neutral-50 border rounded-xl px-4 py-3 text-left">
              <div className="font-semibold mb-1">ตารางเวลา</div>
              <div>{dateBlock}</div>
            </div>
          )}

          <div className="mt-6 flex items-center justify-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg bg-neutral-200 px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-300 focus:outline-none focus:ring-2 focus:ring-neutral-400/50 cursor-pointer"
            >
              ยกเลิก
            </button>
            <button
              type="button"
              ref={confirmBtnRef}
              onClick={onConfirm}
              className="rounded-lg bg-main px-4 py-2 text-sm font-semibold text-white hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-main/50 cursor-pointer"
              autoFocus
            >
              ยืนยันเพิ่ม
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(body, document.body);
}
