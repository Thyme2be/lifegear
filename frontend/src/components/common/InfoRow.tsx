"use client";

export default function InfoRow({
  label,
  children,
}: {
  label: string;
  children?: React.ReactNode;
}) {
  if (!children) return null;
  return (
    <p>
      <b className="font-bold">{label} :</b> {children}
    </p>
  );
}