import SubActivityClient from "./SubActivityClient";

export default async function Page({
  params,
}: {
  params: Promise<{ activityId: string }>;
}) {
  const { activityId } = await params;
  return <SubActivityClient activityId={activityId} />;
}
