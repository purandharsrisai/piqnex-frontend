const buyerSteps = [
  { title: "Tell us what you're missing", body: "Product, exact model, and the part you need." },
  { title: "Find a matching part", body: "We search active listings for an exact match." },
  { title: "Connect with the seller", body: "Message them directly and work out the details." },
];

const sellerSteps = [
  { title: "Tell us what you have", body: "Spare, unused, or leftover component from any product." },
  { title: "List the part", body: "Add condition, price, photos, and a short description." },
  { title: "Find someone who needs it", body: "We'll surface your listing to matching buyers." },
];

export function HowItWorks() {
  return (
    <section className="border-y border-ink-200/70 bg-white">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <h2 className="font-display text-2xl text-ink-900">How it works</h2>
        <div className="mt-10 grid gap-12 md:grid-cols-2 md:gap-16">
          <StepColumn title="If you're missing a part" steps={buyerSteps} />
          <StepColumn title="If you have a spare part" steps={sellerSteps} />
        </div>
      </div>
    </section>
  );
}

function StepColumn({
  title,
  steps,
}: {
  title: string;
  steps: { title: string; body: string }[];
}) {
  return (
    <div>
      <h3 className="text-xs font-semibold uppercase tracking-wide text-clay-700">{title}</h3>
      <ol className="relative mt-5 space-y-7">
        {/* The connecting line is the detail that turns three separate
            items into one continuous process. */}
        <div className="absolute bottom-4 left-4 top-4 w-px bg-ink-200" aria-hidden="true" />
        {steps.map((step, i) => (
          <li key={step.title} className="relative flex items-start gap-4 pl-0">
            <span className="relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-ink-300 bg-paper font-display text-sm text-ink-800">
              {i + 1}
            </span>
            <div className="pt-1">
              <p className="font-medium text-ink-900">{step.title}</p>
              <p className="mt-0.5 text-sm text-ink-500">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
