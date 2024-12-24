import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ADMIN_EMAIL } from "@/lib/utils";

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Check if user is admin
    if (user.emailAddresses[0].emailAddress !== ADMIN_EMAIL) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Delete the listing
    await db.delete(listings).where(eq(listings.id, parseInt(id)));

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
