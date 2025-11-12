"use client";

import React, { useState } from "react";
import { TiDelete } from "react-icons/ti";
import ConfirmDeleteModal from "@/components/ui/ConfirmDeleteModal";
import {
  buttonClasses,
  iconSizeClasses,
  type BtnSize,
} from "@/lib/ui/buttonStyles";

export interface DeleteButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  activityId: string;
  onDelete?: (id: string) => void;
  /** ใช้ modal ยืนยันหรือไม่ (ค่าเริ่มต้น: true) */
  confirm?: boolean;
  /** ข้อความใน modal */
  confirmMessage?: string;
  /** sm | md | lg (ค่าเริ่มต้น: sm) */
  size?: BtnSize;
  loading?: boolean;
  /** aria-label / title */
  label?: string;
  className?: string;

  /** ตั้งค่าข้อความบน ConfirmModal ได้ */
  titleText?: string;
  confirmText?: string;
  cancelText?: string;
}

export default function DeleteButton({
  activityId,
  onDelete,
  confirm = true,
  confirmMessage = "คุณต้องการลบกิจกรรมนี้ออกจากตารางของคุณหรือไม่?",
  size = "sm",
  loading,
  label = "ลบกิจกรรมนี้ออกจากตารางของคุณ",
  className,
  disabled,
  titleText = "ยืนยันการลบกิจกรรม",
  confirmText = "ลบ",
  cancelText = "ยกเลิก",
  ...rest
}: DeleteButtonProps) {
  const [open, setOpen] = useState(false);

  const root = buttonClasses({
    size,
    variant: "danger",
    iconOnly: true,
    className: `cursor-pointer ${className ?? ""}`, // ✅ ใส่ backtick แล้ว
  });

  const handleClick = () => {
    if (disabled || loading) return;
    if (!confirm) {
      onDelete?.(activityId);
      return;
    }
    setOpen(true);
  };

  const handleConfirm = () => {
    onDelete?.(activityId);
    setOpen(false);
  };

  return (
    <>
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
      <ConfirmDeleteModal
        open={open}
        onCancel={() => setOpen(false)}
        onConfirm={handleConfirm}
        title={titleText}
        description={confirmMessage}
        confirmText={confirmText}
        cancelText={cancelText}
      />
    </>
  );
}
