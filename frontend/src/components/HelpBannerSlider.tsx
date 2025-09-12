"use client";

import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";

function SampleNextArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} !absolute 
                  right-2 sm:right-4 md:-right-10 lg:-right-16 
                  top-1/2 -translate-y-1/2 
                  text-[#730217] 
                  text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
                  cursor-pointer z-20`}
      style={{ ...style }}
      onClick={onClick}
    >
      <FaArrowCircleRight />
    </button>
  );
}

function SamplePrevArrow(props: any) {
  const { className, style, onClick } = props;
  return (
    <button
      className={`${className} !absolute 
                  left-2 sm:left-4 md:-left-10 lg:-left-16 
                  top-1/2 -translate-y-1/2 
                  text-[#730217] 
                  text-3xl sm:text-4xl md:text-5xl lg:text-6xl 
                  cursor-pointer z-20`}
      style={{ ...style }}
      onClick={onClick}
    >
      <FaArrowCircleLeft />
    </button>
  );
}

export default function HelpBannerSlider() {
  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  const banners = ["/hero1.png", "/activity1.png", "/activity2.png"];

  return (
    <section className="w-7xl relative mx-auto">
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
          </div>
        ))}
      </Slider>
    </section>
  );
}
