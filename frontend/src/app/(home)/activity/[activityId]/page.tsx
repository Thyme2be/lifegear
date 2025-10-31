import ActivityDetails from "./ActivityDetails";

export default async function Page({
  params,
}: {
  params: Promise<{ activityId: string }>;
}) {
  const { activityId } = await params;
  return (
    <main className=" p-5 bg-cream ">
      <ActivityDetails activityId={activityId} />;
    </main>
  );
}
