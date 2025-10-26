// src/components/monthly/IconButton.tsx
import React from "react";

type Props = {
  ariaLabel: string;
  onClick: () => void;
  children: React.ReactNode;
};

export default function IconButton({ ariaLabel, onClick, children }: Props) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      title={ariaLabel}
      onClick={onClick}
      className="p-1 rounded-full hover:bg-black/5 active:scale-95 transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#730217]/40"
    >
      {children}
    </button>
  );
}
