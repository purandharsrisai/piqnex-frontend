import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata: Metadata = { title: "Reset Password" };

export default function ResetPasswordPage({
  searchParams,
}: {
  searchParams: { token?: string };
}) {
  const token = searchParams.token;

  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="text-center font-display text-2xl text-ink-900">Set a new password</h1>
      <p className="mt-1 text-center text-sm text-ink-500">
        Choose a new password for your account.
      </p>
      <Card className="mt-8 p-6">
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
      </Card>
    </div>
  );
}
