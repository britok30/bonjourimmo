import { db } from "@/lib/db";
import { favorites, listings } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { eq, and } from "drizzle-orm";
import FavoritesListClient, {
  FavoriteWithListing,
} from "@/components/client/FavoritesListClient";

export default async function FavoritesPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const userFavorites = await db
    .select({
      favorite: favorites,
      listing: listings,
    })
    .from(favorites)
    .innerJoin(
      listings,
      and(eq(favorites.listingId, listings.id), eq(listings.status, "active"))
    )
    .where(eq(favorites.userId, userId));

  return (
    <FavoritesListClient favorites={userFavorites as FavoriteWithListing[]} />
  );
}
