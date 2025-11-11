// src/components/DailyActionCell.tsx
"use client";

import React from "react";
import MoreInfoButton from "@/components/MoreInfoButton";
import DeleteButton from "@/components/DeleteButton";
import type { DailyRow as Row } from "@/types/viewmodels";

type Props = {
  row: Row;
  onDelete?: (id: string) => void;
  enableDelete?: boolean;
  size?: "sm" | "md";
  align?: "center" | "start";
  linkId?: string;              // override id
  source?: "mine" | "reco";     // "mine" = ตารางบน, "reco" = ตารางล่าง
  className?: string;
};

function cx(...parts: Array<string | undefined | false>) {
  return parts.filter(Boolean).join(" ");
}

function _DailyActionCell({
  row,
  onDelete,
  enableDelete = true,
  size = "sm",
  align = "center",
  linkId,
  source = "reco",
  className,
}: Props) {
  const isActivity = row.kind === "activity";

  const href = React.useMemo(() => {
    if (!isActivity) return undefined;
    const targetId = encodeURIComponent(linkId ?? row.id);
    return source === "mine" ? `/activity/${targetId}?src=mine` : `/activity/${targetId}`;
  }, [isActivity, linkId, row.id, source]);

  const canShowMore = Boolean(isActivity && href);
  const canDelete = Boolean(enableDelete && onDelete);

  const ariaLabel = row.title ? `อ่านเพิ่มเติม: ${row.title}` : "อ่านเพิ่มเติม";

  const handleDelete = React.useCallback(() => {
    onDelete?.(row.id);
  }, [onDelete, row.id]);

  return (
    <div
      className={cx(
        "flex items-center gap-2",
        align === "center" ? "justify-center" : "justify-start",
        className
      )}
    >
      {canShowMore && (
        <MoreInfoButton
          href={href!}
          size={size}
          variant="primary"
          aria-label={ariaLabel}
          title={ariaLabel}
        />
      )}

      {canDelete && (
        <DeleteButton
          activityId={row.id}
          onDelete={handleDelete}
          size={size}
        />
      )}

      {/* ถ้าไม่มีปุ่มอะไรเลย รักษาความสูงแถวให้คงที่ */}
      {!canShowMore && !canDelete ? (
        <div className={size === "sm" ? "h-8" : "h-10"} aria-hidden />
      ) : null}
    </div>
  );
}

export default React.memo(_DailyActionCell);
