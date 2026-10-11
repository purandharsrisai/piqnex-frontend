import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { ListingForm } from "@/components/listings/ListingForm";
import { FormPageLayout } from "@/components/forms/FormPageLayout";
import { SideGuide } from "@/components/forms/SideGuide";
import { SignupIllustration } from "@/components/auth/SignupIllustration";

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
        subtitle="Got a spare charger, a leftover controller stick, an extra watch strap? List it here - someone out there needs exactly that."
      />
      <FormPageLayout
        form={
          <Card className="rounded-3xl p-5 shadow-pop sm:p-8">
            <ListingForm />
          </Card>
        }
        side={
          <SideGuide
            art={<SignupIllustration className="h-full w-full" />}
            title="Selling in 3 easy steps"
            steps={[
              { title: "Describe the part", text: "Brand, product and the exact part, so buyers can find it." },
              { title: "Add photos and a price", text: "Clear photos get many more replies." },
              { title: "Chat with buyers", text: "Interested buyers message you right inside Piqnex." },
            ]}
            tipsTitle="Tips for a quick sale"
            tips={[
              "Use the exact model name - it's how we match you with buyers.",
              "Mention any scratches or wear honestly.",
              "Set price to 0 if you just want to give it away.",
            ]}
          />
        }
      />
    </div>
  );
}
