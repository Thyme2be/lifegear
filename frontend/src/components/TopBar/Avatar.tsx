"use client";
import type { User } from "@/types/activities";
import { getInitials, pickAvatarBg } from "@/utils/avatar";
import clsx from "clsx";

type Props = {
  user: User | null;
  size?: "md" | "lg";
  className?: string;
  title?: string;
};
export default function Avatar({ user, size = "md", className, title }: Props) {
  const base = "rounded-full flex items-center justify-center select-none text-white font-semibold";
  const sizeCls = size === "lg" ? "w-16 h-16 text-lg font-bold" : "w-12 h-12";
  return (
    <div
      className={clsx(base, sizeCls, pickAvatarBg(user), className)}
      title={title}
      aria-hidden={!title}
    >
      {getInitials(user)}
    </div>
  );
}