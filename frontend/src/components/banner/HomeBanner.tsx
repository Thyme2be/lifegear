// src/components/banner/HomeBannerSlider.tsx
"use client";

import { useEffect, useMemo, useRef, useState, useCallback } from "react";
import Slider, { type Settings } from "react-slick";
import Link from "next/link";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import React from "react";
import { apiRoutes } from "@/lib/apiRoutes";
import type { ActivityThumbnailResponse } from "@/types/activities";
import HomeBannerEmpty from "@/components/banner/HomeBannerEmpty";
import BannerShell from "@/components/banner/BannerShell";
import HomeBannerLoading from "@/components/banner/HomeBannerLoading";
import HomeBannerError from "@/components/banner/HomeBannerError";
import ImageWithFallback from "../ui/FallbackImage";

export type BannerSliderProps = { source?: "mine" | "reco" };

/* Utils */
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

/* รูปแบบ fade-in */
function FadeImage(props: React.ComponentProps<typeof ImageWithFallback>) {
  const [ready, setReady] = useState(false);
  return (
    <ImageWithFallback
      {...props}
      className={`object-cover md:object-contain transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
      // next/image มี onLoadingComplete ส่งมา — forward ให้ฟังก์ชันเรา
      onLoadingComplete={() => setReady(true)}
    />
  );
}

export default function HomeBannerSlider({ source = "reco" }: BannerSliderProps) {
  const [activities, setActivities] = useState<ActivityThumbnailResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firstLoad, setFirstLoad] = useState(true);       // ⬅️ ครั้งแรกจริงๆ
  const [isRefetching, setIsRefetching] = useState(false); // ⬅️ โหลดรอบหลัง ๆ
  const [showEmpty, setShowEmpty] = useState(false);       // ⬅️ หน่วง empty
  const [current, setCurrent] = useState(0);
  const sliderRef = useRef<Slider | null>(null);

  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const fetchSlides = useCallback(async (signal?: AbortSignal) => {
    if (firstLoad) setLoading(true);
    else setIsRefetching(true);

    setError(null);
    try {
      const res = await fetch(apiRoutes.getAllActivitiesThumbnails, {
        credentials: "include",
        signal,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      const list = Array.isArray(data) ? data.filter(isThumb) : [];
      const withImg = list.filter((a) => !!a.image_path);
      setActivities(withImg.slice(0, 7));
    } catch (err: unknown) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      const msg = err instanceof Error ? err.message : "โหลดรูปกิจกรรมไม่สำเร็จ กรุณาลองใหม่";
      setError(msg);
    } finally {
      setLoading(false);
      setIsRefetching(false);
      setFirstLoad(false);
    }
  }, [firstLoad]);

  const handleRetry = useCallback(() => {
    const ac = new AbortController();
    fetchSlides(ac.signal);
    return () => ac.abort();
  }, [fetchSlides]);

  useEffect(() => {
    const ac = new AbortController();
    fetchSlides(ac.signal);
    return () => ac.abort();
  }, [fetchSlides]);

  // หน่วง empty 250ms เพื่อกันแฟลชถ้าข้อมูลกำลังมา
  useEffect(() => {
    if (!firstLoad && !loading && activities.length === 0) {
      const t = setTimeout(() => setShowEmpty(true), 250);
      return () => clearTimeout(t);
    }
    setShowEmpty(false);
  }, [firstLoad, loading, activities.length]);

  const slides = useMemo(() => activities, [activities]);

  const settings: Settings = {
    dots: false,
    infinite: true,
    speed: reduceMotion ? 0 : 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    beforeChange: () => {},
    afterChange: (index: number) => setCurrent(index),
    autoplay: !reduceMotion,
    autoplaySpeed: 5000,
  };

  /* States */
if (firstLoad && loading) return <HomeBannerLoading />;
if (error && slides.length === 0) return <HomeBannerError message={error} onRetry={handleRetry} />;
if (showEmpty) return <HomeBannerEmpty />;


  /* Normal */
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
                    <FadeImage
                      src={imgUrl}
                      fallback="/fallback-activity.png"
                      alt={a.title}
                      fill
                      priority={idx === 0}
                      sizes="100vw"
                    />
                  </Link>
                </div>
              );
            })}
          </Slider>

          {/* ระหว่าง refetch แสดง overlay เบา ๆ แต่คงสไลด์เดิมไว้ */}
          {isRefetching && (
            <div className="pointer-events-none absolute inset-0 rounded-xl bg-white/20 animate-pulse" />
          )}

          {slides.length > 1 && (
            <>
              <button
                onClick={() => sliderRef.current?.slickPrev()}
                aria-label="ก่อนหน้า"
                className="absolute inset-y-0 left-0 w-[20%] sm:w-[16%] lg:w-[12%] flex items-center justify-start pl-3 sm:pl-4 from-black/20 to-transparent bg-gradient-to-r hover:from-black/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/60 z-30"
              >
                <IoIosArrowBack className="text-white drop-shadow text-4xl sm:text-5xl" />
              </button>
              <button
                onClick={() => sliderRef.current?.slickNext()}
                aria-label="ถัดไป"
                className="absolute inset-y-0 right-0 w-[20%] sm:w-[16%] lg:w-[12%] flex items-center justify-end pr-3 sm:pr-4 from-black/20 to-transparent bg-gradient-to-l hover:from-black/30 focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400/60 z-30"
              >
                <IoIosArrowForward className="text-white drop-shadow text-4xl sm:text-5xl" />
              </button>
            </>
          )}
        </div>
      </div>

      {slides.length > 1 && (
        <nav className="mt-4 flex items-center justify-center gap-3" aria-label="ตัวเลือกสไลด์">
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
                    active ? "bg-[#E6B800] scale-110 shadow" : "bg-black/70 group-hover:bg-black",
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
