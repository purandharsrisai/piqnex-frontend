import { cn } from "@/lib/utils";

export function Card({
  className,
  children,
  as: Tag = "div",
}: {
  className?: string;
  children: React.ReactNode;
  as?: "div" | "article" | "section";
}) {
  return (
    <Tag
      className={cn(
        "rounded-2xl border border-ink-100 bg-white shadow-card",
        className
      )}
    >
      {children}
    </Tag>
  );
}
