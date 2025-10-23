// src/lib/types/activity.ts
import { ActivityCategory, ActivityStatus } from "@/lib/enums/activity";
export type User = {
  username: string;
  first_name_th: string;
  last_name_th: string;
};

export interface ActivityThumbnailResponse {
  id: string; // UUIDs are usually represented as strings in TS
  title: string;
  image_path?: string | null;
  start_at: string; // ISO string representation of datetime
  end_at?: string;      // เพิ่มไว้เผื่อหน้า daily/monthly ต้องใช้
  status: ActivityStatus;
  category: ActivityCategory;
  slug?: string;
}

export interface ActivityDetailResponse extends ActivityThumbnailResponse {
  description?: string;
  location_text?: string;
  contact_info?: string;
  organizer?: string;
}
