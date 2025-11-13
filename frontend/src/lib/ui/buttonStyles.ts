export type BtnSize = "sm" | "md" | "lg";
export type BtnVariant =
  | "primary"
  | "secondary"
  | "outline"
  | "ghost"
  | "danger"
  | "danger-outline";

function cx(...xs: Array<string | false | null | undefined>) {
  return xs.filter(Boolean).join(" ");
}

const base =
  "inline-flex items-center justify-center select-none font-semibold rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-bf-btn disabled:opacity-60 disabled:cursor-not-allowed";

const sizeMap: Record<BtnSize, string> = {
  sm: "h-9 px-3 text-sm gap-2",
  md: "h-10 px-4 text-sm gap-2",
  lg: "h-11 px-6 text-base gap-2",
};

const iconOnlyMap: Record<BtnSize, string> = {
  sm: "h-9 w-9 p-0",
  md: "h-10 w-10 p-0",
  lg: "h-11 w-11 p-0",
};

const variantMap: Record<BtnVariant, string> = {
  primary: "bg-bf-btn text-white shadow-md hover:bg-btn-hover",
  secondary: "bg-black text-white shadow-md hover:bg-zinc-800",
  outline:
    "border border-current text-bf-btn bg-white hover:bg-bf-btn/5",
  ghost: "bg-transparent hover:bg-black/5",
  danger: "bg-bf-btn text-white shadow-md hover:bg-btn-hover",
  "danger-outline":
    "text-bf-btn border border-bf-btn bg-transparent hover:bg-bf-btn/10",
};

export function buttonClasses(
  {
    size = "sm",
    variant = "primary",
    iconOnly = false,
    className,
  }: {
    size?: BtnSize;
    variant?: BtnVariant;
    iconOnly?: boolean;
    className?: string;
  } = {}
) {
  return cx(
    base,
    variantMap[variant],
    iconOnly ? iconOnlyMap[size] : sizeMap[size],
    className
  );
}

export const iconSizeClasses: Record<BtnSize, string> = {
  sm: "text-[18px]",
  md: "text-[20px]",
  lg: "text-[22px]",
};