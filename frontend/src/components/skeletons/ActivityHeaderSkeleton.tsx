// src/components/skeletons/ActivityHeaderSkeleton.tsx
"use client";
import { Skeleton } from "@/components/ui/skeleton";

export default function ActivityHeaderSkeleton() {
  return (
    <header className="mb-8 mt-2 text-center">
      <Skeleton className="h-10 w-2/3 mx-auto rounded-xl" />
    </header>
  );
}
