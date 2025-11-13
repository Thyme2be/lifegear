import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      data-slot="skeleton"
      className={cn("bg-neutral-200 animate-pulse rounded-md", className)}
      {...props}
    >
      {children}
    </div>
  );
}