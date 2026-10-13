import type { Metadata } from "next";
import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CONTACT_EMAIL } from "@/components/content/ContentPage";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Answers to common questions about buying, selling and requesting parts on Piqnex.",
};

const GROUPS: { title: string; items: { q: string; a: React.ReactNode }[] }[] = [
  {
    title: "Getting started",
    items: [
      {
        q: "What is Piqnex?",
        a: "Piqnex is a marketplace for single spare and replacement parts - a lost earbud, a laptop charger, a controller battery cover. If you're missing one piece, you can find it here, and if you have a spare, you can list it.",
      },
      {
        q: "Does it cost anything to join?",
        a: "No. Creating an account is free.",
      },
      {
        q: "Do I need an account to browse?",
        a: (
          <>
            You can browse listings without one. You&rsquo;ll need a free account to list a part,
            post a request or message a seller. <Link href="/signup">Create an account</Link>.
          </>
        ),
      },
    ],
  },
  {
    title: "Finding a part",
    items: [
      {
        q: "How do I find a specific part?",
        a: (
          <>
            Use <Link href="/browse">Browse</Link> to search and filter by category, brand,
            product, model, part, condition, price and location. Or go to{" "}
            <Link href="/need">I Need a Part</Link> and tell us exactly what you have and what&rsquo;s
            missing.
          </>
        ),
      },
      {
        q: "What does \"exact match\" mean?",
        a: "We only show a listing as a match for your request when the brand, product, model and part all line up. We'd rather show fewer, confirmed matches than a long list of maybes.",
      },
      {
        q: "Nobody has my part listed. What now?",
        a: "Save a need request. Sellers who list a matching part later will see there is demand for it.",
      },
      {
        q: "What are \"Sample\" listings?",
        a: "While the marketplace is new, some listings are demo data so the site doesn't look empty. They're clearly tagged Sample and have no real seller to contact.",
      },
    ],
  },
  {
    title: "Buying",
    items: [
      {
        q: "How do I contact a seller?",
        a: "Open a listing and use the Contact seller form. Write a short message and add the contact detail you want them to use (phone, email or WhatsApp). It is shown only to the seller.",
      },
      {
        q: "How do I pay for a part?",
        a: "Piqnex doesn't handle payments or delivery. You agree the price, payment and handover directly with the seller. Please read our safety tips first.",
      },
      {
        q: "How do I know a part will fit?",
        a: "Check the brand, product, model and condition on the listing, and ask the seller for photos or part numbers before you commit.",
      },
    ],
  },
  {
    title: "Selling",
    items: [
      {
        q: "How do I list a part?",
        a: (
          <>
            Log in and go to <Link href="/sell">I Have a Part</Link>. Add the brand, product, model,
            part, condition, price, photos and a short description.
          </>
        ),
      },
      {
        q: "How do I mark a part as sold or remove it?",
        a: "Open your Profile. Each of your listings has buttons to mark it sold or delete it.",
      },
      {
        q: "Can I sell anything?",
        a: (
          <>
            Piqnex is for individuals passing on spare or leftover parts, not bulk resellers. See
            our <Link href="/terms">Terms</Link> for what isn&rsquo;t allowed.
          </>
        ),
      },
    ],
  },
  {
    title: "Account",
    items: [
      {
        q: "I forgot my password.",
        a: (
          <>
            Use <Link href="/forgot-password">Forgot password</Link> and we&rsquo;ll help you set a new
            one.
          </>
        ),
      },
      {
        q: "How is my data used?",
        a: (
          <>
            See our <Link href="/privacy">Privacy Policy</Link>.
          </>
        ),
      },
    ],
  },
];

export default function FaqPage() {
  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Help"
        title="Frequently asked questions"
        subtitle="Quick answers about finding, buying and selling spare parts on Piqnex."
      />
      <div className="mx-auto max-w-3xl space-y-12 px-4 pt-12 sm:px-6">
        {GROUPS.map((group) => (
          <section key={group.title}>
            <h2 className="font-display text-2xl text-ink-900">{group.title}</h2>
            <div className="mt-4 divide-y divide-ink-100 overflow-hidden rounded-2xl border border-ink-100 bg-white shadow-card">
              {group.items.map((item) => (
                <details key={item.q} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 text-left font-semibold text-ink-900 transition-colors hover:bg-ink-50 [&::-webkit-details-marker]:hidden">
                    {item.q}
                    <ChevronDown
                      className="h-5 w-5 shrink-0 text-ink-400 transition-transform duration-200 group-open:rotate-180 group-open:text-clay-600"
                      aria-hidden="true"
                    />
                  </summary>
                  <div className="px-5 pb-5 leading-relaxed text-ink-600 [&_a]:font-semibold [&_a]:text-clay-600 [&_a]:underline">
                    {item.a}
                  </div>
                </details>
              ))}
            </div>
          </section>
        ))}

        <div className="rounded-3xl bg-clay-50 p-8 text-center">
          <h2 className="font-display text-2xl text-ink-900">Still need help?</h2>
          <p className="mt-2 text-ink-600">
            Write to us at <span className="font-semibold">{CONTACT_EMAIL}</span> and we&rsquo;ll get back
            to you.
          </p>
          <div className="mt-5">
            <LinkButton href="/contact" size="md">
              Contact us
            </LinkButton>
          </div>
        </div>
      </div>
    </div>
  );
}
