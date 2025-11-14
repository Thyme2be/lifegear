"use client";

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";

const TermsModal = () => {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const closeBtnRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = prev; };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    closeBtnRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
      if (e.key === "Tab") {
        const root = panelRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement as HTMLElement | null;
        if (e.shiftKey && active === first) { last?.focus(); e.preventDefault(); }
        else if (!e.shiftKey && active === last) { first?.focus(); e.preventDefault(); }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => triggerRef.current?.focus(), 0);
  };

  const body = !open ? null : (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overscroll-contain"
      aria-hidden={!open}
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-fade-in cursor-pointer"
        onClick={handleClose}
      />
      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="terms-title"
        onClick={(e) => e.stopPropagation()}
        className="relative mx-4 w-[90%] max-w-lg rounded-2xl bg-white shadow-2xl border border-neutral-200 animate-scale-in"
      >
        <button
          type="button"
          aria-label="Close"
          onClick={handleClose}
          className="absolute right-3 top-3 rounded-full p-1 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-main/40 cursor-pointer"
          ref={closeBtnRef}
        >
          <svg viewBox="0 0 20 20" className="h-5 w-5">
            <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </button>

        <div className="px-6 pt-8 pb-4 text-center">
          <h2 id="terms-title" className="text-2xl font-bold mb-4 text-main">
            เงื่อนไขการใช้งาน
          </h2>

          <div className="text-sm text-gray-700 space-y-3 max-h-72 overflow-y-auto text-left">
            <p>1. ผู้ใช้งานต้องใช้ระบบ LifeGear อย่างสุจริต ไม่ละเมิดสิทธิ์หรือก่อความเสียหายแก่ผู้อื่น</p>
            <p>2. ห้ามเผยแพร่หรือใช้งานระบบเพื่อการทุจริต รวมถึงการเข้าถึงข้อมูลที่ไม่ได้รับอนุญาต</p>
            <p>3. ทีมพัฒนาอาจมีการเปลี่ยนแปลง/ปรับปรุงบริการ โดยไม่ต้องแจ้งล่วงหน้า</p>
            <p>4. ข้อมูลที่กรอกในระบบจะถูกจัดเก็บตามมาตรฐานความปลอดภัย และใช้เพื่อวัตถุประสงค์ทางการศึกษาเท่านั้น</p>
            <p>5. การเข้าสู่ระบบถือว่าผู้ใช้ยอมรับเงื่อนไขข้างต้นโดยสมบูรณ์</p>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              type="button"
              onClick={handleClose}
              className="px-6 py-2 rounded-full bg-main text-white font-semibold hover:brightness-110 focus:outline-none focus:ring-2 focus:ring-main/40 cursor-pointer"
            >
              ปิด
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen(true)}
        className="text-blue-700 underline decoration-2 ml-0.5 cursor-pointer hover:opacity-90"
      >
        อ่านเพิ่มเติม
      </button>
      {mounted ? createPortal(body, document.body) : null}
    </>
  );
};

export default TermsModal;
