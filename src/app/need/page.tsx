import type { Metadata } from "next";
import { NeedSearchForm } from "@/components/need/NeedSearchForm";
import { CreateNeedRequestForm } from "@/components/need/CreateNeedRequestForm";
import { ListingGrid } from "@/components/listings/ListingGrid";
import { NoMatchState } from "@/components/ui/States";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card } from "@/components/ui/Card";
import { getNeedMatches } from "@/lib/listings";

export const metadata: Metadata = {
  title: "I Need a Part",
  description: "Tell us what you have and what's missing - we'll find a matching part for you.",
};

function param(searchParams: Record<string, string | string[] | undefined>, key: string) {
  const value = searchParams[key];
  return (Array.isArray(value) ? value[0] : value)?.trim() || "";
}

export default async function NeedPage({
  searchParams,
}: {
  searchParams: Record<string, string | string[] | undefined>;
}) {
  const category = param(searchParams, "category");
  const brand = param(searchParams, "brand");
  const product = param(searchParams, "product");
  const model = param(searchParams, "model");
  const part = param(searchParams, "part");
  const description = param(searchParams, "description");
  const location = param(searchParams, "location");

  const hasSearched = Boolean(brand && product && part);
  const results = hasSearched ? await getNeedMatches({ brand, product, model, part }) : null;

  return (
    <div>
      <PageHeader
        eyebrow="I need a part"
        title="Tell us what's missing"
        subtitle="Tell us exactly what you have and what's missing. We'll look for a seller with the same brand, product, model, and part."
      />
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
      <Card className="rounded-3xl p-5 shadow-pop sm:p-8">
        <NeedSearchForm defaults={{ category, brand, product, model, part, description, location }} />
      </Card>

      {hasSearched && results && (
        <div className="mt-10">
          {results.matches.length > 0 ? (
            <>
              <div className="mb-4 flex items-center gap-2">
                <h2 className="font-display text-xl text-ink-900">
                  {results.matches.length} matching {results.matches.length === 1 ? "part" : "parts"} found
                </h2>
              </div>
              <ListingGrid listings={results.matches} />
            </>
          ) : (
            <>
              <NoMatchState
                title="No exact match found yet"
                description="Nobody has listed this exact part right now. Save a need request and we'll email you as soon as someone lists a matching part."
              />
              <div className="mt-6 flex justify-center">
                <CreateNeedRequestForm
                  category={category}
                  brand={brand}
                  product={product}
                  model={model}
                  part={part}
                  description={description}
                  location={location}
                />
              </div>
            </>
          )}
        </div>
      )}
      </div>
    </div>
  );
}
