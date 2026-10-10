import { ArrowRight } from "lucide-react";
import { LinkButton } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";

export function CtaBanner() {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-10 sm:px-6 lg:px-8 lg:pb-16">
      <Reveal>
        <div className="relative overflow-hidden rounded-3xl bg-clay-50 px-6 py-12 sm:px-12 sm:py-16">
          <div
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-clay-200/70 blur-3xl"
            aria-hidden="true"
          />
          <div className="relative flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-xl">
              <h2 className="font-display text-3xl text-ink-900 sm:text-4xl">
                A spare part sitting in a drawer?
              </h2>
              <p className="mt-3 text-lg text-ink-600">
                Somebody out there is missing exactly that piece. List it in a couple of minutes.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <LinkButton href="/sell" size="lg" variant="primary" className="group">
                Sell a part
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
              </LinkButton>
              <LinkButton href="/need" size="lg" variant="secondary">
                Request a part
              </LinkButton>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
