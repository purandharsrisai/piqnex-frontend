import { ListingCard, type ListingCardData } from "./ListingCard";
import { SaveButton } from "./SaveButton";

/** Pass `savedIds` (even an empty array) when the viewer is signed in to show the save heart on each card. */
export function ListingGrid({ listings, savedIds }: { listings: ListingCardData[]; savedIds?: string[] }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-4">
      {listings.map((listing) => (
        <div key={listing.id} className="relative">
          <ListingCard listing={listing} />
          {savedIds && !listing.isSample && (
            <SaveButton
              listingId={listing.id}
              initialSaved={savedIds.includes(listing.id)}
              className="absolute right-3 top-3"
            />
          )}
        </div>
      ))}
    </div>
  );
}
