import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata: Metadata = { title: "Forgot Password" };

export default function ForgotPasswordPage() {
  return (
    <AuthShell
      title="Forgot your password?"
      subtitle="Enter the email you signed up with and we'll get you back in."
    >
      <ForgotPasswordForm />
    </AuthShell>
  );
}
