"use client";

type ErrorBoxProps = {
  message?: string;
  onRetry?: () => void;
  className?: string;
};

export default function ErrorBox({ message, onRetry, className }: ErrorBoxProps) {
  return (
    <div
      role="alert"
      aria-live="assertive"
      className={[
        "p-4 rounded-xl border border-red-200 bg-red-50 text-red-700 shadow-sm animate-fadeIn",
        className,
      ].filter(Boolean).join(" ")}
    >
      <p className="mb-3 font-medium">
        เกิดข้อผิดพลาด: {message ?? "ไม่สามารถโหลดข้อมูลได้"}
      </p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 rounded-lg bg-main hover:bg-btn-hover text-white text-sm font-semibold transition"
        >
          ลองใหม่
        </button>
      )}
    </div>
  );
}
