import { LinkButton } from "@/components/ui/Button";
import { PuzzleIcon } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-4 px-4 py-24 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-full bg-clay-100 text-clay-600"><PuzzleIcon className="h-8 w-8" aria-hidden="true" /></span>
      <h1 className="font-display text-3xl text-ink-900">This piece is missing</h1>
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
