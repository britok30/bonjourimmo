import { auth } from "@clerk/nextjs/server";
import { db } from "./db";
import { userSubscriptions } from "./db/schema";
import { eq } from "drizzle-orm";

export const getSubscription = async () => {
  const { userId } = await auth();
  if (!userId) return null;

  const _userSubscriptions = await db
    .select()
    .from(userSubscriptions)
    .where(eq(userSubscriptions.userId, userId));

  return _userSubscriptions[0];
};

export const getUserTier = async () => {
  const subscription = await getSubscription();

  if (!subscription) return "free";

  switch (subscription.stripeRole) {
    case "plus":
      return "plus";
    case "premium":
      return "premium";
    default:
      return "free";
  }
};

export const checkSubscription = async () => {
  const subscription = await getSubscription();

  if (!subscription) {
    return {
      isValid: false,
      tier: "free" as const,
    };
  }

  // Check if subscription is active and not expired
  const isValid =
    subscription.stripeStatus === "active" &&
    subscription.stripeCurrentPeriodEnd?.getTime()! > Date.now();

  return {
    isValid,
    tier: isValid ? subscription.stripeRole : "free",
  };
};
