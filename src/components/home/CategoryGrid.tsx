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
import { Reveal } from "@/components/ui/Reveal";

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
    <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <Reveal>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-clay-600">Categories</p>
            <h2 className="mt-2 font-display text-3xl text-ink-900 sm:text-4xl">Shop by category</h2>
          </div>
          <p className="hidden max-w-xs text-right text-ink-500 sm:block">
            Starting with electronics &mdash; more categories are coming.
          </p>
        </div>
      </Reveal>

      <div className="mt-8 grid grid-cols-3 gap-3 sm:grid-cols-5 sm:gap-4 lg:grid-cols-9">
        {SAMPLE_CATEGORIES.map((category, i) => {
          const Icon = ICONS[category.icon] ?? Puzzle;
          return (
            <Reveal key={category.slug} delay={Math.min(i * 0.04, 0.3)} y={14}>
              <Link
                href={`/browse?category=${category.slug}`}
                className="group flex h-full flex-col items-center gap-3 rounded-2xl border border-ink-100 bg-white px-2 py-5 text-center shadow-card transition-all duration-200 hover:-translate-y-1 hover:border-clay-200 hover:shadow-card-hover"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-ink-50 text-ink-700 transition-colors duration-200 group-hover:bg-clay-600 group-hover:text-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-ink-800">{category.name}</span>
              </Link>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}
