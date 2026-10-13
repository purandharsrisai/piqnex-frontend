import type { Metadata } from "next";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CtaBanner } from "@/components/home/CtaBanner";
import { PageHeader } from "@/components/ui/PageHeader";

export const metadata: Metadata = {
  title: "How It Works",
  description:
    "How Piqnex connects people who need a specific part with people who have one to spare.",
};

export default function HowItWorksPage() {
  return (
    <div>
      <PageHeader
        eyebrow="The idea"
        title={
          <>
            Don&rsquo;t replace the whole product.
            <br className="hidden sm:block" /> Replace the missing piece.
          </>
        }
        subtitle="Most products don't break completely - they just lose one part. A left earbud. A laptop charger. A controller battery cover. Piqnex connects people who need that exact part with people who happen to have a spare one."
      />

      <HowItWorks />

      <section className="mx-auto max-w-3xl px-4 pb-6 text-center sm:px-6">
        <h2 className="font-display text-2xl text-ink-900 sm:text-3xl">Why exact matching matters</h2>
        <p className="mt-3 text-lg leading-relaxed text-ink-600">
          We don&rsquo;t guess at compatibility. A listing is only surfaced as a match for
          your request when the brand, product, model, and part all line up. As the
          catalog grows, we&rsquo;ll layer in smarter compatibility suggestions (e.g. &ldquo;this
          charger also fits models X and Y&rdquo;) - but we&rsquo;ll always be upfront about what&rsquo;s
          a confirmed match versus a possible one.
        </p>
      </section>

      <div className="pt-8">
        <CtaBanner />
      </div>
    </div>
  );
}
