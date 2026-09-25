import type { Metadata } from "next";
import { Card } from "@/components/ui/Card";
import { ListingForm } from "@/components/listings/ListingForm";

export const metadata: Metadata = {
  title: "I Have a Part",
  description: "List a spare, unused, or leftover part for sale on Piqnex.",
};

export default function SellPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <div className="text-center">
        <h1 className="font-display text-3xl text-ink-900">I Have a Part</h1>
        <p className="mt-2 text-ink-500">
          Got a spare charger, an extra earbud, a leftover screw set? List it here - someone
          out there needs exactly that.
        </p>
      </div>

      <Card className="mt-8 p-5 sm:p-7">
        <ListingForm />
      </Card>
    </div>
  );
}
