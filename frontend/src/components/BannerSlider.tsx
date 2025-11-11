// src/components/BannerSlider.tsx
"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Slider, { type Settings } from "react-slick";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import { apiRoutes } from "@/lib/apiRoutes";
import type { ActivityThumbnailResponse } from "@/types/activities";

export type BannerSliderProps = {
  source?: "mine" | "reco";
};

/* ========== Utils ========== */
function resolveImageUrl(path?: string | null) {
  if (!path) return "/fallback-activity.png";
  if (/^https?:\/\//i.test(path)) return path;
  const base = process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/+$/, "") || "";
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}
function isThumb(x: unknown): x is ActivityThumbnailResponse {
  if (!x || typeof x !== "object") return false;
  const o = x as Record<string, unknown>;
  return typeof o.id === "string" && typeof o.title === "string";
}

/* ========== Component ========== */
export default function BannerSlider({ source = "reco" }: BannerSliderProps) {
  const [activities, setActivities] = useState<ActivityThumbnailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [current, setCurrent] = useState(0);
  const sliderRef = useRef<Slider | null>(null);

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    const ac = new AbortController();
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await fetch(apiRoutes.getAllActivitiesThumbnails, {
          credentials: "include",
          signal: ac.signal,
          headers: { Accept: "application/json" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const list = Array.isArray(data) ? data.filter(isThumb) : [];
        const withImg = list.filter((a) => !!a.image_path);
        setActivities(withImg.slice(0, 7));
      } catch (err: any) {
        if (err?.name !== "AbortError") {
          console.error("โหลดกิจกรรมไม่สำเร็จ:", err);
          setError("โหลดรูปกิจกรรมไม่สำเร็จ กรุณาลองใหม่");
        }
      } finally {
        setLoading(false);
      }
    })();
    return () => ac.abort();
  }, []);

  const slides = useMemo(() => activities, [activities]);

  const settings: Settings = {
    dots: false,
    infinite: slides.length > 1,
    speed: reduceMotion ? 0 : 600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false,
    pauseOnHover: true,
    accessibility: true,
    beforeChange: (_old, next) => setCurrent(next),
  };

  if (loading) {
    return (
      <section
        className="w-full max-w-6xl mx-auto px-3 sm:px-4 pt-6"
        aria-busy="true"
        aria-live="polite"
      >
        <div className="relative rounded-xl shadow-xl overflow-hidden">
          <div className="aspect-[16/9] bg-gray-100">
            <div className="h-full w-full animate-pulse bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100" />
          </div>
        </div>
        <p className="mt-3 text-center text-gray-600">กำลังโหลดกิจกรรม…</p>
      </section>
    );
  }

  if (error || slides.length === 0) {
    return (
      <section className="w-full max-w-6xl mx-auto px-3 sm:px-4 pt-6">
        <div
          className="rounded-xl border bg-red-50 text-red-700 p-4"
          role="alert"
        >
          {error ?? "ยังไม่มีกิจกรรมสำหรับแสดง"}
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-6xl mx-auto px-3 sm:px-4 pt-6">
      <div className="relative rounded-xl shadow-xl">
        <div className="relative overflow-hidden rounded-xl h-[190px] sm:h-[260px] md:h-auto md:aspect-[16/9]">
          <Slider
            ref={sliderRef}
            {...settings}
            className="h-full [&_.slick-list]:h-full [&_.slick-track]:h-full [&_.slick-slide]:h-full [&_.slick-slide>div]:h-full"
          >
            {slides.map((a, idx) => {
              const imgUrl = resolveImageUrl(a.image_path);
              const q = source === "mine" ? "?src=mine" : "";
              return (
                <div key={a.id} className="relative h-full w-full">
                  <Link
                    href={`/activity/${encodeURIComponent(a.id)}${q}`}
                    aria-label={a.title}
                    className="block relative h-full w-full"
                    prefetch={false}
                  >
                    <Image
                      src={imgUrl}
                      alt={a.title}
                      fill
                      priority={idx === 0}
                      sizes="100vw"
                      className="object-cover md:object-contain"
                    />
                  </Link>
                </div>
              );
            })}
          </Slider>

          {/* ปุ่มซ้าย/ขวา (เดิม) */}
          {slides.length > 1 && (
            <>
              <button
                onClick={() => sliderRef.current?.slickPrev()}
                aria-label="ก่อนหน้า"
                className="absolute inset-y-0 left-0 w-[20%] sm:w-[16%] lg:w-[12%] flex items-center justify-start pl-3 sm:pl-4 bg-gradient-to-r bg-black/20 to-transparent hover:bg-black/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/60 z-30"
              >
                <IoIosArrowBack className="text-white drop-shadow text-4xl sm:text-5xl" />
              </button>
              <button
                onClick={() => sliderRef.current?.slickNext()}
                aria-label="ถัดไป"
                className="absolute inset-y-0 right-0 w-[20%] sm:w-[16%] lg:w-[12%] flex items-center justify-end pr-3 sm:pr-4 bg-gradient-to-l bg-black/20 to-transparent hover:bg-black/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/60 z-30"
              >
                <IoIosArrowForward className="text-white drop-shadow text-4xl sm:text-5xl" />
              </button>
            </>
          )}
        </div>
      </div>

      {slides.length > 1 && (
        <nav
          className="mt-4 flex items-center justify-center gap-3"
          aria-label="ตัวเลือกสไลด์"
        >
          {slides.map((_s, idx) => {
            const active = idx === current;
            return (
              <button
                key={idx}
                type="button"
                aria-label={`ไปยังสไลด์ที่ ${idx + 1}`}
                aria-current={active ? "true" : undefined}
                onClick={() => sliderRef.current?.slickGoTo(idx)}
                className="group p-2 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/60 rounded-full"
              >
                <span
                  className={[
                    "block rounded-full transition-transform duration-200",
                    "h-2.5 w-2.5 md:h-3 md:w-3",
                    active
                      ? "bg-[#E6B800] scale-110 shadow"
                      : "bg-black/70 group-hover:bg-black",
                  ].join(" ")}
                />
              </button>
            );
          })}
        </nav>
      )}
    </section>
  );
}
