import React from "react";
import Image from "next/image";
import { ActivityThumbnailResponse } from "@/lib/types";

interface ActivityListProps {
  activity: ActivityThumbnailResponse;
}

export default function ActivityList({ activity }: ActivityListProps) {
  // Fallback text if no title/alt available
  const altText = `Activity ${activity.id} - ${activity.category}`;
  // Example: link could go to `/activities/[id]`
  const link = `/activities/${activity.id}`;
  const imageSrc = activity.image_path ?? "/fallback_activity.png"; // fallback image

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
