"use client";

import Image from "next/image";
import Skeleton from "@/components/common/Skeleton";
import ErrorBox from "@/components/common/ErrorBox";
import { useActivityDetail } from "@/hooks/useActivityDetail";
import { useFallbackImage } from "@/hooks/useFallbackImage";
import { AddToCalendarButton } from "@/components/AddToCalendarButton";
import type { Props } from "@/types/subActivity";
import { SubActivityDetail } from "./SubActivityDetail";

export default function SubActivityClient({ activityId }: Props) {

  const {
    data,
    loading,
    error,
    thumb,
    refetch,
  } = useActivityDetail(activityId);

  const { displaySrc, setImgError } = useFallbackImage(
    data?.image_url || data?.image_path || undefined
  );

  const title = data?.title ?? thumb?.title ?? "รายละเอียดกิจกรรม";

  return (
    <main className="min-h-screen bg-primary py-10 px-4">
      <section className="max-w-3xl mx-auto bg-white rounded-[28px] shadow-xl p-6 sm:p-10">
        <h1 className="text-2xl sm:text-3xl font-extrabold text-[#730217] tracking-tight mb-6">
          กิจกรรม “{title}”
        </h1>

        {loading && <Skeleton />}

        {error && !loading && (
          <ErrorBox message={error} onRetry={() => refetch()} />
        )}

        {!loading && !error && (
          <>
            <div className="relative mb-8 aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-[0_12px_30px_rgba(0,0,0,0.15)]">
              <Image
                src={displaySrc}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                className="object-cover"
                priority
                onError={() => setImgError(true)}
              />
            </div>

            {data?.description?.trim() && (
              <p className="text-center text-main font-bold text-lg sm:text-xl leading-relaxed mb-8 max-w-md mx-auto px-1">
                “{data.description.trim()}”
              </p>
            )}

            <div className="space-y-3 mb-10 text-black text-lg ">
              <SubActivityDetail activityId={activityId} />
            </div>

            <div className="flex flex-col sm:flex-row justify-end">
              <AddToCalendarButton
                onClick={() => {
                  alert("เพิ่มลงในตารางชีวิตเรียบร้อย!");
                }}
              />
            </div>
          </>
        )}
      </section>
    </main>
  );
}
