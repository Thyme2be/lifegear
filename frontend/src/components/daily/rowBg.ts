import type { DailyRow as Row } from "@/types/viewmodels";

export const rowBg = (kind: Row["kind"]) =>
  kind === "activity" ? "bg-[#FFC26D]" : "bg-[#8BD8FF]";
