import type { Metadata } from "next";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, EyeOff, KeyRound, RefreshCw, ShieldCheck } from "lucide-react";
import { getCurrentUser } from "@/lib/api-client";
import { Card } from "@/components/ui/Card";
import { ChangePasswordForm } from "@/components/profile/ChangePasswordForm";

export const metadata: Metadata = { title: "Change Password" };

const TIPS = [
  { icon: KeyRound, text: "Use a password you don't use on any other website." },
  { icon: RefreshCw, text: "Longer is stronger - try a short sentence of 3 or 4 words." },
  { icon: EyeOff, text: "Never share your password, not even with Piqnex staff." },
];

export default async function ChangePasswordPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirectTo=/profile/change-password");

  return (
    <div className="relative overflow-hidden">
      <div className="pointer-events-none absolute -left-32 -top-32 h-96 w-96 rounded-full bg-moss-100/70 blur-3xl" aria-hidden="true" />
      <div className="relative mx-auto max-w-5xl px-4 py-10 sm:px-6 lg:py-14">
        <Link href="/settings" className="inline-flex items-center gap-1 text-sm font-semibold text-ink-600 hover:text-ink-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to settings
        </Link>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-10">
          <div>
            <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-moss-600 text-white shadow-card">
              <ShieldCheck className="h-7 w-7" aria-hidden="true" />
            </span>
            <h1 className="mt-4 font-display text-3xl text-ink-900 sm:text-4xl">Change your password</h1>
            <p className="mt-2 max-w-xl text-ink-600">
              Choose a strong new password for <span className="font-semibold text-ink-800">{user.email}</span>. You&rsquo;ll stay
              logged in on this device.
            </p>
            <Card className="mt-6 rounded-3xl p-5 shadow-pop sm:p-8">
              <ChangePasswordForm />
            </Card>
          </div>

          <aside className="lg:sticky lg:top-24 lg:mt-[4.5rem]">
            <div className="rounded-3xl border border-moss-100 bg-moss-50/70 p-6">
              <svg viewBox="0 0 200 150" className="mx-auto h-32 w-auto" role="img" aria-label="A shield with a lock">
                <circle cx="100" cy="76" r="62" fill="#d5f6ef" />
                <path d="M100 22l46 16v34c0 30-20 50-46 60-26-10-46-30-46-60V38z" fill="#25a395" stroke="#1f2540" strokeWidth="5" strokeLinejoin="round" />
                <rect x="78" y="70" width="44" height="34" rx="8" fill="#ffffff" stroke="#1f2540" strokeWidth="5" />
                <path d="M86 70v-8a14 14 0 0 1 28 0v8" fill="none" stroke="#1f2540" strokeWidth="5" strokeLinecap="round" />
                <circle cx="100" cy="85" r="5" fill="#f9582a" />
                <path d="M100 88v8" stroke="#f9582a" strokeWidth="4" strokeLinecap="round" />
                <g stroke="#1f2540" strokeWidth="3.5" strokeLinecap="round">
                  <path d="M168 40v12M162 46h12" />
                  <path d="M30 100v8M26 104h8" />
                </g>
              </svg>
              <h2 className="mt-4 font-display text-lg text-ink-900">Keep your account safe</h2>
              <ul className="mt-4 space-y-3">
                {TIPS.map(({ icon: Icon, text }) => (
                  <li key={text} className="flex gap-3 text-sm text-ink-700">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-moss-700 shadow-card">
                      <Icon className="h-4 w-4" aria-hidden="true" />
                    </span>
                    <span className="pt-1">{text}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-5 border-t border-moss-100 pt-4 text-xs text-ink-500">
                Forgot your current password? Log out and use &ldquo;Forgot password&rdquo; on the login page.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
