import type { Metadata } from "next";
import Link from "next/link";
import { Clock, Mail, ShieldCheck } from "lucide-react";
import { CONTACT_EMAIL } from "@/components/content/ContentPage";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ContactForm } from "@/components/support/ContactForm";
import { getCurrentUser } from "@/lib/api-client";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Piqnex team - questions, feedback, account help, or reporting a listing.",
};

export default async function ContactPage() {
  // Pre-fill name and email for signed-in users.
  const user = await getCurrentUser();

  return (
    <div className="pb-16">
      <PageHeader
        title="Contact Us"
        subtitle="Questions, feedback, or something not working? Send us a message and we'll get back to you."
      />
      <div className="mx-auto grid max-w-5xl gap-8 px-4 pt-10 sm:px-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <Card className="rounded-3xl p-6 sm:p-8">
          <ContactForm defaultName={user?.displayName ?? ""} defaultEmail={user?.email ?? ""} />
        </Card>

        <aside className="flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
          <Card className="flex gap-3 rounded-2xl bg-clay-50 p-5">
            <Mail className="mt-0.5 h-5 w-5 shrink-0 text-clay-700" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-ink-900">Prefer email?</p>
              <a href={`mailto:${CONTACT_EMAIL}`} className="text-sm text-clay-700 hover:underline">
                {CONTACT_EMAIL}
              </a>
            </div>
          </Card>
          <Card className="flex gap-3 rounded-2xl p-5">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-moss-700" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-ink-900">Reply time</p>
              <p className="text-sm text-ink-600">We usually reply within 2 business days.</p>
            </div>
          </Card>
          <Card className="flex gap-3 rounded-2xl p-5">
            <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-moss-700" aria-hidden="true" />
            <div>
              <p className="text-sm font-semibold text-ink-900">Stay safe</p>
              <p className="text-sm text-ink-600">
                We never ask for your password or payment details. Read our{" "}
                <Link href="/safety" className="font-medium text-clay-700 hover:underline">
                  safety tips
                </Link>
                .
              </p>
            </div>
          </Card>
          <p className="px-1 text-sm text-ink-500">
            New here? <Link href="/how-it-works" className="font-medium text-clay-700 hover:underline">How It Works</Link>{" "}
            and the <Link href="/faq" className="font-medium text-clay-700 hover:underline">FAQ</Link> answer most questions.
          </p>
        </aside>
      </div>
    </div>
  );
}
