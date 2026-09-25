import type { MetadataRoute } from "next";

// Static routes for now. Once listings are live in production, extend this
// to also fetch active listing ids from Supabase and include /parts/[id].
export default function sitemap(): MetadataRoute.Sitemap {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const staticRoutes = ["", "/browse", "/need", "/sell", "/how-it-works", "/login", "/signup"];

  return staticRoutes.map((route) => ({
    url: `${siteUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: route === "" ? 1 : 0.7,
  }));
}
