import { ActivityCategory, ActivityStatus } from "./enums/activity";

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
  status: ActivityStatus;
  category: ActivityCategory;
}
