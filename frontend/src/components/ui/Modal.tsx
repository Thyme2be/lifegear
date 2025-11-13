"use client";

import React, { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";

type ModalAction = {
  label: string;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "danger";
  autoFocus?: boolean;
  disabled?: boolean;
};

type ModalProps = {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string | React.ReactNode;
  icon?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  actions?: ModalAction[];
  hideCloseX?: boolean;
  closeOnBackdrop?: boolean;
  closeOnEsc?: boolean;
  className?: string;
  children?: React.ReactNode;
  restoreFocus?: boolean; // ✅ ใหม่: คืนโฟกัสให้ trigger เดิม (default: true)
};

const SIZES = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-lg",
};

export default function Modal({
  open,
  onClose,
  title,
  description,
  icon,
  size = "md",
  actions = [],
  hideCloseX = false,
  closeOnBackdrop = true,
  closeOnEsc = true,
  className,
  children,
  restoreFocus = true,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const lastActiveRef = useRef<HTMLElement | null>(null);
  const descId = description ? "modal-desc" : undefined;
  const titleId = title ? "modal-title" : undefined;

  // mount portal
  useEffect(() => setMounted(true), []);

  // lock scroll + remember last active element
  useEffect(() => {
    if (!open) return;
    if (restoreFocus) lastActiveRef.current = document.activeElement as HTMLElement | null;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
      if (restoreFocus) {
        // คืนโฟกัสเมื่อปิด
        setTimeout(() => lastActiveRef.current?.focus(), 0);
      }
    };
  }, [open, restoreFocus]);

  // esc + focus trap
  useEffect(() => {
    if (!open || !closeOnEsc) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab") {
        const root = dialogRef.current;
        if (!root) return;
        const focusables = root.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length < 2) return; // มี 0/1 ชิ้น ไม่ต้อง trap
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        const active = document.activeElement;
        if (e.shiftKey && active === first) {
          last?.focus(); e.preventDefault();
        } else if (!e.shiftKey && active === last) {
          first?.focus(); e.preventDefault();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, closeOnEsc, onClose]);

  // autofocus ปุ่มที่กำหนด
  useEffect(() => {
    if (!open) return;
    const root = dialogRef.current;
    const target = root?.querySelector<HTMLElement>("[data-autofocus='true']");
    target?.focus();
  }, [open]);

  if (!mounted || !open) return null;

  const body = (
    <div aria-hidden={!open} className="fixed inset-0 z-[1000] flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px] animate-fade-in cursor-pointer"
        onClick={() => closeOnBackdrop && onClose()}
      />
      {/* Panel */}
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        onClick={(e) => e.stopPropagation()}
        className={clsx(
          "relative mx-4 w-full rounded-2xl bg-white shadow-2xl animate-scale-in",
          "border border-neutral-200",
          SIZES[size],
          className
        )}
      >
        {!hideCloseX && (
          <button
            aria-label="Close"
            onClick={onClose}
            className="absolute right-3 top-3 rounded-full p-1 hover:bg-neutral-100 focus:outline-none focus:ring-2 focus:ring-main/40 cursor-pointer"
          >
            <svg viewBox="0 0 20 20" className="h-5 w-5">
              <path d="M6 6l8 8M14 6l-8 8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        )}

        {/* Content */}
        <div className="px-6 pt-8 pb-4 text-center">
          {icon && <div className="mx-auto mb-4">{icon}</div>}

          {title && (
            <h2 id={titleId} className="text-2xl font-bold tracking-wide text-main">
              {title}
            </h2>
          )}

          {description && (
            <p id={descId} className="mt-2 text-sm text-neutral-600">
              {description}
            </p>
          )}

          {children}
        </div>

        {/* Actions */}
        {actions.length > 0 && (
          <div className="flex items-center justify-center gap-3 px-6 pb-6">
            {actions.map((a, i) => {
              const base =
                "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-semibold focus:outline-none focus-visible:ring-2 cursor-pointer";
              const style =
                a.variant === "danger"
                  ? "bg-bf-btn text-white hover:brightness-110 focus-visible:ring-bf-btn/50"
                  : a.variant === "primary"
                  ? "bg-main text-white hover:brightness-110 focus-visible:ring-main/50"
                  : "bg-neutral-200 text-neutral-800 hover:bg-neutral-300 focus-visible:ring-neutral-400/50";
              return (
                <button
                  key={i}
                  onClick={a.onClick}
                  disabled={a.disabled}
                  className={clsx(base, style, a.disabled && "opacity-60")}
                  data-autofocus={a.autoFocus ? "true" : undefined}
                  type="button"
                >
                  {a.label}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(body, document.body);
}
