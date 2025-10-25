// src/components/MoreInfoButton.tsx (refactor)
// ===============================
"use client";

import React, { forwardRef } from "react";
import Link from "next/link";
import { IoEyeSharp } from "react-icons/io5";
import { buttonClasses, iconSizeClasses, type BtnSize, type BtnVariant } from "@/lib/ui/buttonStyles";

export interface MoreInfoButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  href?: string;
  children?: React.ReactNode;
  size?: BtnSize;
  variant?: BtnVariant;
  loading?: boolean;
  prefetch?: boolean;
  className?: string;
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
      children = <IoEyeSharp />,
      size = "sm",
      variant = "primary",
      loading,
      disabled,
      className,
      prefetch,
      ...buttonProps
    },
    ref
  ) => {
    const isDisabled = Boolean(disabled || loading);
    const ariaLabel = typeof children === "string" ? children : "อ่านเพิ่มเติม";
    const root = buttonClasses({ size, variant, iconOnly: true, className });

    const content = (
      <span className="inline-flex items-center">
        {loading && <Spinner />}
        <span className={iconSizeClasses[size]}>{children}</span>
      </span>
    );

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