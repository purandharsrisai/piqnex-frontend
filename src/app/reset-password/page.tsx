import type { Metadata } from "next";
import Link from "next/link";
import { AuthShell } from "@/components/auth/AuthShell";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = { title: "Reset Password" };

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;

  return (
    <AuthShell illustration title="Set a new password" subtitle="Choose a new password for your account.">
        {token ? (
          <ResetPasswordForm token={token} />
        ) : (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            This reset link is missing or invalid.{" "}
            <Link href="/forgot-password" className="underline">
              Request a new one
            </Link>
            .
          </p>
        )}
    </AuthShell>
  );
}
