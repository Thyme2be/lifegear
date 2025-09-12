"use client";

import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";

import { CustomArrowProps } from "react-slick";

function SampleNextArrow(props: CustomArrowProps) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 
                 text-white text-2xl sm:text-4xl lg:text-5xl 
                 cursor-pointer z-20"
    >
      <FaArrowCircleRight />
    </button>
  );
}

function SamplePrevArrow(props: CustomArrowProps) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 
                 text-white text-2xl sm:text-4xl lg:text-5xl 
                 cursor-pointer z-20"
    >
      <FaArrowCircleLeft />
    </button>
  );
}

export default function BannerSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 8000,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const banners = ["/hero1.png", "/activity1.png", "/activity2.png"];

  return (
    <section className="w-full relative overflow-hidden">
      <Slider {...settings}>
        {banners.map((src, idx) => (
          <div
            key={idx}
            className="relative 
                       h-[200px] sm:h-[350px] md:h-[500px] lg:h-[650px] xl:h-[750px]"
          >
            <Image
              src={src}
              alt={`Banner ${idx + 1}`}
              fill
              priority={idx === 0}
              sizes="(max-width: 640px) 100vw, 
                     (max-width: 1024px) 90vw, 
                     80vw"
              className="object-cover cursor-pointer"
            />

            {/* ข้อความ Overlay */}
            <div
              className="absolute inset-x-0 bottom-0 
                         bg-[#A92535]/60 text-white w-full 
                         flex flex-col justify-center 
                         space-y-1 sm:space-y-2 
                         px-3 sm:px-6 md:px-10 lg:px-16 
                         h-16 sm:h-20 md:h-24 lg:h-28 
                         text-xs sm:text-sm md:text-base lg:text-xl"
            >
              <div className="font-semibold cursor-pointer">
                ยินดีต้อนรับเข้าสู่คณะวิศวกรรมศาสตร์ ปีการศึกษา{" "}
                {new Date().getFullYear() + 543}
              </div>
              <div>
                TSE ยินดีต้อนรับวันเปิดเทอม ขอให้นักศึกษาทุกคนมีความสุข สนุก
                และประสบความสำเร็จในทุกการเรียนรู้ที่ TSE
              </div>
            </div>
          </div>
        ))}
      </Slider>
    </section>
  );
}
