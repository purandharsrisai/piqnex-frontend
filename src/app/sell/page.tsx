import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ListingForm } from "@/components/listings/ListingForm";

export const metadata: Metadata = {
  title: "I Have a Part",
  description: "List a spare, unused, or leftover part for sale on Piqnex.",
};

export default function SellPage() {
  return (
    <div>
      <PageHeader
        eyebrow="I have a part"
        title="List a spare part"
        subtitle="Got a spare charger, an extra earbud, a leftover screw set? List it here - someone out there needs exactly that."
      />
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Card className="rounded-3xl p-5 shadow-pop sm:p-8">
          <ListingForm />
        </Card>
      </div>
    </div>
  );
}
