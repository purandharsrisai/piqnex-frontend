import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { getCurrentUser } from "@/lib/api-client";
import { Card } from "@/components/ui/Card";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";

export const metadata: Metadata = { title: "Change Password" };

export default async function ChangePasswordPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirectTo=/profile/change-password");

  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <Link
        href="/profile"
        className="inline-flex items-center gap-1 text-sm font-medium text-ink-500 hover:text-ink-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to profile
      </Link>
      <h1 className="mt-6 font-display text-3xl text-ink-900">Change Password</h1>
      <p className="mt-2 text-ink-500">
        Update the password you use to log in to Piqnex.
      </p>
      <Card className="mt-8 rounded-3xl p-6 shadow-pop sm:p-8">
        <ChangePasswordForm />
      </Card>
    </div>
  );
}
