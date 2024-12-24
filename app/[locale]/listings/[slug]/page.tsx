import ListingDetailsClient from "@/components/client/ListingDetailsClient";
import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

// Server Component
export default async function ListingDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const listing = await db
    .select()
    .from(listings)
    .where(eq(listings.slug, slug))
    .limit(1)
    .then((rows) => rows[0]);

  if (!listing) {
    notFound();
  }

  return <ListingDetailsClient listing={listing} />;
}
