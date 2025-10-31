export default function ErrorBox({
  message,
  onRetry,
}: {
  message: string;
  onRetry?: () => void;
}) {
  return (
    <div className="mb-8 p-4 rounded-xl bg-red-50 text-red-700 shadow-sm border border-red-200 animate-fadeIn">
      <p className="mb-3 font-medium">เกิดข้อผิดพลาด: {message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="px-4 py-2 rounded-lg bg-main hover:bg-[#880000] text-white text-sm font-semibold transition"
        >
          ลองใหม่
        </button>
      )}
    </div>
  );
}
