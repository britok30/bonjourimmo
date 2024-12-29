import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { ADMIN_EMAIL } from "@/lib/utils";
import { deleteFileFromS3 } from "@/lib/s3";

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

    // Fetch the listing and its images
    const listing = await db
      .select({ images: listings.images })
      .from(listings)
      .where(eq(listings.id, parseInt(id)))
      .limit(1);

    if (listing.length === 0) {
      return new NextResponse("Listing not found", { status: 404 });
    }

    const imageFileKeys = listing[0]?.images?.map((image) => image.key) || [];

    // Delete images from S3
    for (const fileKey of imageFileKeys) {
      try {
        await deleteFileFromS3(fileKey);
      } catch (error) {
        console.error(`Failed to delete file ${fileKey} from S3`, error);
      }
    }

    // Delete the listing from the database
    await db.delete(listings).where(eq(listings.id, parseInt(id)));

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Error deleting listing:", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
