import React from "react";
import Image from "next/image";

interface ActivityListProps {
  imageSrc: string;
  altText: string;
  link: string;
}


export default function ActivityList({
  imageSrc,
  altText,
  link,
}: ActivityListProps) {
  return (
    <div className="flex flex-col items-start">
      <Image
        src={imageSrc}
        alt={altText}
        width={800}
        height={400}
        className="w-full sm:w-auto rounded-4xl shadow-xl"
      />
      <div className="w-full flex justify-end mt-2">
        <a
          href={link}
          className="px-4 py-2 rounded-full shadow-md font-bold bg-[#B30000] text-white hover:bg-[#880000] transition ml-2 text-center"
        >
          อ่านเพิ่มเติม
        </a>
      </div>
    </div>
  );
}
