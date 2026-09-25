/**
 * Development/sample data.
 *
 * This is NOT real user data - it exists so the homepage and browse page
 * look and feel like a real marketplace while you're building and testing.
 * Every sample record is clearly flagged with `isSample: true`, and the UI
 * shows a small "Sample" badge on these cards so nobody mistakes them for
 * real listings once real users start posting.
 *
 * Once you connect Supabase (see supabase/seed.sql), you can load the same
 * records into the database for a realistic local dev environment, or just
 * let this file power the UI before the database is wired up at all.
 */

import type { ConditionOption } from "./types";

export interface SampleListing {
  id: string;
  imageUrl: string | null;
  category: string;
  brand: string;
  product: string;
  model: string;
  part: string;
  condition: ConditionOption;
  price: number;
  location: string;
  description: string;
  isSample: true;
}

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

export const SAMPLE_LISTINGS: SampleListing[] = [
  {
    id: "sample-1",
    imageUrl: null,
    category: "electronics",
    brand: "Sony",
    product: "WF-1000XM4",
    model: "Standard",
    part: "Right Earbud",
    condition: "Used - Working",
    price: 2500,
    location: "Bengaluru, KA",
    description:
      "Lost my left earbud on a flight. Right one works perfectly, battery health is great. Comes with the original tip size M attached.",
    isSample: true,
  },
  {
    id: "sample-2",
    imageUrl: null,
    category: "laptops",
    brand: "Dell",
    product: "Inspiron 15 5510",
    model: "2021",
    part: "65W Charger",
    condition: "Used - Good",
    price: 900,
    location: "Pune, MH",
    description:
      "Original Dell 65W charger, upgraded to a 90W one so this is spare. Cable has minor wear near the brick but works fine.",
    isSample: true,
  },
  {
    id: "sample-3",
    imageUrl: null,
    category: "cameras",
    brand: "Canon",
    product: "EOS R10",
    model: "Standard",
    part: "Battery (LP-E17)",
    condition: "Like New",
    price: 1500,
    location: "Hyderabad, TS",
    description:
      "Extra LP-E17 battery, bought as backup but rarely used. Holds a full charge, about 40 cycles.",
    isSample: true,
  },
  {
    id: "sample-4",
    imageUrl: null,
    category: "gaming",
    brand: "Sony",
    product: "DualSense Controller",
    model: "PS5",
    part: "Charging Dock Cradle",
    condition: "Used - Working",
    price: 400,
    location: "Chennai, TN",
    description:
      "Single charging cradle from a two-pack docking station. Works with any standard DualSense controller.",
    isSample: true,
  },
  {
    id: "sample-5",
    imageUrl: null,
    category: "wearables",
    brand: "Apple",
    product: "Watch Series 7",
    model: "41mm",
    part: "Magnetic Charging Cable",
    condition: "Used - Good",
    price: 800,
    location: "Mumbai, MH",
    description:
      "Genuine Apple magnetic charger, 1m cable. Selling because I upgraded to the fast-charge puck.",
    isSample: true,
  },
  {
    id: "sample-6",
    imageUrl: null,
    category: "appliances",
    brand: "Philips",
    product: "Air Fryer HD9252",
    model: "Standard",
    part: "Frying Basket Tray",
    condition: "Used - Fair",
    price: 350,
    location: "Delhi, DL",
    description:
      "Spare inner tray, some scratches from use but no warping. Fits the standard HD9252 basket.",
    isSample: true,
  },
  {
    id: "sample-7",
    imageUrl: null,
    category: "furniture",
    brand: "IKEA",
    product: "MARKUS Office Chair",
    model: "Standard",
    part: "Caster Wheel Set (5)",
    condition: "New",
    price: 600,
    location: "Bengaluru, KA",
    description:
      "Bought an extra set of casters when replacing one, never opened the rest of the pack.",
    isSample: true,
  },
  {
    id: "sample-8",
    imageUrl: null,
    category: "electronics",
    brand: "JBL",
    product: "Flip 5",
    model: "Standard",
    part: "USB-C Charging Port Cover",
    condition: "For Parts",
    price: 150,
    location: "Kolkata, WB",
    description:
      "Salvaged the rubber port cover from a speaker that stopped working otherwise. Good condition.",
    isSample: true,
  },
];
