// app/(main)/activities/[activityId]/error.tsx
"use client";
import ErrorBox from "@/components/ui/ErrorBox";

export default function ErrorFetchDisplay({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <main className="min-h-screen bg-[#F6F1E7] py-10 px-4">
      <section className="max-w-3xl mx-auto">
        <ErrorBox message={error.message} onRetry={reset} />
      </section>
    </main>
  );
}
