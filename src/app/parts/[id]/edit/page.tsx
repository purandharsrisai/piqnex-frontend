import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { EditListingForm } from "@/components/listings/EditListingForm";
import { getCurrentUser } from "@/lib/api-client";
import { getListingDetail } from "@/lib/listings";

export const metadata: Metadata = { title: "Edit listing" };
export const dynamic = "force-dynamic";

export default async function EditListingPage({ params }: { params: { id: string } }) {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?redirectTo=${encodeURIComponent(`/parts/${params.id}/edit`)}`);

  const listing = await getListingDetail(params.id);
  if (!listing || listing.isSample || listing.sellerId !== user.id) notFound();

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href={`/parts/${listing.id}`}
        className="mb-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold text-ink-600 hover:bg-ink-100"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to listing
      </Link>
      <h1 className="mb-6 font-display text-3xl text-ink-900">Edit listing</h1>
      <Card className="rounded-3xl p-5 shadow-pop sm:p-8">
        <EditListingForm listing={listing} />
      </Card>
    </div>
  );
}
