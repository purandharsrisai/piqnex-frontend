import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage, ContentSection, CONTACT_EMAIL } from "@/components/content/ContentPage";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "What information Piqnex collects, how we use it, and the choices you have.",
};

export default function PrivacyPage() {
  return (
    <ContentPage
      title="Privacy Policy"
      lastUpdated="25 September 2026"
      intro="Your privacy matters to us. This policy explains what we collect, why, and what you can do about it."
    >
      <ContentSection title="1. Information we collect">
        <p>We only collect what we need to run the marketplace:</p>
        <ul>
          <li>
            <strong className="text-ink-800">Account details</strong> - your email address,
            password (stored securely by our authentication provider, never in plain text), and
            display name.
          </li>
          <li>
            <strong className="text-ink-800">Profile details</strong> - your location and
            profile picture, if you choose to add them.
          </li>
          <li>
            <strong className="text-ink-800">Listings and requests</strong> - the parts you
            list or request, including descriptions, condition, price, location, and photos.
          </li>
          <li>
            <strong className="text-ink-800">Messages</strong> - contact requests you send to
            sellers, including any contact information you include in them.
          </li>
          <li>
            <strong className="text-ink-800">Technical data</strong> - basic information such
            as browser type and cookies needed to keep you signed in.
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="2. How we use it">
        <ul>
          <li>To create and manage your account and keep you signed in.</li>
          <li>To show your listings and requests, and match them with other users.</li>
          <li>To pass your contact requests on to the relevant seller.</li>
          <li>To keep Piqnex safe, prevent fraud, and enforce our Terms.</li>
          <li>To understand how Piqnex is used and improve it.</li>
        </ul>
        <p>We do not sell your personal information.</p>
      </ContentSection>

      <ContentSection title="3. What other users can see">
        <p>
          Your display name, location, and the listings and requests you post are visible to
          other visitors - that&rsquo;s how buyers and sellers find each other. When you send a
          contact request, the seller can see your message and any contact details you choose
          to include. Your email address is not shown publicly.
        </p>
      </ContentSection>

      <ContentSection title="4. Service providers">
        <p>
          We use trusted third-party providers to run Piqnex, such as our database,
          authentication, file storage, and hosting providers. They process data on our behalf
          and only as needed to provide their services. Your data may be stored on servers
          outside your country.
        </p>
        <p>
          We may also share information if required by law, or to protect the rights and
          safety of our users or the public.
        </p>
      </ContentSection>

      <ContentSection title="5. Cookies">
        <p>
          We use essential cookies to keep you signed in and to make the site work. We do not
          use advertising cookies.
        </p>
      </ContentSection>

      <ContentSection title="6. How long we keep data">
        <p>
          We keep your information for as long as your account is active. If you delete your
          account, your profile, listings, requests, and messages are deleted, except where we
          need to keep limited records for legal or security reasons.
        </p>
      </ContentSection>

      <ContentSection title="7. Your choices and rights">
        <ul>
          <li>
            You can view and edit your profile, listings, and requests at any time from your{" "}
            <Link href="/profile">profile page</Link>.
          </li>
          <li>
            You can ask us for a copy of your data, to correct it, or to delete your account by
            emailing us.
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="8. Security">
        <p>
          We use industry-standard measures to protect your information, including encrypted
          connections and access controls. No online service is completely secure, so please
          use a strong, unique password.
        </p>
      </ContentSection>

      <ContentSection title="9. Children">
        <p>
          Piqnex is not intended for children under 18 without a parent or guardian&rsquo;s
          consent, and we do not knowingly collect their data.
        </p>
      </ContentSection>

      <ContentSection title="10. Changes to this policy">
        <p>
          We may update this policy from time to time. When we do, we&rsquo;ll change the
          &ldquo;Last updated&rdquo; date above.
        </p>
      </ContentSection>

      <ContentSection title="11. Contact">
        <p>
          Questions or requests about your privacy? Email us at{" "}
          <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>. See also our{" "}
          <Link href="/terms">Terms &amp; Conditions</Link>.
        </p>
      </ContentSection>
    </ContentPage>
  );
}
