import { useId } from "react";
import { cloneElement, isValidElement } from "react";

interface FieldProps {
  label: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: React.ReactElement;
}

/**
 * Wraps a form control with a proper <label>, optional hint text, and an
 * accessible error message. This is the piece that makes our forms keyboard-
 * and screen-reader-friendly without repeating aria-* wiring everywhere.
 */
export function Field({ label, hint, error, required, children }: FieldProps) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  const control = isValidElement(children)
    ? cloneElement(children as React.ReactElement<any>, {
        id,
        error,
        "aria-describedby": [hintId, errorId].filter(Boolean).join(" ") || undefined,
        required,
      })
    : children;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-ink-800">
        {label}
        {required && <span className="text-clay-600"> *</span>}
      </label>
      {control}
      {hint && !error && (
        <p id={hintId} className="text-xs text-ink-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
