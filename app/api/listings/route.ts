// app/api/listings/route.ts
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { listings } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { generateSlug } from "@/lib/utils";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const data = await req.json();
    const uniqueId = randomUUID();
    const slug = generateSlug(data.title, uniqueId);

    // Create the listing
    const [newListing] = await db
      .insert(listings)
      .values({
        ...data,
        slug,
        userId,
        status: "active",
      })
      .returning();

    return NextResponse.json(
      {
        message: "Listing created successfully",
        listing: { ...newListing },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating listing:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
