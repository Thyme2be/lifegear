// src/components/MoreInfoButton.tsx
"use client";

import React, { forwardRef } from "react";
import Link from "next/link";
import { IoEyeSharp } from "react-icons/io5";
import {
  buttonClasses,
  iconSizeClasses,
  type BtnSize,
  type BtnVariant,
} from "@/lib/ui/buttonStyles";

export type MoreInfoMode = "icon" | "text";

export interface MoreInfoButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  children?: React.ReactNode;
  size?: BtnSize;
  variant?: BtnVariant;
  loading?: boolean;
  prefetch?: boolean;
  className?: string;
  mode?: MoreInfoMode; // "icon" | "text" (default: "icon")
}

const Spinner = () => (
  <svg aria-hidden="true" viewBox="0 0 24 24" className="mr-2 h-4 w-4 animate-spin">
    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" opacity="0.25" />
    <path d="M22 12a10 10 0 0 1-10 10" fill="none" stroke="currentColor" strokeWidth="4" />
  </svg>
);

const MoreInfoButton = forwardRef<HTMLButtonElement, MoreInfoButtonProps>(
  (
    {
      href,
      children = "อ่านเพิ่มเติม",
      size = "sm",
      variant = "primary",
      loading,
      disabled,
      className,
      prefetch,
      mode = "icon",
      ...buttonProps
    },
    ref
  ) => {
    const isDisabled = Boolean(disabled || loading);

    // ✅ เพิ่ม transition/scale แบบเดียวกับ AddToLife — เฉพาะโหมด "text"
    const interactionClasses =
      mode === "text"
        ? [
            "transition",
            "hover:scale-[1.03]",
            "active:scale-[0.98]",
            "cursor-pointer",
            "disabled:bg-gray-400",
            "disabled:text-gray-100",
            "disabled:cursor-not-allowed",
            "disabled:pointer-events-none",
          ].join(" ")
        : "";

    const root = buttonClasses({
      size,
      variant,
      iconOnly: mode === "icon",
      className: [interactionClasses, className].filter(Boolean).join(" "),
    });

    const content =
      mode === "icon" ? (
        <span className="inline-flex items-center">
          {loading && <Spinner />}
          <span className={iconSizeClasses[size]}>
            <IoEyeSharp />
          </span>
        </span>
      ) : (
        <span className="inline-flex items-center gap-2">
          {loading && <Spinner />}
          <span>{children}</span>
        </span>
      );

    const ariaLabel =
      mode === "icon"
        ? "อ่านเพิ่มเติม"
        : typeof children === "string"
        ? children
        : "อ่านเพิ่มเติม";

    if (href) {
      return (
        <Link
          href={href}
          prefetch={prefetch}
          className={`${root} ${isDisabled ? "pointer-events-none opacity-60" : ""}`}
          aria-disabled={isDisabled || undefined}
          aria-label={ariaLabel}
          title={ariaLabel}
        >
          {content}
        </Link>
      );
    }

    return (
      <button
        ref={ref}
        type="button"
        className={root}
        aria-label={ariaLabel}
        title={ariaLabel}
        disabled={isDisabled}
        {...buttonProps}
      >
        {content}
      </button>
    );
  }
);

MoreInfoButton.displayName = "MoreInfoButton";
export default MoreInfoButton;
