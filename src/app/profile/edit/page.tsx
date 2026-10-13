import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft, Lightbulb, MapPin, Phone } from "lucide-react";
import { getCurrentUser } from "@/lib/api-client";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { FormPageLayout } from "@/components/forms/FormPageLayout";
import { Avatar } from "@/components/ui/Avatar";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = { title: "Edit Profile" };

export default async function EditProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirectTo=/profile/edit");

  const phone = (user.phone ?? "").replace(/\D/g, "").slice(-10);

  return (
    <div>
      <PageHeader eyebrow="Account" title="Edit profile" subtitle="Keep your details up to date so buyers and sellers can trust and reach you.">
        <Link href="/profile" className="inline-flex items-center gap-1 text-sm font-semibold text-ink-600 hover:text-ink-900">
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back to profile
        </Link>
      </PageHeader>
      <FormPageLayout
        form={
          <Card className="rounded-3xl p-5 shadow-pop sm:p-8">
            <ProfileForm
              displayName={user.displayName ?? ""}
              location={user.location ?? null}
              phone={user.phone ?? null}
              email={user.email}
              bio={user.bio ?? null}
              avatarUrl={user.avatarUrl ?? null}
            />
          </Card>
        }
        side={
          <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
            <div className="relative overflow-hidden rounded-3xl bg-ink-900 p-6 text-white">
              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-clay-600/40 blur-3xl" aria-hidden="true" />
              <p className="relative text-xs font-bold uppercase tracking-wider text-clay-300">Your profile</p>
              <div className="relative mt-4 flex items-center gap-4">
                <Avatar url={user.avatarUrl} name={user.displayName || user.email} className="h-16 w-16 border-2 border-ink-900 font-display text-3xl ring-2 ring-white/40" />
                <div className="min-w-0">
                  <p className="truncate font-display text-xl">{user.displayName || "Your name"}</p>
                  <p className="truncate text-sm text-ink-300">{user.email}</p>
                </div>
              </div>
              <div className="relative mt-5 flex flex-wrap gap-2 text-sm text-ink-200">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {user.location || "No location yet"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
                  <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {phone || "No phone yet"}
                </span>
              </div>
              {user.bio && <p className="relative mt-4 text-sm text-ink-200">{user.bio}</p>}
              <p className="relative mt-5 text-xs text-ink-300">Member since {formatDate(user.createdAt)}</p>
            </div>

            <div className="rounded-3xl border border-clay-100 bg-clay-50/70 p-5">
              <p className="flex items-center gap-2 text-sm font-bold text-ink-900">
                <Lightbulb className="h-4 w-4 text-clay-600" aria-hidden="true" />
                Why this matters
              </p>
              <ul className="mt-3 space-y-2 text-sm text-ink-600">
                <li>A real name and city make buyers more comfortable messaging you.</li>
                <li>Your location helps people find parts close to them.</li>
                <li>Your phone number stays private - it is never shown on listings.</li>
              </ul>
            </div>
          </aside>
        }
      />
    </div>
  );
}
