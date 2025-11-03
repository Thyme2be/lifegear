"useclient";
import { useState, useEffect, useMemo, useCallback } from "react";
import axios from 'axios';
import { ActivityThumbnailResponse } from "@/types/activity";
import { ActivityCategory } from "@/lib/enums/activity";
import { apiRoutes } from "@/lib/apiRoutes";
import { normalizeCategory } from "@/utils/activityUtils";
import { MaybeCategory } from "@/types/activity";

const FILTER_OPTIONS = Object.values(ActivityCategory) as ActivityCategory[];

export function useActivity() {
    const [activities, setActivities] = useState<ActivityThumbnailResponse[]>([]);
    const [filteredActivities, setFilteredActivities] = useState<ActivityThumbnailResponse[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [searchText, setSearchText] = useState<string>("");
    const [selectedFilters, setSelectedFilters] = useState<ActivityCategory[]>([]);

    // เก็บ Set ของหมวดเพื่อเช็ค “รู้จัก/ไม่รู้จัก” เร็วขึ้น และไม่ recreate
    const knownCategories = useMemo(() => new Set<ActivityCategory>(FILTER_OPTIONS), []);

    // โหลดข้อมูลแบบยกเลิกได้เมื่อ unmount (axios v1 รองรับ signal)
    useEffect(() => {
        const controller = new AbortController();

        (async () => {
            try {
                setLoading(true);
                const { data } = await axios.get<ActivityThumbnailResponse[]>(
                    apiRoutes.getAllActivitiesThumbnails,
                    { withCredentials: true, timeout: 10000, signal: controller.signal }
                );
                setActivities(data);
                setFilteredActivities(data);
            } catch (err: unknown) {
                if (axios.isCancel(err)) return;
                const message = err instanceof Error ? err.message : "โหลดข้อมูลล้มเหลว";
                setError(message);
            } finally {
                setLoading(false);
            }
        })();

        return () => controller.abort();
    }, []);

    const handleFilterChange = useCallback((value: ActivityCategory) => {
        setSelectedFilters((prev) =>
            prev.includes(value) ? prev.filter((f) => f !== value) : [...prev, value]
        );
    }, []);

    // กรองเมื่อกด Search 
    const handleSearch = useCallback(() => {
        const q = searchText.trim().toLowerCase();
        const activeFilters = selectedFilters;

        const filtered = activities.filter((a) => {
            const title = (a.title ?? "").toLowerCase();
            const matchText = q === "" ? true : title.includes(q);

            // ไม่เลือก filter ใด ๆ => ดูแต่ข้อความ
            if (activeFilters.length === 0) return matchText;

            // ดึง category จากหลายคีย์
            const maybe = a as unknown as MaybeCategory;
            const category =
                normalizeCategory(maybe.category) ?? normalizeCategory(maybe.category_code);

            // ถ้ามี Others: ให้ผ่านกรณี category ที่ไม่รู้จักด้วย
            if (activeFilters.includes(ActivityCategory.Others)) {
                const isKnown = category ? knownCategories.has(category) : false;
                const matchFilter = (category && activeFilters.includes(category)) || !isKnown;
                return matchText && matchFilter;
            }

            return matchText && !!category && activeFilters.includes(category);
        });

        setFilteredActivities(filtered);
    }, [activities, knownCategories, searchText, selectedFilters]);


    return {
        activities,
        filteredActivities,
        loading,
        error,
        searchText,
        setSearchText,
        selectedFilters,
        handleFilterChange,
        handleSearch,
    }



}