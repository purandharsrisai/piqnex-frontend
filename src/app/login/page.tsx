import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { LoginForm } from "@/components/auth/AuthForm";

export const metadata: Metadata = { title: "Login" };

export default function LoginPage({
  searchParams,
}: {
  searchParams: { redirectTo?: string };
}) {
  return (
    <div className="mx-auto max-w-sm px-4 py-16 sm:px-6">
      <h1 className="text-center font-display text-2xl text-ink-900">Welcome back</h1>
      <p className="mt-1 text-center text-sm text-ink-500">Log in to manage your listings and requests.</p>
      <Card className="mt-8 p-6">
        <LoginForm redirectTo={searchParams.redirectTo} />
      </Card>
    </div>
  );
}
