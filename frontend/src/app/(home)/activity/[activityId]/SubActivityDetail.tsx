"use client";

import ContactInfoView from "@/components/contactInfo";
import InfoRow from "@/components/common/InfoRow";
import { useActivityDetail } from "@/hooks/useActivityDetail";
import type { Props } from "@/types/subActivity";


export function SubActivityDetail({ activityId }: Props) {

    const {
        data,
        dateText,
        timeText,
    } = useActivityDetail(activityId);

    return (
        <>
            <InfoRow label="วันที่จัดกิจกรรม">{dateText}</InfoRow>
            <InfoRow label="เวลาที่จัดกิจกรรม">{timeText}</InfoRow>
            <InfoRow label="สถานที่จัดกิจกรรม">{data?.location_text}</InfoRow>

            {
                data?.contact_info != null && (
                    <div>
                        <b className="font-bold">รายละเอียดวิธีการสมัคร :</b>
                        <span className="mt-2">
                            <ContactInfoView info={data.contact_info} />
                        </span>
                    </div>
                )
            }
        </>

    )

}