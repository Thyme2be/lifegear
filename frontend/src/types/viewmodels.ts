// src/types/viewmodels.ts
export type DailyRow = {
  id: string;
  title: string;
  time: string; // "HH:MM-HH:MM" หรือ "—"
  date: string; // "YYYY-MM-DD"
  kind: "class" | "activity";
  startISO: string;
  endISO: string;
  slug?: string;
  status?: "upcoming" | "running" | "finished" | "cancelled";
};
