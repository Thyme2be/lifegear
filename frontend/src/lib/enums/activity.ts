export enum ActivityStatus {
  Upcoming = "upcoming",
  Running = "running",
  Finished = "finished",
  Cancelled = "cancelled",
}

export enum ActivityCategory {
  Academics = "academics",
  Recreations = "recreations",
  Socials = "socials",
  Others = "others",
}

export const CategoryLabels: Record<ActivityCategory, string> = {
  [ActivityCategory.Academics]: "ด้านวิชาการ",
  [ActivityCategory.Recreations]: "ด้านสันทนาการ",
  [ActivityCategory.Socials]: "ด้านสังคม",
  [ActivityCategory.Others]: "ด้านอื่นๆ",
};
