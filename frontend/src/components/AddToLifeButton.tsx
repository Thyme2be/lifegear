// src/components/AddToLifeButton.tsx
"use client";

export default function AddToLifeButton() {
  return (
    <button
      type="button"
      className="px-6 py-3 rounded-full bg-[#B30000] hover:bg-[#880000] text-white font-bold shadow-md transition"
      onClick={() => alert("เพิ่มลงในตารางชีวิต (ตัวอย่าง)")}
    >
      เพิ่มลงในตารางชีวิต
    </button>
  );
}
