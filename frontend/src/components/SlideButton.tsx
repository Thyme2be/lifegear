"use client";

import React from "react";

type BtnSize = "xs" | "sm" | "md" | "lg";

type SlideButtonProps = {
  kind: "prev" | "next" | "number";
  numberLabel?: number;          // ใช้เมื่อ kind = "number"
  active?: boolean;              // เฉพาะ number
  disabled?: boolean;
  onClick?: () => void;
  size?: BtnSize;                // default: "sm"
  className?: string;
  "aria-label"?: string;
};

export default function SlideButton({
  kind,
  numberLabel,
  active = false,
  disabled = false,
  onClick,
  size = "sm",
  className,
  ...rest
}: SlideButtonProps) {
  const base =
    "btn transition-all duration-200 ease-in-out font-semibold";

  const sizeClass =
    size === "xs" ? "btn-xs" :
    size === "sm" ? "btn-sm" :
    size === "md" ? "btn-md" : "btn-lg";

  let colorClass = "";

  if (disabled) {
    colorClass = "btn-disabled bg-gray-300 text-gray-500";
  } else {
    if (kind === "number") {
      colorClass = active
        ? "bg-main text-white"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300";
    } else {
      // prev / next
      colorClass =
        "bg-gray-300 text-gray-800 hover:bg-gray-400 hover:brightness-110 active:brightness-95";
    }
  }

  const label =
    kind === "prev" ? "‹" :
    kind === "next" ? "›" :
    String(numberLabel ?? "");

  const ariaLabel =
    rest["aria-label"] ??
    (kind === "prev"
      ? "หน้าก่อนหน้า"
      : kind === "next"
      ? "หน้าถัดไป"
      : `ไปหน้าที่ ${numberLabel}`);

  return (
    <button
      type="button"
      aria-label={ariaLabel}
      disabled={disabled}
      onClick={onClick}
      className={[
        base,
        sizeClass,
        colorClass,
        "rounded-xl",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {label}
    </button>
  );
}
