import { type ButtonHTMLAttributes, forwardRef } from "react";
import Link from "next/link";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "sm" | "md" | "lg";

// Bold marketplace buttons: fully-rounded pills, heavier weight, brand-color
// glow on the primary action, a small lift on hover.
const variantClasses: Record<Variant, string> = {
  primary:
    "bg-clay-600 text-white hover:bg-clay-700 hover:-translate-y-0.5 hover:shadow-brand active:translate-y-0 focus-visible:ring-clay-600",
  secondary:
    "bg-ink-900 text-white hover:bg-ink-800 hover:-translate-y-0.5 hover:shadow-card-hover active:translate-y-0 focus-visible:ring-ink-800",
  outline:
    "border-2 border-ink-200 text-ink-900 bg-white hover:border-ink-900 hover:-translate-y-0.5 focus-visible:ring-ink-400",
  ghost: "text-ink-700 hover:bg-ink-100 focus-visible:ring-ink-400",
  danger: "bg-red-700 text-white hover:bg-red-800 focus-visible:ring-red-700",
};

const sizeClasses: Record<Size, string> = {
  sm: "text-sm px-4 py-2 rounded-full gap-1.5",
  md: "text-sm px-5 py-2.5 rounded-full gap-2",
  lg: "text-base px-7 py-3.5 rounded-full gap-2",
};

const base =
  "inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none disabled:translate-y-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-paper";

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
