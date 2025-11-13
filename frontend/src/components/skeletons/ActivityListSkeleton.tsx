// src/components/skeletons/ActivityListSkeleton.tsx
"use client";
import ActivityCardSkeleton from "./ActivityCardSkeleton";

export default function ActivityListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <section className="flex flex-col gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ActivityCardSkeleton key={i} />
      ))}
    </section>
  );
}
