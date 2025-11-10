// src/types/activities.ts
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
  id: string;
  title: string;
  image_path?: string | null;
  start_at: string;           // ISO
  end_at?: string | null;     // อาจไม่มี
  status: ActivityStatus;
  category: ActivityCategory;
  slug?: string;
}

export interface ActivityDetailResponse extends ActivityThumbnailResponse {
  description?: string | null;
  location_text?: string | null;
  contact_info?: ContactInfo | null;
}
