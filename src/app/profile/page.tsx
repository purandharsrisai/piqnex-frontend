import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/api-client";
import { getMyListings, getMyNeedRequests } from "@/lib/profile-data";
import { ProfileView } from "@/components/profile/ProfileView";

export const metadata: Metadata = { title: "My Profile" };

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirectTo=/profile");

  const [listings, needRequests] = await Promise.all([getMyListings(), getMyNeedRequests()]);

  return <ProfileView user={user} listings={listings} needRequests={needRequests} />;
}
