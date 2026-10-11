import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FileText, HelpCircle, KeyRound, LifeBuoy, Mail, ShieldAlert, ShieldCheck, Phone } from "lucide-react";
import { getCurrentUser } from "@/lib/api-client";
import { PageHeader } from "@/components/ui/PageHeader";
import { DeleteAccount } from "@/components/profile/DeleteAccount";
import { LogoutButton } from "@/components/profile/LogoutButton";
import { SettingsActionRow, SettingsGroup, SettingsLinkRow } from "@/components/profile/SettingsRow";

export const metadata: Metadata = { title: "Settings" };

/**
 * Settings = private account controls only (email, phone, security, help, delete).
 * The public identity, stats and activity live on /profile.
 */
export default async function SettingsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirectTo=/settings");

  return (
    <div>
      <PageHeader eyebrow="Account" title="Settings" subtitle="Sign-in details, security and account controls." />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] lg:px-8">
        {/* Left: the sign-in identity and session control (no profile details - those live on /profile). */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-card">
            <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-moss-50 text-moss-700">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </span>
            <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-ink-400">Signed in as</p>
            <p className="mt-1 break-all font-display text-lg text-ink-900">{user.email}</p>
            <p className="mt-2 text-sm text-ink-500">
              Only you can see these settings. Your public details are on your{" "}
              <Link href="/profile" className="font-semibold text-clay-600 hover:underline">
                profile
              </Link>
              .
            </p>
            <div className="mt-5 border-t border-ink-100 pt-5">
              <LogoutButton size="md" className="w-full" />
            </div>
          </div>
        </aside>

        {/* Right: settings cards in two columns on wide screens. */}
        <div className="grid items-start gap-8 md:grid-cols-2">
          <SettingsGroup title="Sign-in and contact" description="Private - never shown on listings.">
            <SettingsActionRow
              icon={Mail}
              tone="ink"
              title="Email address"
              text={user.email}
              action={<span className="rounded-full bg-ink-100 px-3 py-1 text-xs font-semibold text-ink-600">Fixed</span>}
            />
            <SettingsLinkRow
              href="/profile/edit"
              icon={Phone}
              title="Phone number"
              text={user.phone || "Not added yet"}
            />
          </SettingsGroup>

          <SettingsGroup title="Security" description="Keep your account safe.">
            <SettingsLinkRow
              href="/profile/change-password"
              icon={KeyRound}
              tone="moss"
              title="Change password"
              text="Update the password you use to log in."
            />
            <SettingsLinkRow
              href="/safety"
              icon={ShieldCheck}
              tone="moss"
              title="Safety tips"
              text="How to buy and sell safely."
            />
          </SettingsGroup>

          <SettingsGroup title="Help and legal">
            <SettingsLinkRow href="/faq" icon={HelpCircle} tone="ink" title="FAQ" text="Answers to common questions." />
            <SettingsLinkRow href="/contact" icon={LifeBuoy} tone="ink" title="Contact us" text="Get in touch with the team." />
            <SettingsLinkRow href="/privacy" icon={ShieldAlert} tone="ink" title="Privacy policy" text="How we handle your data." />
            <SettingsLinkRow href="/terms" icon={FileText} tone="ink" title="Terms of use" text="The rules for using Piqnex." />
          </SettingsGroup>

          <SettingsGroup title="Danger zone" tone="danger">
            <div className="px-5 pb-5 pt-1">
              <p className="mt-3 text-sm text-ink-600">
                Deleting your account permanently removes your listings, requests and messages. This cannot be undone.
              </p>
              <DeleteAccount />
            </div>
          </SettingsGroup>
        </div>
      </div>
    </div>
  );
}
