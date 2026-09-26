import type { Metadata } from "next";
import { ContentPage, ContentSection, CONTACT_EMAIL } from "@/components/content/ContentPage";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Piqnex is a marketplace for the single missing part - connecting people who need one with people who have a spare.",
};

export default function AboutPage() {
  return (
    <ContentPage
      title="About Us"
      intro={
        <>
          Piqnex exists for one simple reason: most products don&rsquo;t break completely -
          they just lose one piece.
        </>
      }
    >
      <ContentSection title="The problem">
        <p>
          A lost left earbud. A frayed laptop charger. A missing controller battery cover.
          When a single part goes missing, the usual options are to hunt for an official
          replacement that may not exist, or to throw the whole product away and buy a new
          one. That&rsquo;s expensive for you and wasteful for everyone.
        </p>
        <p>
          Meanwhile, drawers everywhere are full of perfectly good spare parts - the
          leftover earbud from a set someone replaced, the charger from a laptop that died,
          the cover from a controller that broke.
        </p>
      </ContentSection>

      <ContentSection title="What we do">
        <p>
          Piqnex connects those two groups. If you need a part, post an &ldquo;I Need&rdquo;
          request with the exact brand, product, model, and part. If you have one to spare,
          list it under &ldquo;I Have.&rdquo; We match requests and listings only when those
          details line up, so you&rsquo;re not left guessing about compatibility.
        </p>
      </ContentSection>

      <ContentSection title="What we believe">
        <ul>
          <li>
            <strong className="text-ink-800">Repair beats replace.</strong> Keeping a product
            working with one part is better than sending it to landfill.
          </li>
          <li>
            <strong className="text-ink-800">Exact over approximate.</strong> We&rsquo;d rather
            show you fewer, confirmed matches than a long list of maybes.
          </li>
          <li>
            <strong className="text-ink-800">People first.</strong> Piqnex is a place for
            individuals to help each other out, not a storefront for bulk resellers.
          </li>
        </ul>
      </ContentSection>

      <ContentSection title="Where we are">
        <p>
          Piqnex is an early build. We&rsquo;re still growing the parts catalog and learning
          from the people who use it. If you have feedback, ideas, or just want to say hello,
          write to us at <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>.
        </p>
      </ContentSection>

      <div className="flex flex-col justify-center gap-3 pt-2 sm:flex-row">
        <LinkButton href="/need" size="lg">
          I Need a Part
        </LinkButton>
        <LinkButton href="/sell" variant="outline" size="lg">
          I Have a Part
        </LinkButton>
      </div>
    </ContentPage>
  );
}
