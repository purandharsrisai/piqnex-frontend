import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="text-center font-display text-2xl text-ink-900">Forgot your password?</h1>
      <p className="mt-1 text-center text-sm text-ink-500">
        Enter the email you signed up with and we&apos;ll get you back in.
      </p>
      <Card className="mt-8 p-6">
        <ForgotPasswordForm />
      </Card>
    </div>
  );
}
