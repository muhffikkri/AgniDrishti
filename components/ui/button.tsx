import { cn } from "@/lib/cn";

type Variant = "primary" | "secondary" | "ghost" | "danger";

const VARIANTS: Record<Variant, string> = {
  primary: "bg-brand text-canvas hover:bg-brand-bright",
  secondary: "border border-line bg-panel-strong text-ink-primary hover:border-brand/50",
  ghost: "text-ink-secondary hover:bg-panel hover:text-ink-primary",
  danger: "border border-danger/40 text-danger hover:bg-danger/10",
};

export function Button({
  children,
  variant = "primary",
  className,
  type = "button",
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  return (
    <button
      type={type}
      className={cn(
        "inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-meta font-heading font-bold transition-colors duration-150 disabled:cursor-not-allowed disabled:opacity-50",
        VARIANTS[variant],
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}
