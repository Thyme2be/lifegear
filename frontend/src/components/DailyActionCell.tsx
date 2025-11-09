// src/components/DailyActionCell.tsx
"use client";

import MoreInfoButton from "@/components/MoreInfoButton";
import DeleteButton from "@/components/DeleteButton";
import type { DailyRow as Row } from "@/types/viewmodels";

type Props = {
  row: Row;
  onDelete?: (id: string) => void;
  enableDelete?: boolean;
  size?: "sm" | "md";
  align?: "center" | "start";
  linkId?: string; // ถ้าจะ override id
  source?: "mine" | "reco"; // mine = ตารางบน / reco = ตารางล่าง
};

export default function DailyActionCell({
  row,
  onDelete,
  enableDelete = true,
  size = "sm",
  align = "center",
  linkId,
  source = "reco",
}: Props) {
  const showMoreInfo = row.kind === "activity";
  const showDelete = enableDelete;

  const targetId = encodeURIComponent(linkId ?? row.id);
  const href =
    row.kind === "activity"
      ? source === "mine"
        ? `/activity/${targetId}?src=mine`
        : `/activity/${targetId}`
      : undefined;

  const ariaLabel = row.title ? `อ่านเพิ่มเติม: ${row.title}` : "อ่านเพิ่มเติม";

  return (
    <div
      className={[
        "flex items-center gap-2",
        align === "center" ? "justify-center" : "justify-start",
      ].join(" ")}
    >
      {!showMoreInfo && !showDelete ? (
        <div className={size === "sm" ? "h-8" : "h-10"} aria-hidden />
      ) : (
        <>
          {showMoreInfo && href && (
            <MoreInfoButton
              href={href}
              size={size}
              variant="primary"
              aria-label={ariaLabel}
              title={ariaLabel}
            />
          )}
          {showDelete && onDelete && (
            <DeleteButton
              activityId={row.id}
              onDelete={() => onDelete(row.id)}
              size={size}
            />
          )}
        </>
      )}
    </div>
  );
}
