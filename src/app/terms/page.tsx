import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection, CONTACT_EMAIL } from "@/components/content/ContentPage";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms that apply when you use Piqnex to find, list, or request parts.",
};

export default function TermsPage() {
  return (
    <ContentPage
      title="Terms & Conditions"
      lastUpdated="25 September 2026"
      intro="Please read these terms carefully. By creating an account or using Piqnex, you agree to them."
    >
      <ContentSection title="1. About these terms">
        <p>
          These Terms &amp; Conditions (&ldquo;Terms&rdquo;) govern your use of the Piqnex
          website and services (&ldquo;Piqnex&rdquo;, &ldquo;we&rdquo;, &ldquo;us&rdquo;). If
          you do not agree with them, please do not use Piqnex.
        </p>
      </ContentSection>

      <ContentSection title="2. What Piqnex is">
        <p>
          Piqnex is a platform that helps people who need a specific replacement part find
          people who have one. We provide the listings, requests, matching, and contact tools.
          <strong className="text-ink-800">
            {" "}
            We are not a party to any sale, do not own or inspect the items listed, and do not
            handle payments or delivery.
          </strong>{" "}
          Any transaction is strictly between the buyer and the seller.
        </p>
      </ContentSection>

      <ContentSection title="3. Your account">
        <ul>
          <li>You must be at least 18 years old, or have a parent or guardian&rsquo;s consent, to use Piqnex.</li>
          <li>The information you give us must be accurate and kept up to date.</li>
          <li>
            You are responsible for keeping your login details secure and for all activity
            under your account.
          </li>
          <li>One person, one account. Accounts may not be sold or transferred.</li>
        </ul>
      </ContentSection>

      <ContentSection title="4. Listings and requests">
        <p>When you post a listing (&ldquo;I Have&rdquo;) or a request (&ldquo;I Need&rdquo;), you agree that:</p>
        <ul>
          <li>You own the item you list, or are authorised to sell it.</li>
          <li>
            Descriptions, condition, photos, and prices are honest and accurate, and match the
            actual item.
          </li>
          <li>You will mark listings as sold or remove them once they are no longer available.</li>
          <li>
            You give Piqnex permission to display, store, and format your listing content so it
            can be shown on the platform.
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="5. Prohibited items and conduct">
        <p>You must not use Piqnex to:</p>
        <ul>
          <li>List stolen, counterfeit, recalled, or unsafe items, or anything illegal to sell.</li>
          <li>Post misleading, fraudulent, abusive, or spam content.</li>
          <li>Harass other users or misuse their contact details.</li>
          <li>
            Scrape, reverse-engineer, overload, or otherwise interfere with the platform or its
            security.
          </li>
        </ul>
        <p>We may remove content or suspend accounts that break these rules, without notice.</p>
      </ContentSection>

      <ContentSection title="6. Dealing with other users">
        <p>
          Please use common sense when buying or selling: confirm compatibility, meet in safe
          public places, inspect items before paying, and never share sensitive financial
          information. Matches shown by Piqnex are based on the details users provide - we
          cannot guarantee that a part will fit or work.
        </p>
      </ContentSection>

      <ContentSection title="7. Disclaimer and limitation of liability">
        <p>
          Piqnex is provided &ldquo;as is&rdquo; and &ldquo;as available.&rdquo; To the
          fullest extent permitted by law, we make no warranties about the platform or any item
          listed on it, and we are not liable for any loss or damage arising from transactions
          between users, from the quality, safety, or legality of items, or from your use of
          the platform.
        </p>
      </ContentSection>

      <ContentSection title="8. Ending your use of Piqnex">
        <p>
          You can stop using Piqnex at any time. We may suspend or close accounts that violate
          these Terms or put other users at risk.
        </p>
      </ContentSection>

      <ContentSection title="9. Changes to these terms">
        <p>
          We may update these Terms from time to time. When we do, we&rsquo;ll change the
          &ldquo;Last updated&rdquo; date above. Continuing to use Piqnex after a change means
          you accept the updated Terms.
        </p>
      </ContentSection>

      <ContentSection title="10. Governing law">
        <p>
          These Terms are governed by the laws of India, and any disputes are subject to the
          jurisdiction of the courts of India.
        </p>
      </ContentSection>

      <ContentSection title="11. Contact">
        <p>
          Questions about these Terms? Email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. See also our{" "}
          <Link href="/privacy">Privacy Policy</Link>.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
