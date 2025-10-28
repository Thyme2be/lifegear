"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import {
  ContactInfo,
  normalizeContactInfo,
  type ContactToken,
} from "@/lib/contact";

const externalLinkProps = { target: "_blank", rel: "noreferrer" } as const;

function renderToken(t: ContactToken): ReactNode {
  if (t.kind === "text") return <span className="break-words">{t.text}</span>;
  return (
    <Link href={t.href} {...externalLinkProps} className="underline break-all">
      {t.text}
    </Link>
  );
}

export default function ContactInfoView({ info }: { info: ContactInfo }) {
  const rows = normalizeContactInfo(info);
  if (rows.length === 0) return null;

  return (
    <div className="space-y-1">
      {rows.map((row, i) => (
        <div key={i}>
          {row.label ? <b className="font-semibold">{row.label}: </b> : null}
          <span>
            {row.tokens.map((tk, j) => (
              <span key={j}>{renderToken(tk)}</span>
            ))}
          </span>
        </div>
      ))}
    </div>
  );
}
