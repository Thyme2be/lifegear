// src/components/banner/BannerShell.tsx
"use client";

type BannerShellProps = {
  children: React.ReactNode;
  showDots?: boolean;
};

export default function BannerShell({ children, showDots }: BannerShellProps) {
  return (
    <section className="w-full max-w-6xl mx-auto px-3 sm:px-4 pt-6">
      <div className="relative rounded-xl shadow-xl">
        <div className="relative overflow-hidden rounded-xl h-[190px] sm:h-[260px] md:h-auto md:aspect-[16/9]">
          {children}
        </div>
      </div>

      {showDots && (
        <nav className="mt-4 flex items-center justify-center gap-3" aria-label="ตัวเลือกสไลด์">
          <span className="h-3 w-3 rounded-full bg-neutral-200" />
          <span className="h-3 w-3 rounded-full bg-neutral-200" />
          <span className="h-3 w-3 rounded-full bg-neutral-200" />
        </nav>
      )}
    </section>
  );
}
