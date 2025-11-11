"use client";

import Image from "next/image";
import Link from "next/link";

interface CardInfo {
  title: string;
  subTitle?: string;
  link: string;
  imgSrc: string;
  alt?: string;
  className?: string;
}

export default function FeatureCard({
  title,
  subTitle,
  link,
  imgSrc,
  alt,
}: CardInfo) {
  return (
    <section className="flex flex-col items-center text-center max-w-sm mx-auto">
      <h2 className="heading2 text-center text-main">{title}</h2>

      <h3 className="mb-2 text-lg sm:text-xl font-bold text-main transparent text-shadow-lg min-h-[1.75rem]">
        {subTitle || ""}
      </h3>

      <Link
        href={link}
        className="mb-10 w-full h-full overflow-hidden rounded-3xl cursor-pointer transition-transform duration-300 hover:scale-[1.05]"
      >
        <Image
          src={imgSrc}
          alt={alt || title}
          width={420}
          height={370}
          className=""
        />
      </Link>
    </section>
  );
}
