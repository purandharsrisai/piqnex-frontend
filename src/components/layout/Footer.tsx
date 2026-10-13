import Link from "next/link";
import { LogoMark } from "./Logo";
import { CONTACT_EMAIL } from "@/components/content/ContentPage";
import { getCurrentUser } from "@/lib/api-client";
// Shows the current build/version number in the footer - see
// scripts/bump-version.js, which bumps this automatically on every commit.
import packageJson from "../../../package.json";

export async function Footer() {
  // Signed-in visitors get their account shortcuts; everyone else gets Login / Create Account.
  const user = await getCurrentUser();
  const accountLinks = user
    ? [
        // { href: "/profile", label: "My Profile" },
        { href: "/my-listings", label: "My Listings" },
        { href: "/my-requests", label: "My Requests" },
        { href: "/saved", label: "Saved Parts" },
      ]
    : [
        { href: "/login", label: "Login" },
        { href: "/signup", label: "Create Account" },
      ];

  return (
    <footer className="mt-10 bg-ink-900 text-ink-300">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="flex items-center gap-2.5 font-display text-2xl text-white">
              <LogoMark className="h-9 w-9 shrink-0" />
              <span>
                Piq<span className="text-clay-400">nex</span>
              </span>
            </p>
            <p className="mt-3 max-w-[26ch] text-sm text-ink-400">
              Don&rsquo;t replace the whole product. Replace the missing piece.
            </p>
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="mt-3 inline-block text-sm text-ink-300 hover:text-white"
            >
              {CONTACT_EMAIL}
            </a>
          </div>
          <FooterColumn
            title="Marketplace"
            links={[
              { href: "/browse", label: "Browse Parts" },
              { href: "/need", label: "I Need a Part" },
              { href: "/sell", label: "I Have a Part" },
            ]}
          />
          <FooterColumn
            title="Company"
            links={[
              { href: "/about", label: "About Us" },
              { href: "/how-it-works", label: "How It Works" },
              { href: "/faq", label: "FAQ" },
              { href: "/safety", label: "Safety Tips" },
              { href: "/contact", label: "Contact Us" },
            ]}
          />
          <FooterColumn title="Account" links={accountLinks} />
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-ink-800 pt-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p>&copy; {new Date().getFullYear()} Piqnex.</p>
            <Link href="/terms" className="hover:text-white">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>
          </div>
          {/* Build number is only for us while testing - never shown to visitors in production. */}
          {process.env.NODE_ENV !== "production" && (
            <span className="w-fit rounded-full bg-ink-800 px-2.5 py-1 text-[11px] font-semibold text-ink-300">
              v{packageJson.version}
            </span>
          )}
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { href: string; label: string }[];
}) {
  return (
    <div>
      <p className="text-sm font-bold text-white">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-ink-300 hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
