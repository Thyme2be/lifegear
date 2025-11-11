// src/types/calendar.ts
export type classes = {
  class_date: string;
  class_code: string;
  class_name: string;
  start_time: string;
  end_time: string;
};

export type activities = {
  id?: string; // เผื่ออนาคตมี
  title: string;
  start_at: string; // ISO
  end_at: string; // ISO
};

export type calendar = {
  date?: string; // บางรูปแบบ (daily) ส่งมา
  classes: classes[];
  activities: activities[];
};

export type CalendarEvent = {
  id: string;
  title: string;
  start_at: string;     // ISO
  end_at: string;       // ISO
  kind: "class" | "activity";
};