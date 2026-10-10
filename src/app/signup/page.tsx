import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupForm } from "@/components/auth/AuthForm";
import { GoogleButton } from "@/components/auth/GoogleButton";

export const metadata: Metadata = { title: "Sign Up" };

export default function SignupPage() {
  return (
    <AuthShell
      title="Create your account"
      subtitle="Buy, sell, and find missing pieces - it's free to join."
      wide
    >
      <SignupForm />
      <GoogleButton />
    </AuthShell>
  );
}
