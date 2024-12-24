import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { favorites } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { listingId } = await req.json();

    // Check if already favorited
    const existing = await db
      .select()
      .from(favorites)
      .where(
        and(eq(favorites.userId, userId), eq(favorites.listingId, listingId))
      );

    if (existing.length > 0) {
      // Delete if already favorited
      await db
        .delete(favorites)
        .where(
          and(eq(favorites.userId, userId), eq(favorites.listingId, listingId))
        );

      return NextResponse.json({ favorited: false });
    }

    // Add new favorite
    await db.insert(favorites).values({
      userId,
      listingId,
    });

    return NextResponse.json({ favorited: true });
  } catch (error) {
    console.error("Error toggling favorite:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
