"use client";

import Slider, { CustomArrowProps } from "react-slick";
import Image from "next/image";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowCircleLeft } from "react-icons/fa";
import { FaArrowCircleRight } from "react-icons/fa";
import Link from "next/link";

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
const banners = [
    {
    src: "/hero1.png",
    title: "ยินดีต้อนรับนักศึกษาใหม่! " + (new Date().getFullYear() + 543),
    desc: "ขอให้นักศึกษาทุกคนเริ่มต้นการเดินทางครั้งใหม่ที่เต็มไปด้วยพลังและแรงบันดาลใจ",
    href: "#"
  },
  {
    src: "/activityImages/1.png",
    title: "วันไหว้ครู",
    desc: "“ขอเชิญชวนเพื่อนๆ ทุกคน มาร่วมกิจกรรมวันไหว้ครู ร่วมแสดงความกตัญญูและส่งมอบรอยยิ้ม”",
    href: "#"
  },
  {
    src: "/activityImages/3.png",
    title: "เส้นทางการทำงาน ของ “ผศ.ดร.ปิยะ เตชะธีราวัฒน์”",
    desc: "เชิญนักศึกษาเข้าร่วมฟัง ผศ.ดร.ปิยะ เตชะธีราวัฒน์ แนะแนวเรียนและแนวทางอาชีพสายวิศวกรรมคอมพิวเตอร์",
    href: "#"
  },
  {
    src: "/activityImages/5.png",
    title: "ปฐมนิเทศนักศึกษาใหม่ " + (new Date().getFullYear() + 543) +  " คณะวิศวกรรมศาสตร์ มหาวิทยาลัยธรรมศาสตร์",
    desc: "ขอเชิญนักศึกษาใหม่คณะวิศวกรรมศาสตร์ มหาวิทยาลัยธรรมศาสตร์ เข้าร่วมงาน ปฐมนิเทศ 2568 เพื่อแนะนำแนวทางการเรียนและกิจกรรมต่าง ๆ ของคณะ ",
    href: "#"
  },
  {
    src: "/activityImages/7.png",
    title: "TSE FIRST MEET FUNFAIR",
    desc: "รอทุกคนมาสนุก มาพบเพื่อนใหม่และสร้างความทรงจำดี ๆ ด้วยกันในงานแฟร์ TSE ชวนคนดีมาพบกัน",
    href: "#"
  },
  {
    src: "/activityImages/9.png",
    title: "รับช็อป มอบกาวน์!",
    desc: "ถึงเวลาของเราแล้ว! มารับช็อปและกาวน์ ลงทะเบียนเลย เพื่อเตรียมตัวเป็น ”วิศวกรตัวจริง พร้อมถ่ายรูปกับเพื่อนแบบคนเท่ห์ ๆ คูล ๆ",
    href: "#"
  },
  {
    src: "/activityImages/11.png",
    title: "การแข่งขันกีฬาภายในคณะวิศวกรรมศาสตร์",
    desc: "ชาว TSE ทุกคน เตรียมพบกับการแข่งขันกีฬาภายในคณะวิศวกรรมศาสตร์ มหาวิทยาลัยธรรมศาสตร์มหาวิทยาลัยธรรมศาสตร์ ประจำปี 2025 นี้",
    href: "#"
  },
  {
    src: "/activityImages/13.png",
    title: "เปิดโลกกิจกรรม!",
    desc: "TSE AFTER CLASS FAIR EXPLORE THE WORLD OF CLUBS เลิกเรียนแล้ว...ไปเปิดโลกกิจกรรมกันเถอะ",
    href: "#"
  },
];


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

  // Use the detailed banners array defined above
  return (
    <section className="w-full relative overflow-hidden">
      <Slider {...settings}>
        {banners.map((banner, idx) => (
          <div
            key={idx}
            className="relative 
                       h-[200px] sm:h-[350px] md:h-[500px] lg:h-[650px] xl:h-[750px]"
          >
            <Link href={banner.href || "#"} className="block relative h-full w-full">
  <Image
    src={banner.src}
    alt={`Banner ${idx + 1}`}
    fill
    priority={idx === 0}
    sizes="(max-width: 640px) 100vw, 
           (max-width: 1024px) 90vw, 
           80vw"
    className="object-cover cursor-pointer"
  />

  <div
    className="absolute inset-x-0 bottom-0 
               bg-[#A92535]/60 text-white w-full 
               flex flex-col justify-center 
               space-y-1 sm:space-y-2 
               px-3 sm:px-6 md:px-10 lg:px-16 
               h-16 sm:h-20 md:h-24 lg:h-28 
               text-xs sm:text-sm md:text-base lg:text-xl"
  >
    <div className="font-extrabold text-2xl">{banner.title}</div>
    <div>{banner.desc}</div>
  </div>
</Link>
          </div>
        ))}
      </Slider>
    </section>
  );
}