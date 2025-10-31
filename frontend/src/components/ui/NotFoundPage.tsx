// src/components/NotFoundPage.tsx
import Link from "next/link";

type Cta =
  | {
      href: string;
      label: string;
      variant?: "primary" | "outline";
      onClick?: never;
    }
  | {
      href?: never;
      label: string;
      variant?: "primary" | "outline";
      onClick: () => void;
    };

type Props = {
  title?: string;
  message?: string;
  ctas?: Readonly<Cta[]>;
  className?: string;
};

const DEFAULT_CTAS = [
  { href: "/", label: "กลับหน้าแรก", variant: "primary" },
  { href: "/activity", label: "ดูรายการกิจกรรม", variant: "outline" },
] as const satisfies Readonly<Cta[]>;

const VARIANT_CLASS: Record<NonNullable<Cta["variant"]>, string> = {
  primary:
    "px-4 py-2 rounded-full bg-main text-white hover:bg-main/90 " +
    "transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main/50",
  outline:
    "px-4 py-2 rounded-full border border-main text-main hover:bg-main/10 " +
    "transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-main/30",
};

function isExternal(href: string) {
  return /^https?:\/\//i.test(href);
}

export default function NotFoundPage({
  title = "ไม่พบหน้าที่คุณต้องการ",
  message = "ลิงก์อาจถูกย้าย ลบ หรือพิมพ์ผิด",
  ctas = DEFAULT_CTAS,
  className = "",
}: Props) {
  return (
    <main
      className={`min-h-screen flex flex-col items-center justify-center text-center gap-6 px-4 ${className}`}
      aria-live="polite"
    >
      <h1 className="text-3xl font-bold text-main">{title}</h1>
      <p className="text-gray-500">{message}</p>

      <div className="flex flex-wrap gap-3 justify-center">
        {ctas.map((b, i) => {
          const variant = b.variant ?? "primary";
          const classes = VARIANT_CLASS[variant];
          if ("href" in b && b.href) {
            const external = isExternal(b.href);
            return external ? (
              <a
                key={i}
                href={b.href}
                target="_blank"
                rel="noreferrer"
                className={classes}
              >
                {b.label}
              </a>
            ) : (
              <Link key={i} href={b.href} className={classes}>
                {b.label}
              </Link>
            );
          }

          return (
            <button
              key={i}
              type="button"
              onClick={b.onClick}
              className={classes}
            >
              {b.label}
            </button>
          );
        })}
      </div>
    </main>
  );
}
