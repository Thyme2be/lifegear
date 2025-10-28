import { ActivityCategory } from "@/lib/enums/activity";

export const NORMALIZE_MAP: Record<string, ActivityCategory> = {
    academic: ActivityCategory.Academics,
    academics: ActivityCategory.Academics,
    recreation: ActivityCategory.Recreations,
    recreations: ActivityCategory.Recreations,
    social: ActivityCategory.Socials,
    socials: ActivityCategory.Socials,
    other: ActivityCategory.Others,
    others: ActivityCategory.Others,
};

export function normalizeCategory(input: unknown): ActivityCategory | null {
    if (typeof input !== "string") return null;
    const val = input.toLowerCase();

    if (val in NORMALIZE_MAP) return NORMALIZE_MAP[val];

    if ((Object.values(ActivityCategory) as string[]).includes(val)) {
        return val as ActivityCategory;
    }
    return null;
}