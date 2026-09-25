import { type ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

// Deliberately restrained corner radius (rounded-md, not the fully-pill
// buttons every SaaS template ships with) and a small lift-on-hover instead
// of just a color change - small, considered details rather than a bigger
// gradient/shadow.
const variantClasses: Record<Variant, string> = {
  primary:
    "bg-clay-600 text-paper hover:bg-clay-700 hover:-translate-y-px active:translate-y-0 shadow-card focus-visible:ring-clay-600",
  secondary:
    "bg-ink-800 text-paper hover:bg-ink-900 hover:-translate-y-px active:translate-y-0 shadow-card focus-visible:ring-ink-800",
  outline:
    "border border-ink-300 text-ink-800 bg-transparent hover:border-ink-400 hover:bg-ink-50 focus-visible:ring-ink-400",
  ghost: "text-ink-700 hover:bg-ink-100 focus-visible:ring-ink-400",
  danger: "bg-red-700 text-white hover:bg-red-800 focus-visible:ring-red-700",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-3 py-1.5 rounded-md gap-1.5",
  md: "text-sm px-4 py-2.5 rounded-md gap-2",
  lg: "text-[15px] px-6 py-3 rounded-md gap-2",
};

const base =
  "inline-flex items-center justify-center font-medium transition-all duration-150 disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(base, variantClasses[variant], sizeClasses[size], className)}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

/** Same visual styles as Button, but renders a Next.js Link for navigation. */
export function LinkButton({
  href,
  className,
  variant = "primary",
  size = "md",
  children,
  ...props
}: {
  href: string;
  variant?: Variant;
  size?: Size;
  children: React.ReactNode;
} & React.ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link
      href={href}
      className={cn(base, variantClasses[variant], sizeClasses[size], className)}
      {...props}
    >
      {children}
    </Link>
  );
}
