// src/components/DeleteButton.tsx (UPDATED to use shared styles)
// ===============================
"use client";

import React from "react";
import { TiDelete } from "react-icons/ti";
import { buttonClasses, iconSizeClasses, type BtnSize } from "@/lib/ui/buttonStyles";

export interface DeleteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  activityId: string;
  onDelete?: (id: string) => void;
  confirm?: boolean; // default: true
  confirmMessage?: string;
  size?: BtnSize; // default: "sm"
  loading?: boolean;
  label?: string;
  className?: string;
}

export default function DeleteButton({
  activityId,
  onDelete,
  confirm = true,
  confirmMessage = "ยืนยันการลบกิจกรรมนี้ออกจากตารางรายเดือน?",
  size = "sm",
  loading,
  label = "ลบกิจกรรมนี้ออกจากตารางรายเดือน",
  className,
  disabled,
  ...rest
}: DeleteButtonProps) {
  const handleClick = () => {
    if (disabled || loading) return;
    if (confirm && !window.confirm(confirmMessage)) return;
    onDelete?.(activityId);
  };

  const root = buttonClasses({ size, variant: "danger", iconOnly: true, className });

  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled || loading}
      onClick={handleClick}
      className={root}
      {...rest}
    >
      <TiDelete className={iconSizeClasses[size]} />
    </button>
  );
}