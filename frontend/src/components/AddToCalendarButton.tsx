"use client";

export function AddToCalendarButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      className="px-6 py-3 rounded-full bg-bf-btn hover:bg-btn-hover text-white font-bold shadow-md transition"
      onClick={onClick}
    >
      เพิ่มลงในตารางชีวิต
    </button>
  );
}
