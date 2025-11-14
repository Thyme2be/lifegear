// app/(home)/activity/[activityId]/page.tsx
import type { Metadata } from "next";
import ActivityDetails from "./ActivityDetails";

type Params = Promise<{ activityId: string }>;

export default async function Page({
  params,
}: {
  params: Params;
}) {
  const { activityId } = await params;

  return (
    <main className="p-5 bg-primary">
      <ActivityDetails activityId={activityId} />
    </main>
  );
}

export async function generateMetadata({
  params,
}: {
  params: Params;
}): Promise<Metadata> {
  const { activityId } = await params;
  return {
    title: `Activity • ${activityId}`,
  };
}
