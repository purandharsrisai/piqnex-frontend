import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/AuthForm";
import { GoogleButton } from "@/components/auth/GoogleButton";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string; reset?: string; google?: string };
}) {
  return (
    <AuthShell
      illustration
      title="Welcome back"
      subtitle="Log in to manage your listings and requests."
    >
      {searchParams.reset === "success" && (
        <p className="mb-5 rounded-xl bg-moss-50 px-4 py-3 text-sm font-semibold text-moss-700">
          Your password has been updated. Log in with your new password.
        </p>
      )}
      {searchParams.google && (
        <p
          role="alert"
          className="mb-5 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700"
        >
          {searchParams.google === "cancelled"
            ? "Google sign-in was cancelled."
            : searchParams.google === "unverified"
              ? "Your Google email isn't verified, so we couldn't sign you in with it."
              : "We couldn't sign you in with Google. Please try again or use your email and password."}
        </p>
      )}
      <LoginForm redirectTo={searchParams.redirectTo} />
      <GoogleButton redirectTo={searchParams.redirectTo} />
    </AuthShell>
  );
}
