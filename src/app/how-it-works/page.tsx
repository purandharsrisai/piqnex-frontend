import type { Metadata } from "next";
import { HowItWorks } from "@/components/home/HowItWorks";
import { LinkButton } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "How Piqnex connects people who need a specific part with people who have one to spare.",
};

export default function HowItWorksPage() {
  return (
    <div className="pb-16">
      <div className="mx-auto max-w-3xl px-4 py-14 text-center sm:px-6">
        <h1 className="font-display text-3xl text-ink-900 sm:text-4xl">
          Don&rsquo;t replace the whole product.
          <br />
          Replace the missing piece.
        </h1>
        <p className="mt-4 text-lg text-ink-600">
          Most products don&rsquo;t break completely - they just lose one part. A left
          earbud. A laptop charger. A controller battery cover. Piqnex connects
          people who need that exact part with people who happen to have a spare one.
        </p>
      </div>

      <HowItWorks />

      <div className="mx-auto mt-14 max-w-3xl px-4 text-center sm:px-6">
        <h2 className="font-display text-xl text-ink-900">Why exact matching matters</h2>
        <p className="mt-3 text-ink-600">
          We don&rsquo;t guess at compatibility. A listing is only surfaced as a match for
          your request when the brand, product, model, and part all line up. As the
          catalog grows, we&rsquo;ll layer in smarter compatibility suggestions (e.g. &ldquo;this
          charger also fits models X and Y&rdquo;) - but we&rsquo;ll always be upfront about what&rsquo;s
          a confirmed match versus a possible one.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <LinkButton href="/need" size="lg">
            I Need a Part
          </LinkButton>
          <LinkButton href="/sell" variant="outline" size="lg">
            I Have a Part
          </LinkButton>
        </div>
      </div>
    </div>
  );
}
