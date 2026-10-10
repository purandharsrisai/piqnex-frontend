import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { LoginForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string; reset?: string };
}) {
  return (
    <AuthShell title="Welcome back" subtitle="Log in to manage your listings and requests.">
      {searchParams.reset === "success" && (
        <p className="mb-5 rounded-xl bg-moss-50 px-4 py-3 text-sm font-semibold text-moss-700">
          Your password has been updated. Log in with your new password.
        </p>
      )}
      <LoginForm redirectTo={searchParams.redirectTo} />
    </AuthShell>
  );
}
