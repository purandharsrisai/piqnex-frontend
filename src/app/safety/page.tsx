import type { Metadata } from "next";
import Link from "next/link";
import { BadgeCheck, Banknote, Camera, KeyRound, MapPin, ShieldAlert } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { CONTACT_EMAIL } from "@/components/content/ContentPage";

export const metadata: Metadata = {
  title: "Safety Tips",
  description: "How to buy and sell spare parts safely on Piqnex.",
};

const TIPS = [
  {
    icon: BadgeCheck,
    title: "Check the match first",
    body: "Confirm the brand, product, model and part number before you pay. Ask for photos of the part and, if you can, of the label or serial area.",
  },
  {
    icon: MapPin,
    title: "Meet somewhere public",
    body: "If you're handing over a part in person, choose a busy, well-lit place and go during the day. Consider bringing a friend.",
  },
  {
    icon: Banknote,
    title: "Pay on your terms",
    body: "Piqnex doesn't handle payments or delivery. Be wary of sellers who ask for payment upfront for a part you haven't seen, or who refuse a quick call or video check.",
  },
  {
    icon: Camera,
    title: "Test before you pay",
    body: "Where possible, test the part with your own device at handover. Look for damage and confirm it works as described.",
  },
  {
    icon: KeyRound,
    title: "Keep your details private",
    body: "Share only what's needed to complete the sale. Never share passwords, OTPs, banking logins or ID documents - we will never ask for them.",
  },
  {
    icon: ShieldAlert,
    title: "Trust your instincts",
    body: "If a deal feels too good to be true, or the other person is pressuring you to act fast, walk away.",
  },
];

export default function SafetyPage() {
  return (
    <div className="pb-16">
      <PageHeader
        eyebrow="Help"
        title="Buy and sell safely"
        subtitle="Piqnex connects individuals, so a little care goes a long way. These tips apply to both buyers and sellers."
      />
      <div className="mx-auto max-w-5xl px-4 pt-12 sm:px-6">
        <div className="grid gap-5 sm:grid-cols-2">
          {TIPS.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-3xl border border-ink-100 bg-white p-6 shadow-card">
              <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-clay-100 text-clay-600">
                <Icon className="h-6 w-6" aria-hidden="true" />
              </span>
              <h2 className="mt-4 font-display text-xl text-ink-900">{title}</h2>
              <p className="mt-2 leading-relaxed text-ink-600">{body}</p>
            </div>
          ))}
        </div>

        <div className="mt-10 rounded-3xl bg-ink-900 p-8 text-white sm:p-10">
          <h2 className="font-display text-2xl">Something doesn&rsquo;t look right?</h2>
          <p className="mt-2 max-w-2xl text-ink-300">
            If you come across a suspicious listing, an abusive message or anything that makes you
            uncomfortable, email us at{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-white underline">
              {CONTACT_EMAIL}
            </a>{" "}
            with a link to the listing. See also our{" "}
            <Link href="/faq" className="font-semibold text-white underline">
              FAQ
            </Link>{" "}
            and{" "}
            <Link href="/terms" className="font-semibold text-white underline">
              Terms
            </Link>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
