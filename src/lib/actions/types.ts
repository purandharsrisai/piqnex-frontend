/**
 * Shared shape returned by every Server Action in this project, for use
 * with React's `useFormState`. Keeping one shape means every form component
 * handles success/error/field-errors the same way.
 */
export interface ActionState {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Record<string, string>;
  /** Optional extra data a specific action wants to hand back (e.g. new listing id). */
  data?: Record<string, unknown>;
}

export const IDLE_STATE: ActionState = { status: "idle" };

/** Flattens a Zod error into { fieldName: firstMessage }. */
export function zodFieldErrors(error: { issues: { path: (string | number)[]; message: string }[] }) {
  const fieldErrors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!fieldErrors[key]) fieldErrors[key] = issue.message;
  }
  return fieldErrors;
}
