import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function ensureUserExists(userId: string, email: string) {
  try {
    // Try to find the user first
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.id, userId))
      .limit(1);

    // If user exists, return them
    if (existingUser.length > 0) {
      return existingUser[0];
    }

    // If user doesn't exist, create and return them
    const newUser = await db
      .insert(users)
      .values({
        id: userId,
        email,
      })
      .returning();

    return newUser[0];
  } catch (error) {
    console.error("Error in ensureUserExists:", error);
    throw new Error("Failed to ensure user exists");
  }
}
