import ActivityDetails from "./ActivityDetails";
import SubActivityLoading from "./SubActivityLoading";
import { Suspense } from "react";
export default async function Page({
  params,
}: {
  params: Promise<{ activityId: string }>;
}) {
  const { activityId } = await params;
  return (
      <main className="p-5 bg-cream">
      <Suspense fallback={<SubActivityLoading />}>
        <ActivityDetails activityId={activityId} />
      </Suspense>
    </main>
  );
}
