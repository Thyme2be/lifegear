"use client"

import Image from "next/image";
import Link from "next/link";

interface CardInfo {
    title: string;
    subTitle: string;
    link: string;
    imgSrc: string;
}

export default function FeatureCard({ title, subTitle, link, imgSrc }: CardInfo) {


    return (
        <section className="flex flex-col items-center text-center max-w-sm mx-auto">
            <h2 className="heading2 text-center text-[#730217]">
                {title}
            </h2>

            <h3 className="mb-2 text-lg sm:text-xl font-bold text-[#730217] text-shadow-lg">
                {subTitle}
            </h3>
            
            <Link
                href={link}
                className="relative mb-10 w-full h-full overflow-hidden rounded-3xl cursor-pointer"
            >
                <Image
                    src={imgSrc}
                    alt=""
                    width={420}
                    height={370}
                    className=""
                />
            </Link>
        </section>
    )
}
