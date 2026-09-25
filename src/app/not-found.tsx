import { LinkButton } from "@/components/ui/Button";
import { PuzzleIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <PuzzleIcon className="h-10 w-10 text-clay-500" aria-hidden="true" />
      <h1 className="font-display text-2xl text-ink-900">This piece is missing</h1>
      <p className="text-ink-500">
        We couldn&rsquo;t find the page you were looking for. It may have moved,
        or the listing may no longer be available.
      </p>
      <LinkButton href="/" size="md">
        Back to Homepage
      </LinkButton>
    </div>
  );
}
