import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

/**
 * Base text input. Always pair with a <Field> (see Field.tsx) so every
 * input gets a real <label> and, when invalid, an aria-describedby error
 * message - that's what makes forms usable with a keyboard/screen reader.
 */
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn(
          "w-full rounded-xl border bg-white px-3.5 py-2.5 text-[15px] text-ink-900 placeholder:text-ink-400 transition-colors",
          "focus:outline-none focus:ring-2 focus:ring-clay-400 focus:border-clay-400",
          error ? "border-red-400" : "border-ink-200",
          className
        )}
        aria-invalid={!!error}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: string }
>(({ className, error, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-xl border bg-white px-3.5 py-2.5 text-[15px] text-ink-900 placeholder:text-ink-400 transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-clay-400 focus:border-clay-400",
        error ? "border-red-400" : "border-ink-200",
        className
      )}
      aria-invalid={!!error}
      {...props}
    />
  );
});
Textarea.displayName = "Textarea";

export const Select = forwardRef<
  HTMLSelectElement,
  React.SelectHTMLAttributes<HTMLSelectElement> & { error?: string }
>(({ className, error, children, ...props }, ref) => {
  return (
    <select
      ref={ref}
      className={cn(
        "w-full rounded-xl border bg-white px-3.5 py-2.5 text-[15px] text-ink-900 transition-colors",
        "focus:outline-none focus:ring-2 focus:ring-clay-400 focus:border-clay-400",
        error ? "border-red-400" : "border-ink-200",
        className
      )}
      aria-invalid={!!error}
      {...props}
    >
      {children}
    </select>
  );
});
Select.displayName = "Select";
