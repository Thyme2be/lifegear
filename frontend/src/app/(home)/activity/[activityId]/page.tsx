// app/(home)/activity/[activityId]/page.tsx
import ActivityDetails from "./ActivityDetails";

export default function Page({ params }: { params: { activityId: string } }) {
  const { activityId } = params;
  return (
    <main className="p-5 bg-cream">
      {/* ActivityDetails เป็น client component อยู่แล้ว */}
      <ActivityDetails activityId={activityId} />
    </main>
  );
}
