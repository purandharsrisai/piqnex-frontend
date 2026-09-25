import Link from "next/link";
import {
  Headphones,
  Laptop,
  Gamepad2,
  Watch,
  Camera,
  Microwave,
  Armchair,
  Car,
  Puzzle,
  type LucideIcon,
} from "lucide-react";
import { SAMPLE_CATEGORIES } from "@/lib/sample-data";

const ICONS: Record<string, LucideIcon> = {
  Headphones,
  Laptop,
  Gamepad2,
  Watch,
  Camera,
  Microwave,
  Armchair,
  Car,
  Puzzle,
};

export function CategoryGrid() {
  return (
    <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <div className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-2xl text-ink-900">Browse by category</h2>
        <p className="hidden text-sm text-ink-500 sm:block">
          Starting with electronics - more are coming.
        </p>
      </div>

      {/* A wrapping row of tags rather than a grid of identical icon
          cards - reads as a set of filters you'd flip through, not a
          feature-grid section. */}
      <div className="mt-5 flex flex-wrap gap-2.5">
        {SAMPLE_CATEGORIES.map((category) => {
          const Icon = ICONS[category.icon] ?? Puzzle;
          return (
            <Link
              key={category.slug}
              href={`/browse?category=${category.slug}`}
              className="group flex items-center gap-2 rounded-full border border-ink-200 bg-white py-2 pl-3 pr-4 text-sm text-ink-700 transition-colors hover:border-clay-300 hover:bg-clay-50 hover:text-clay-800"
            >
              <Icon className="h-4 w-4 text-ink-400 group-hover:text-clay-600" aria-hidden="true" />
              {category.name}
            </Link>
          );
        })}
      </div>
    </section>
  );
}
