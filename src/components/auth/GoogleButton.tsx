import { apiFetch } from "@/lib/api-client";

/**
 * "Continue with Google" - renders nothing until the backend reports Google
 * login is configured (GOOGLE_CLIENT_ID / GOOGLE_CLIENT_SECRET set).
 */
export async function GoogleButton({ redirectTo }: { redirectTo?: string }) {
  let enabled = false;
  try {
    enabled = (await apiFetch<{ google: boolean }>("/auth/providers", { authenticated: false })).google;
  } catch {
    enabled = false;
  }
  if (!enabled) return null;

  const api = (process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "http://localhost:4000").replace(/\/+$/, "");
  const href = `${api}/auth/google${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`;

  return (
    <div className="mt-6">
      <div className="relative mb-5 text-center text-xs font-semibold uppercase tracking-wider text-ink-400">
        <span className="relative z-10 bg-white px-3">or</span>
        <span className="absolute left-0 right-0 top-1/2 -z-0 h-px bg-ink-100" aria-hidden="true" />
      </div>
      <a
        href={href}
        data-testid="google-button"
        className="flex w-full items-center justify-center gap-3 rounded-full border-2 border-ink-200 bg-white px-5 py-3 text-sm font-semibold text-ink-900 transition-all hover:-translate-y-0.5 hover:border-ink-900"
      >
        <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
          <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
          <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
          <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z" />
          <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
        </svg>
        Continue with Google
      </a>
    </div>
  );
}
