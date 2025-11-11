"use client";
import React from "react";

export default React.memo(function HeaderGrid({ title }: { title: string }) {
  return (
    <div className="hidden sm:grid grid-cols-4 font-semibold text-black mb-2 normal-text">
      <div className="text-center text-bf-btn">{title}</div>
      <div className="text-center">กำหนดการ</div>
      <div className="text-center">ระยะเวลา</div>
      <div className="text-center">ดำเนินการ</div>
    </div>
  );
});
