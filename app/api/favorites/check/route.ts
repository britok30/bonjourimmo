import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { favorites } from "@/lib/db/schema";
import { and, eq } from "drizzle-orm";

export async function GET(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ isFavorited: false });
    }

    const { searchParams } = new URL(req.url);
    const listingId = searchParams.get("listingId");

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID required" },
        { status: 400 }
      );
    }

    const favorite = await db
      .select()
      .from(favorites)
      .where(
        and(
          eq(favorites.userId, userId),
          eq(favorites.listingId, parseInt(listingId))
        )
      )
      .limit(1);

    return NextResponse.json({ isFavorited: favorite.length > 0 });
  } catch (error) {
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
