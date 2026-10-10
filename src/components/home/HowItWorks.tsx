import { Reveal } from "@/components/ui/Reveal";

const buyerSteps = [
  { title: "Tell us what you're missing", body: "Product, exact model, and the part you need." },
  { title: "Find a matching part", body: "We search active listings for an exact match." },
  { title: "Connect with the seller", body: "Message them directly and work out the details." },
];

const sellerSteps = [
  { title: "Tell us what you have", body: "A spare, unused or leftover component from any product." },
  { title: "List the part", body: "Add condition, price, photos and a short description." },
  { title: "Meet someone who needs it", body: "We surface your listing to matching buyers." },
];

export function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <Reveal>
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-wider text-clay-600">How it works</p>
          <h2 className="mt-2 font-display text-3xl text-ink-900 sm:text-4xl">
            Two sides, one simple loop
          </h2>
        </div>
      </Reveal>
      <div className="mt-10 grid gap-5 md:grid-cols-2 md:gap-6">
        <Reveal delay={0.05}>
          <Panel title="If you're missing a part" steps={buyerSteps} theme="brand" />
        </Reveal>
        <Reveal delay={0.12}>
          <Panel title="If you have a spare part" steps={sellerSteps} theme="dark" />
        </Reveal>
      </div>
    </section>
  );
}

function Panel({
  title,
  steps,
  theme,
}: {
  title: string;
  steps: { title: string; body: string }[];
  theme: "brand" | "dark";
}) {
  const brand = theme === "brand";
  return (
    <div
      className={`relative h-full overflow-hidden rounded-3xl p-7 text-white shadow-pop sm:p-10 ${
        brand ? "bg-clay-600" : "bg-ink-900"
      }`}
    >
      <div
        className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-3xl ${
          brand ? "bg-clay-400/50" : "bg-clay-600/30"
        }`}
        aria-hidden="true"
      />
      <h3 className="relative font-display text-2xl sm:text-3xl">{title}</h3>
      <ol className="relative mt-8 space-y-6">
        {steps.map((step, i) => (
          <li key={step.title} className="flex items-start gap-4">
            <span
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-display text-lg ${
                brand ? "bg-white text-clay-700" : "bg-clay-600 text-white"
              }`}
            >
              {i + 1}
            </span>
            <div className="pt-0.5">
              <p className="text-lg font-bold">{step.title}</p>
              <p className={`mt-0.5 ${brand ? "text-clay-50" : "text-ink-300"}`}>{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
