import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "LifeGear | Activity",
  description: "Time management for event in Engineering faculty",
};

export default function ActivityLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <section>{children}</section>;
}
