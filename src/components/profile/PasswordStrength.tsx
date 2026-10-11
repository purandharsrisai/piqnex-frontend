import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

const RULES = [
  { label: "At least 8 characters", test: (v: string) => v.length >= 8 },
  { label: "Upper and lower case letters", test: (v: string) => /[a-z]/.test(v) && /[A-Z]/.test(v) },
  { label: "A number", test: (v: string) => /\d/.test(v) },
  { label: "A symbol (e.g. ! @ # ?)", test: (v: string) => /[^A-Za-z0-9]/.test(v) },
];

const LEVELS = [
  { label: "Too short", bar: "bg-red-500", text: "text-red-600" },
  { label: "Weak", bar: "bg-red-500", text: "text-red-600" },
  { label: "Fair", bar: "bg-amber-500", text: "text-amber-700" },
  { label: "Good", bar: "bg-moss-400", text: "text-moss-700" },
  { label: "Strong", bar: "bg-moss-600", text: "text-moss-700" },
];

/** Live strength bar and checklist for a new password. Purely visual - the server still enforces the real rule. */
export function PasswordStrength({ value }: { value: string }) {
  const results = RULES.map((r) => r.test(value));
  const score = value ? results.filter(Boolean).length : 0;
  const level = LEVELS[value ? (value.length < 8 ? 0 : score) : 0];

  return (
    <div className="rounded-2xl bg-ink-50/70 p-4" aria-live="polite">
      <div className="flex items-center justify-between text-xs font-semibold">
        <span className="text-ink-600">Password strength</span>
        <span className={value ? level.text : "text-ink-400"}>{value ? level.label : "Start typing"}</span>
      </div>
      <div className="mt-2 grid grid-cols-4 gap-1.5" aria-hidden="true">
        {RULES.map((_, i) => (
          <span key={i} className={cn("h-1.5 rounded-full", value && i < score ? level.bar : "bg-ink-200")} />
        ))}
      </div>
      <ul className="mt-3 grid gap-1.5 text-sm sm:grid-cols-2">
        {RULES.map((r, i) => (
          <li key={r.label} className={cn("flex items-center gap-2", results[i] && value ? "text-moss-700" : "text-ink-500")}>
            {results[i] && value ? (
              <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            ) : (
              <X className="h-3.5 w-3.5 shrink-0 text-ink-300" aria-hidden="true" />
            )}
            {r.label}
          </li>
        ))}
      </ul>
    </div>
  );
}
