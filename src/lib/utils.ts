import { clsx, type ClassValue } from "clsx";

/** Small helper to conditionally join Tailwind class names. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

/** Formats a number as Indian Rupees, e.g. 2500 -> "₹2,500". */
export function formatPrice(amount: number, currency = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

/** Formats an ISO date string as a short, human-friendly date. */
export function formatDate(iso: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(iso));
}
