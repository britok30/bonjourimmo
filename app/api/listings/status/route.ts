import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@clerk/nextjs/server";

const validStatuses = ["active", "sold", "rented", "inactive"] as const;

export async function PUT(req: Request) {
  try {
    // Ensure the user is authenticated
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "User not authenticated" },
        { status: 401 }
      );
    }

    const { status, listingId } = await req.json();

    if (!listingId) {
      return NextResponse.json(
        { error: "Listing ID required" },
        { status: 400 }
      );
    }

    if (!status) {
      return NextResponse.json(
        { error: "Status is required" },
        { status: 400 }
      );
    }

    // Update the listing status in the database
    await db
      .update(listings)
      .set({ status })
      .where(eq(listings.id, Number(listingId)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
