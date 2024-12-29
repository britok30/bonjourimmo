import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { eq, sql } from "drizzle-orm";
import { SidebarProvider } from "@/components/ui/sidebar";
import ListingsClient from "@/components/client/ListingsClient";

export default async function ListingsPage() {
  try {
    // Fetch listings ordered by plan (Premium > Plus > Basic) and creation date
    const allListings = await db
      .select()
      .from(listings)
      .where(eq(listings.status, "active")) // Only active listings
      .orderBy(
        sql`CASE 
          WHEN ${listings.listingPlan} = 'premium' THEN 3
          WHEN ${listings.listingPlan} = 'plus' THEN 2
          WHEN ${listings.listingPlan} = 'basic' THEN 1
          ELSE 0 
        END DESC`, // Primary sort: Premium > Plus > Basic
        sql`${listings.createdAt} DESC` // Secondary sort by creation date
      );

    // Transform the results for the client component
    const transformedListings = allListings.map((listing) => ({
      ...listing,
    }));

    return (
      <SidebarProvider>
        <ListingsClient initialListings={transformedListings} />
      </SidebarProvider>
    );
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw new Error("Unable to fetch listings. Please try again later.");
  }
}
