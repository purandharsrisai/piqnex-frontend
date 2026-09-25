import { ListingCard, type ListingCardData } from "./ListingCard";

export function ListingGrid({ listings }: { listings: ListingCardData[] }) {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
      {listings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}
