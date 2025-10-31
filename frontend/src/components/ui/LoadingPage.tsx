// src/components/ui/LoadingPage.tsx
"use client";

import React from "react";

export default function LoadingPage() {
  return (
    <div className="flex h-screen items-center justify-center bg-transparent">
      <span className="loading loading-infinity loading-xl text-main"></span>
    </div>
  );
}
