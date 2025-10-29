"use client";

export default function Skeleton() {
  return (
    <div className="animate-pulse mb-8" role="status" aria-live="polite">
      <div className="relative aspect-[16/9] w-full rounded-3xl bg-gray-200 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 rounded w-2/3" />
    </div>
  );
}