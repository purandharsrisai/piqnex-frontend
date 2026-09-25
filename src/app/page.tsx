import { Hero } from "@/components/home/Hero";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { HowItWorks } from "@/components/home/HowItWorks";
import { FeaturedListings } from "@/components/home/FeaturedListings";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <HowItWorks />
      <FeaturedListings />
    </>
  );
}
