import { ActivityCategory, ActivityStatus } from "@/lib/enums/activity";
export type User = {
  username: string;
  first_name_th: string;
  last_name_th: string;
};

export type ContactInfo =
  | string
  | string[]
  | Record<string, string | null | undefined>;

export interface ActivityThumbnailResponse {
  id: string; // UUIDs are usually represented as strings in TS
  title: string;
  image_path?: string | null;
  start_at: string; // ISO string representation of datetime
  end_at?: string | null; // เพิ่มไว้เผื่อหน้า daily/monthly ต้องใช้
  status: ActivityStatus;
  category: ActivityCategory;
  slug?: string;
}

export interface ActivityDetailResponse extends ActivityThumbnailResponse {
  description?: string | null;
  location_text?: string | null;
  contact_info?: ContactInfo | null;
  organizer?: string | null;
  /** ถ้า API มี image_url แยกเพิ่มได้ */
  image_url?: string | null;
}

/** ถ้าต้องการ type สำหรับฝั่ง UI ที่ทุกช่องเป็น nullable ได้ */
export type ActivityDetailUI = Omit<ActivityDetailResponse, "start_at" | "end_at"> & {
  start_at?: string | null;
  end_at?: string | null;
};


export interface Activity {
  id: string;
  title?: string;
  description?: string;
  image_url?: string | null;
  image_path?: string | null;
  start_at?: string | null; // ISO
  end_at?: string | null;   // ISO
  location_text?: string | null;
  contact_info?: ContactInfo[]; // เลิกใช้ any
}
