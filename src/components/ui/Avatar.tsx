import { User } from "lucide-react";
import { cn } from "@/lib/utils";

/** Round profile picture, falling back to the first letter of the name (or email). */
export function Avatar({
  url,
  name,
  className,
}: {
  url?: string | null;
  name?: string | null;
  className?: string;
}) {
  const initial = (name ?? "").trim().charAt(0).toUpperCase();
  return (
    <span
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-clay-600 font-bold text-white",
        className
      )}
    >
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element -- small user-uploaded data URL, nothing to optimise
        <img src={url} alt="" className="h-full w-full object-cover" />
      ) : (
        initial || <User className="h-1/2 w-1/2" aria-hidden="true" />
      )}
    </span>
  );
}
