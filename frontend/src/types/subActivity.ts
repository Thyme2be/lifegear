import type { ContactInfo } from "@/lib/contact";

export type Props = { activityId: string };

export type ActivityDetailResponse = {
  id: string;
  title: string;
  category?: string | null;
  image_path?: string | null;
  image_url?: string | null;
  description?: string | null;
  start_at?: string | null; // ISO
  end_at?: string | null; // ISO
  time_range?: string | null;
  location_text?: string | null;
  contact_info?: ContactInfo | null;
};

export type Thumb = {
  id: string;
  title?: string;
  category?: string;
  image_path?: string | null;
  image_url?: string | null;
};
