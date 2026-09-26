import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-20 bg-ink-900 text-ink-300">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
          <div className="col-span-2 sm:col-span-1">
            <p className="font-display text-lg text-paper">
              Piq<span className="text-clay-400">nex</span>
            </p>
            <p className="mt-3 max-w-[26ch] text-sm text-ink-400">
              Don&rsquo;t replace the whole product. Replace the missing piece.
            </p>
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
              { href: "/contact", label: "Contact Us" },
              { href: "/signup", label: "Create Account" },
            ]}
          />
          <FooterColumn
            title="Account"
            links={[
              { href: "/login", label: "Login" },
              { href: "/profile", label: "My Profile" },
            ]}
          />
        </div>
        <div className="mt-10 flex flex-col gap-2 border-t border-ink-800 pt-6 text-xs text-ink-500 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <p>&copy; {new Date().getFullYear()} Piqnex.</p>
            <Link href="/terms" className="hover:text-paper">
              Terms &amp; Conditions
            </Link>
            <Link href="/privacy" className="hover:text-paper">
              Privacy Policy
            </Link>
          </div>
          <p>An early build, made for validation - not a finished product.</p>
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
      <p className="text-xs font-semibold uppercase tracking-wide text-ink-500">{title}</p>
      <ul className="mt-3 space-y-2">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-sm text-ink-300 hover:text-paper"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
