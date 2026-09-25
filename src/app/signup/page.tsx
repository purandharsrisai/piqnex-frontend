import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { SignupForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Sign Up" };

export default function SignupPage() {
  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="text-center font-display text-2xl text-ink-900">Create your account</h1>
      <p className="mt-1 text-center text-sm text-ink-500">
        Buy, sell, and find missing pieces - it&rsquo;s free to join.
      </p>
      <Card className="mt-8 p-6">
        <SignupForm />
      </Card>
    </div>
  );
}
