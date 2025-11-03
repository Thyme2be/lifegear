"use client";

export default function ErrorBox({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div className="mb-8 p-4 rounded-xl bg-red-50 text-red-700">
      <p className="mb-3 font-medium">เกิดข้อผิดพลาด: {message}</p>
      <button
        type="button"
        onClick={onRetry}
        className="px-4 py-2 rounded-lg bg-bf-btn hover:bg-btn-hover text-white text-sm font-semibold"
      >
        ลองใหม่
      </button>
    </div>
  );
}