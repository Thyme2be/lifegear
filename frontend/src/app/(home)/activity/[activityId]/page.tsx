import ActivityDetails from "./ActivityDetails";

export default async function Page({
  params,
}: {
  params: Promise<{ activityId: string }>;
}) {
  const { activityId } = await params;
  return <ActivityDetails activityId={activityId} />;
}
