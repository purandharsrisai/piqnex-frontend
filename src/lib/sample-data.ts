/**
 * Category list used by the home page grid and the category dropdowns.
 * (There is no fake listing data in the app any more - only real listings
 * from real users are shown.)
 */
export interface SampleCategory {
  slug: string;
  name: string;
  icon: string; // lucide-react icon name, resolved in the CategoryGrid component
}

export const SAMPLE_CATEGORIES: SampleCategory[] = [
  { slug: "electronics", name: "Electronics", icon: "Headphones" },
  { slug: "laptops", name: "Laptops", icon: "Laptop" },
  { slug: "gaming", name: "Gaming", icon: "Gamepad2" },
  { slug: "wearables", name: "Wearables", icon: "Watch" },
  { slug: "cameras", name: "Cameras", icon: "Camera" },
  { slug: "appliances", name: "Appliances", icon: "Microwave" },
  { slug: "furniture", name: "Furniture", icon: "Armchair" },
  { slug: "automotive", name: "Automotive", icon: "Car" },
  { slug: "other", name: "Other", icon: "Puzzle" },
];
