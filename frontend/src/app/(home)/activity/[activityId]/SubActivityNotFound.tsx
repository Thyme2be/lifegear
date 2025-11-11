// app/(main)/activities/[activityId]/not-found.tsx
import NotFoundPage from "@/components/ui/NotFoundPage";

export default function SubActivityNotFound() {
  return (
    <NotFoundPage
      title="ไม่พบกิจกรรมนี้"
      message="ลิงก์อาจถูกลบหรือกิจกรรมนี้ไม่ได้เปิดให้เข้าถึงแล้ว"
      ctas={[
        { href: "/activities", label: "ดูรายการกิจกรรม", variant: "primary" },
        { href: "/", label: "กลับหน้าแรก", variant: "outline" },
      ]}
      className="bg-white"
    />
  );
}
