import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";
import { ensureUserExists } from "@/lib/db/helper";
import { inDevEnvironment } from "@/lib/utils";
import { getUserTier } from "@/lib/subscription";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const rateLimiters = {
  free: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(inDevEnvironment ? 10000 : 1, "365 d"), // 1 listing
    prefix: "@upstash/ratelimit/free",
  }),
  plus: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(10, "30 d"), // 10 listings per month
    prefix: "@upstash/ratelimit/plus",
  }),
  premium: new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(25, "30 d"), // 25 listings per month
    prefix: "@upstash/ratelimit/premium",
  }),
};

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();
    const email = user?.emailAddresses[0].emailAddress;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!email) {
      return NextResponse.json({ error: "Email not found" }, { status: 404 });
    }

    const isUserAvailable = await ensureUserExists(userId, email);

    if (!isUserAvailable) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const subscriptionPlan = await getUserTier();

    // Check rate limit for free and plus users
    const rateLimiter = rateLimiters[subscriptionPlan];
    const { success, reset, remaining } = await rateLimiter.limit(userId);

    console.log("Rate limit check:", { success, reset, remaining });

    if (!success) {
      return NextResponse.json(
        {
          error: "Rate limit reached",
          message: "You've reached your listing limit for this month",
          resetAt: reset,
          remaining,
        },
        { status: 429 }
      );
    }

    return NextResponse.json({
      success: true,
      remaining,
    });
  } catch (error) {
    console.error("Error checking rate limit:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
