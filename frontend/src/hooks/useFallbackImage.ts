"use client";
import { useMemo, useState, useCallback } from "react";


export function useFallbackImage(src?: string) {
    const FALLBACK_IMG = "/fallback_activity.png";
    const [imgError, setImgError] = useState(false);

    // เลือกรูปที่จะแสดง
    const displaySrc = useMemo(() => {
        return imgError ? FALLBACK_IMG : src || FALLBACK_IMG;
    }, [imgError, src]);

    // handle เมื่อโหลดรูปไม่ได้
    const onError = useCallback(() => {
        setImgError(true);
    }, []);


    return { displaySrc, onError, setImgError };
}