// src/components/ui/ImageWithFallback.tsx
"use client";
import Image, { ImageProps } from "next/image";
import { useState } from "react";

type Props = ImageProps & {
  fallback?: string;
  className?: string;
  imgSrc?: string;
};

export default function ImageWithFallback({
  fallback = "/fallback_activity.png",
  ...props
}: Props) {
  const [hasError, setHasError] = useState(false);

  return (
    <Image
      {...props}
      src={hasError ? fallback : props.src}
      onError={() => setHasError(true)}
      alt={props.alt || "image"}
    />
  );
}
