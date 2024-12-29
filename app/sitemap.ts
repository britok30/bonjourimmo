import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";

const baseUrl = "https://www.bonjourimmo.com";
const languages = ["en", "fr"];

export default async function sitemap() {
  const allListings = await db.select().from(listings);

  // Static routes
  const routes = ["/listings", "/terms"];

  const baseRoute = languages.map((lang) => ({
    url: `${baseUrl}/${lang}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 1,
  }));

  // Create entries for static routes in each language
  const staticRoutes = routes.flatMap((route) =>
    languages.map((lang) => ({
      url: `${baseUrl}/${lang}${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: route === "" ? 1 : 0.8,
    }))
  );

  // Create entries for listing detail pages in each language
  const listingRoutes = allListings.flatMap((listing) =>
    languages.map((lang) => ({
      url: `${baseUrl}/${lang}/listings/${listing.slug}`,
      lastModified: listing.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.9,
    }))
  );

  const authRoutes = ["/sign-in", "/sign-up"].flatMap((route) =>
    languages.map((lang) => ({
      url: `${baseUrl}/${lang}/listings/${route}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.9,
    }))
  );

  return [...baseRoute, ...staticRoutes, ...listingRoutes, ...authRoutes];
}
