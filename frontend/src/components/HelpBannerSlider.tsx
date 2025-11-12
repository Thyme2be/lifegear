// src/components/HelpBannerSlider.tsx
"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Slider, { type Settings } from "react-slick";
import Image from "next/image";
import Link from "next/link";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function HelpBannerSlider() {
  const sliderRef = useRef<Slider | null>(null);
  const [current, setCurrent] = useState(0);

  // เคารพ prefers-reduced-motion
  const reduceMotion =
    typeof window !== "undefined" &&
    window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  const banners = useMemo(
    () => Array.from({ length: 7 }, (_, i) => `/${i + 1}.png`),
    []
  );

  const settings: Settings = {
    dots: false,
    infinite: true,
    speed: reduceMotion ? 0 : 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: false,
    autoplaySpeed: 5000,
    beforeChange: () => {},
    afterChange: (index: number) => setCurrent(index),
  };

  if (banners.length === 0) {
    return (
      <section className="w-full max-w-7xl mx-auto px-2 sm:px-4 pt-6">
        <div className="rounded-xl border bg-gray-50 text-gray-700 p-4" role="alert">
          ยังไม่มีแบนเนอร์สำหรับแสดง
        </div>
      </section>
    );
  }

  return (
    <section className="w-full max-w-7xl mx-auto px-2 sm:px-4 pt-6">
      <div className="relative rounded-xl shadow-xl">
        {/* ตัวสไลด์ */}
        <div className="relative overflow-hidden rounded-xl h-[200px] sm:h-[350px] md:h-[450px] lg:h-[600px] xl:h-[700px]">
          <Slider
            ref={sliderRef}
            {...settings}
            className="h-full [&_.slick-list]:h-full [&_.slick-track]:h-full [&_.slick-slide]:h-full [&_.slick-slide>div]:h-full"
          >
            {banners.map((src, idx) => (
              <div key={src} className="relative h-full w-full">
                {/* ถ้าอยากคลิกแล้วไปหน้า help detail ก็หุ้มด้วย <Link> ได้ */}
                <Link href="#" aria-label={`HowToUse ${idx + 1}`} className="block relative h-full w-full">
                  <Image
                    src={src}
                    alt={`HowToUse ${idx + 1}`}
                    fill
                    priority={idx === 0}
                    sizes="100vw"
                    className="object-contain"
                  />
                </Link>
              </div>
            ))}
          </Slider>

          {/* ปุ่ม Prev / Next แบบ overlay (สไตล์เดียวกับ Home) */}
          {banners.length > 1 && (
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

      {/* Dots แยกอยู่นอกสไลด์ (สไตล์ Home) */}
      {banners.length > 1 && (
        <nav className="mt-4 flex items-center justify-center gap-3" aria-label="ตัวเลือกสไลด์">
          {banners.map((_s, idx) => {
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
