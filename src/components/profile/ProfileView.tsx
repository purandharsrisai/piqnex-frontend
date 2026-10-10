import Link from "next/link";
import { KeyRound, MapPin, Phone, Plus } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { ProfileForm } from "./ProfileForm";
import { DeleteAccount } from "./DeleteAccount";
import { LogoutButton } from "./LogoutButton";
import { MyListingItem } from "./MyListingItem";
import { MyNeedRequestItem } from "./MyNeedRequestItem";
import { formatDate } from "@/lib/utils";
import type { MyListing, MyNeedRequest } from "@/lib/profile-data";

interface ProfileUser {
  email: string;
  displayName: string;
  location: string | null;
  phone: string | null;
  createdAt: string;
}

/**
 * Presentational profile dashboard: identity banner + quick stats on top,
 * account settings on the left, activity (listings / requests) on the right.
 * Data is fetched in app/profile/page.tsx and passed in.
 */
export function ProfileView({
  user,
  listings,
  needRequests,
}: {
  user: ProfileUser;
  listings: MyListing[];
  needRequests: MyNeedRequest[];
}) {
  const name = user.displayName || "My Profile";
  const initial = (user.displayName || user.email).trim().charAt(0).toUpperCase();
  const stats = [
    { label: "Active listings", value: listings.filter((l) => l.status === "active").length },
    { label: "Parts sold", value: listings.filter((l) => l.status === "sold").length },
    { label: "Open requests", value: needRequests.filter((r) => r.status === "open").length },
  ];

  return (
    <div className="pb-16">
      {/* Identity banner */}
      <section className="relative overflow-hidden bg-ink-900 text-white">
        <div className="pointer-events-none absolute -right-24 -top-24 h-80 w-80 rounded-full bg-clay-600/40 blur-3xl" aria-hidden="true" />
        <div className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-moss-500/20 blur-3xl" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 py-10 sm:px-6 sm:py-12 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-5">
              <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-clay-600 font-display text-4xl text-white shadow-brand sm:h-24 sm:w-24">
                {initial}
              </span>
              <div className="min-w-0">
                <h1 className="truncate font-display text-3xl sm:text-4xl">{name}</h1>
                <p className="truncate text-ink-300">{user.email}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink-200">
                  {user.location && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {user.location}
                    </span>
                  )}
                  {user.phone && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
                      <Phone className="h-3.5 w-3.5" aria-hidden="true" /> {user.phone}
                    </span>
                  )}
                  <span className="rounded-full bg-white/10 px-3 py-1">
                    Member since {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <div className="[&_button]:border-white/30 [&_button]:bg-transparent [&_button]:text-white [&_button:hover]:border-white [&_button:hover]:bg-white/10">
              <LogoutButton />
            </div>
          </div>

          <dl className="mt-8 grid grid-cols-3 gap-3 sm:max-w-xl">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl bg-white/10 px-4 py-4 backdrop-blur">
                <dd className="font-display text-3xl">{s.value}</dd>
                <dt className="mt-0.5 text-xs font-medium text-ink-300 sm:text-sm">{s.label}</dt>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-10 sm:px-6 lg:grid-cols-[360px_1fr] lg:gap-10 lg:px-8">
        {/* Left: account settings */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-ink-100 bg-white p-6 shadow-pop">
            <h2 className="font-display text-xl text-ink-900">Account details</h2>
            <p className="mt-1 text-sm text-ink-500">Keep your details up to date.</p>
            <div className="mt-5">
              <ProfileForm
                displayName={user.displayName ?? ""}
                location={user.location ?? null}
                phone={user.phone ?? null}
              />
            </div>
            <Link
              href="/profile/change-password"
              className="mt-6 flex items-center gap-2 border-t border-ink-100 pt-5 text-sm font-semibold text-ink-700 transition-colors hover:text-clay-600"
            >
              <KeyRound className="h-4 w-4" aria-hidden="true" />
              Change password
            </Link>
            <DeleteAccount />
          </div>
        </aside>

        {/* Right: activity */}
        <div className="space-y-12">
          <section>
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl text-ink-900">My listings</h2>
                <p className="text-sm text-ink-500">Parts you&rsquo;re offering to others.</p>
              </div>
              <LinkButton href="/sell" size="sm" variant="primary">
                <Plus className="h-4 w-4" aria-hidden="true" /> New listing
              </LinkButton>
            </div>
            {listings.length > 0 ? (
              <div className="flex flex-col gap-3">
                {listings.map((l) => (
                  <MyListingItem key={l.id} listing={l} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="You haven't listed anything yet"
                description="Have a spare part sitting around? List it and someone might need exactly that."
                actionHref="/sell"
                actionLabel="Create a listing"
              />
            )}
          </section>

          <section>
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 className="font-display text-2xl text-ink-900">My need requests</h2>
                <p className="text-sm text-ink-500">Parts you&rsquo;re looking for.</p>
              </div>
              <LinkButton href="/need" size="sm" variant="outline">
                <Plus className="h-4 w-4" aria-hidden="true" /> New request
              </LinkButton>
            </div>
            {needRequests.length > 0 ? (
              <div className="flex flex-col gap-3">
                {needRequests.map((r) => (
                  <MyNeedRequestItem key={r.id} request={r} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No need requests yet"
                description="Search for a missing part and save a request if nobody has it listed yet."
                actionHref="/need"
                actionLabel="Find a part"
              />
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
