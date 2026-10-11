import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Plus } from "lucide-react";
import { getCurrentUser } from "@/lib/api-client";
import { getMyNeedRequests } from "@/lib/profile-data";
import { PageHeader } from "@/components/ui/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/States";
import { MyNeedRequestItem } from "@/components/profile/MyNeedRequestItem";

export const metadata: Metadata = { title: "My Requests" };

export default async function MyRequestsPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirectTo=/my-requests");

  const requests = await getMyNeedRequests();

  return (
    <div>
      <PageHeader eyebrow="Account" title="My requests" subtitle="Parts you're looking for. We'll email you when a match is listed.">
        <LinkButton href="/need" size="md" variant="primary">
          <Plus className="h-4 w-4" aria-hidden="true" /> New request
        </LinkButton>
      </PageHeader>
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        {requests.length > 0 ? (
          <div className="flex flex-col gap-3">
            {requests.map((r) => (
              <MyNeedRequestItem key={r.id} request={r} />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No requests yet"
            description="Search for a missing part and save a request if nobody has it listed yet."
            actionHref="/need"
            actionLabel="Find a part"
          />
        )}
      </div>
    </div>
  );
}
