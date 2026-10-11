import Link from "next/link";
import { ArrowRight, Check, ChevronRight, Circle, MapPin, PackagePlus, Search, UserPen } from "lucide-react";
import { Avatar } from "@/components/ui/Avatar";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
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
  avatarUrl?: string | null;
  bio?: string | null;
}

/**
 * Presentational profile overview: identity banner + stats on top, recent
 * listings and requests on the left, profile completeness and quick links on
 * the right. Full lists live on /my-listings and /my-requests. Data is
 * fetched in app/profile/page.tsx and passed in.
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
  const stats = [
    { label: "Active listings", value: listings.filter((l) => l.status === "active").length },
    { label: "Parts sold", value: listings.filter((l) => l.status === "sold").length },
    { label: "Open requests", value: needRequests.filter((r) => r.status === "open").length },
  ];

  const checklist = [
    { label: "Add your name", done: Boolean(user.displayName?.trim()) },
    { label: "Add a profile photo", done: Boolean(user.avatarUrl) },
    { label: "Add your city", done: Boolean(user.location?.trim()) },
    { label: "Write a short bio", done: Boolean(user.bio?.trim()) },
    { label: "Add a phone number", done: Boolean(user.phone?.trim()) },
    { label: "List your first part", done: listings.length > 0 },
  ];
  const doneCount = checklist.filter((c) => c.done).length;
  const percent = Math.round((doneCount / checklist.length) * 100);

  const links = [
    { href: "/sell", label: "List a part", icon: PackagePlus },
    { href: "/need", label: "Request a part", icon: Search },
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
              <Avatar url={user.avatarUrl} name={user.displayName || user.email} className="h-20 w-20 font-display text-4xl shadow-brand sm:h-24 sm:w-24" />
              <div className="min-w-0">
                <h1 className="truncate font-display text-3xl sm:text-4xl">{name}</h1>
                <p className="max-w-xl text-ink-300">{user.bio || "Piqnex member"}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-ink-200">
                  {user.location && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1">
                      <MapPin className="h-3.5 w-3.5" aria-hidden="true" /> {user.location}
                    </span>
                  )}
                  <span className="rounded-full bg-white/10 px-3 py-1">
                    Member since {formatDate(user.createdAt)}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 [&_a]:border-white/30 [&_a]:bg-transparent [&_a]:text-white [&_a:hover]:border-white [&_a:hover]:bg-white/10">
              <LinkButton href="/profile/edit" variant="outline" size="sm">
                <UserPen className="h-4 w-4" aria-hidden="true" /> Edit profile
              </LinkButton>
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

      <div className="mx-auto grid max-w-7xl gap-8 px-4 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_340px] lg:items-start lg:gap-10 lg:px-8">
        {/* Left: recent activity */}
        <div className="min-w-0 space-y-12">
          <section aria-labelledby="recent-listings">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 id="recent-listings" className="font-display text-2xl text-ink-900">Recent listings</h2>
                <p className="text-sm text-ink-500">Parts you&rsquo;re offering to others.</p>
              </div>
              <Link href="/my-listings" className="inline-flex items-center gap-1 text-sm font-semibold text-clay-600 hover:underline">
                View all ({listings.length}) <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            {listings.length > 0 ? (
              <div className="flex flex-col gap-3">
                {listings.slice(0, 3).map((l) => (
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

          <section aria-labelledby="recent-requests">
            <div className="mb-4 flex items-end justify-between gap-3">
              <div>
                <h2 id="recent-requests" className="font-display text-2xl text-ink-900">Recent requests</h2>
                <p className="text-sm text-ink-500">Parts you&rsquo;re looking for.</p>
              </div>
              <Link href="/my-requests" className="inline-flex items-center gap-1 text-sm font-semibold text-clay-600 hover:underline">
                View all ({needRequests.length}) <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </div>
            {needRequests.length > 0 ? (
              <div className="flex flex-col gap-3">
                {needRequests.slice(0, 3).map((r) => (
                  <MyNeedRequestItem key={r.id} request={r} />
                ))}
              </div>
            ) : (
              <EmptyState
                title="No requests yet"
                description="Search for a missing part and save a request if nobody has it listed yet."
                actionHref="/need"
                actionLabel="Find a part"
              />
            )}
          </section>
        </div>

        {/* Right: completeness + quick links */}
        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-ink-100 bg-white p-5 shadow-card">
            <div className="flex items-center justify-between">
              <h2 className="font-display text-lg text-ink-900">Profile strength</h2>
              <span className="text-sm font-bold text-clay-600">{percent}%</span>
            </div>
            <div
              className="mt-3 h-2 overflow-hidden rounded-full bg-ink-100"
              role="progressbar"
              aria-valuenow={percent}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-label="Profile completeness"
            >
              <div className="h-full rounded-full bg-clay-600 transition-all" style={{ width: `${percent}%` }} />
            </div>
            <ul className="mt-4 space-y-2.5">
              {checklist.map((c) => (
                <li key={c.label} className="flex items-center gap-2.5 text-sm">
                  {c.done ? (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-moss-500 text-white">
                      <Check className="h-3 w-3" aria-hidden="true" />
                    </span>
                  ) : (
                    <Circle className="h-5 w-5 text-ink-300" aria-hidden="true" />
                  )}
                  <span className={c.done ? "text-ink-500 line-through" : "font-medium text-ink-800"}>{c.label}</span>
                </li>
              ))}
            </ul>
            {percent < 100 && (
              <LinkButton href="/profile/edit" size="sm" variant="outline" className="mt-5 w-full">
                <UserPen className="h-4 w-4" aria-hidden="true" /> Complete your profile
              </LinkButton>
            )}
          </div>

          <nav aria-label="Start something" className="rounded-3xl border border-ink-100 bg-white p-2 shadow-card">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-sm font-semibold text-ink-800 transition-colors hover:bg-ink-50"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-clay-50 text-clay-600 transition-colors group-hover:bg-clay-100">
                  <Icon className="h-4 w-4" aria-hidden="true" />
                </span>
                <span className="flex-1">{label}</span>
                <ChevronRight className="h-4 w-4 text-ink-300 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
              </Link>
            ))}
          </nav>
        </aside>
      </div>
    </div>
  );
}
