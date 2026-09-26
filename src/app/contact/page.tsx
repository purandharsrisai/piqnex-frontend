import type { Metadata } from "next";
import Link from "next/link";
import { Mail } from "lucide-react";
import { ContentPage, ContentSection, CONTACT_EMAIL } from "@/components/content/ContentPage";
import { Card } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the Piqnex team - questions, feedback, account help, or reporting a listing.",
};

export default function ContactPage() {
  return (
    <ContentPage
      title="Contact Us"
      intro={<>Questions, feedback, or something not working? We&rsquo;d love to hear from you.</>}
    >
      <Card className="flex flex-col items-center gap-4 p-8 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-clay-100 text-clay-700">
          <Mail className="h-6 w-6" />
        </div>
        <div>
          <p className="text-sm text-ink-500">Email us at</p>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="font-display text-xl text-ink-900 hover:text-clay-700"
          >
            {CONTACT_EMAIL}
          </a>
        </div>
        <LinkButton href={`mailto:${CONTACT_EMAIL}`} size="lg">
          Send an Email
        </LinkButton>
        <p className="text-sm text-ink-400">We usually reply within 2 business days.</p>
      </Card>

      <ContentSection title="What we can help with">
        <ul>
          <li>
            <strong className="text-ink-800">Account help</strong> - trouble logging in, signing
            up, or updating your profile.
          </li>
          <li>
            <strong className="text-ink-800">Listings and requests</strong> - questions about
            posting an &ldquo;I Have&rdquo; listing or an &ldquo;I Need&rdquo; request.
          </li>
          <li>
            <strong className="text-ink-800">Reporting a problem</strong> - a suspicious listing,
            an abusive message, or a bug on the site.
          </li>
          <li>
            <strong className="text-ink-800">Feedback and ideas</strong> - parts or products
            you&rsquo;d like to see, or anything we could do better.
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="Help us help you faster">
        <p>When you write in, it helps to include:</p>
        <ul>
          <li>The email address on your Piqnex account, if you have one.</li>
          <li>A link to the listing or request you&rsquo;re asking about.</li>
          <li>For bugs, what you were doing and what you expected to happen.</li>
        </ul>
        <p>
          Please don&rsquo;t send passwords or payment details by email - we&rsquo;ll never ask
          for them.
        </p>
      </ContentSection>

      <ContentSection title="Before you write">
        <p>
          New to Piqnex? <Link href="/how-it-works">How It Works</Link> covers posting requests,
          listing spare parts, and how matching works. For how we handle your data, see our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
