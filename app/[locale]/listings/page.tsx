import { db } from "@/lib/db";
import { listings, userSubscriptions } from "@/lib/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { SidebarProvider } from "@/components/ui/sidebar";
import ListingsClient from "@/components/client/ListingsClient";

export default async function ListingsPage() {
  try {
    // Fetch listings with subscription and prioritization logic
    const allListings = await db
      .select({
        listing: listings,
        stripeRole: userSubscriptions.stripeRole,
      })
      .from(listings)
      .leftJoin(
        userSubscriptions,
        eq(listings.userId, userSubscriptions.userId)
      )
      .where(eq(listings.status, "active")) // Only active listings
      .orderBy(
        sql`CASE 
          WHEN ${userSubscriptions.stripeRole} = 'premium' THEN 1
          WHEN ${userSubscriptions.stripeRole} = 'plus' THEN 2
          ELSE 3 
        END`,
        sql`${listings.createdAt} DESC` // Secondary sort by creation date
      );

    // Extract only listing data for the client component
    const transformedListings = allListings.map(({ listing }) => ({
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
