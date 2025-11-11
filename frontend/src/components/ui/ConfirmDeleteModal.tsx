"use client";

import React from "react";
import Modal from "./Modal";

type Props = {
  open: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  title?: string;
  description?: string;
  confirmText?: string;
  cancelText?: string;
};

export default function ConfirmDeleteModal({
  open,
  onCancel,
  onConfirm,
  title = "ยืนยันการยกเลิก?",
  description = "หากกดยกเลิก ผู้ใช้งานต้องทำการเพิ่มกิจกรรมอีกครั้ง",
  confirmText = "ลบกิจกรรม",
  cancelText = "ยกเลิก",
}: Props) {
  return (
    <Modal
      open={open}
      onClose={onCancel}
      title={title}
      description={description}
      size="md"
      icon={
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg viewBox="0 0 24 24" className="h-9 w-9 text-bf-btn">
            <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2" />
            <path d="M9 9l6 6M15 9l-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          </svg>
        </div>
      }
      actions={[
        { label: cancelText, variant: "secondary", onClick: onCancel },
        { label: confirmText, variant: "danger", onClick: onConfirm, autoFocus: true },
      ]}
      className="text-neutral-800"
    />
  );
}
