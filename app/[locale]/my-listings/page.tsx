import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import MyListingsClient from "@/components/client/MyListingsClient";
import { getUserTier } from "@/lib/subscription";

export default async function MyListingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const userListings = await db
    .select()
    .from(listings)
    .where(eq(listings.userId, userId))
    .orderBy(desc(listings.createdAt));

  const subscriptionTier = await getUserTier();

  return (
    <MyListingsClient
      listings={userListings}
      subscriptionTier={subscriptionTier}
    />
  );
}
