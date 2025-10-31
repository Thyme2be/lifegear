"use client";

import Slider from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowCircleLeft, FaArrowCircleRight } from "react-icons/fa";
import { CustomArrowProps } from "react-slick";

function SampleNextArrow(props: CustomArrowProps) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute -right-10 sm:-right-14 md:-right-20
                 top-1/2 -translate-y-1/2 
                 text-2xl sm:text-4xl lg:text-5xl 
                 cursor-pointer z-30"
    >
      <FaArrowCircleRight className="text-black" />
    </button>
  );
}

function SamplePrevArrow(props: CustomArrowProps) {
  const { onClick } = props;
  return (
    <button
      onClick={onClick}
      className="absolute -left-10 sm:-left-14 md:-left-20
                 top-1/2 -translate-y-1/2 
                 text-2xl sm:text-4xl lg:text-5xl 
                 cursor-pointer z-30"
    >
      <FaArrowCircleLeft className="text-black" />
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
    autoplay: false,
    arrows: true,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: { arrows: true },
      },
      {
        breakpoint: 640,
        settings: { arrows: false, dots: true },
      },
    ],
  };

  const banners = Array.from({ length: 7 }, (_, i) => `/${i + 1}.png`);

  return (
    <section className="w-full max-w-7xl mx-auto px-2 sm:px-4">
      <Slider {...settings}>
        {banners.map((banner, idx) => (
          <div
            key={idx}
            className="relative 
                        h-[190px] sm:h-[300px] md:h-[400px] lg:h-[550px] xl:h-[650px]"
          >
              <Image
                src={banner}
                alt={`HowToUse ${idx + 1}`}
                fill
                priority={idx === 0}
                sizes="100vw"
                className="object-contain"
              />
          </div>
        ))}
      </Slider>
    </section>
  );
}

