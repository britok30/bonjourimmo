import { stripe } from "../../../lib/stripe";
import { NextResponse } from "next/server";
import { inDevEnvironment } from "../../../lib/utils";
import { auth } from "@clerk/nextjs/server";
import { getSubscription } from "@/lib/subscription";

const url = inDevEnvironment
  ? "http://localhost:3000"
  : "https://www.bonjourimmo.com";

export async function POST(req: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return new NextResponse("unauthorized", { status: 401 });
    }

    const userSubscription = await getSubscription();

    if (!userSubscription?.stripeCustomerId) {
      return new NextResponse("No active subscription found", { status: 400 });
    }

    // trying to cancel at billing portal
    const stripeSession = await stripe.billingPortal.sessions.create({
      customer: userSubscription?.stripeCustomerId,
      return_url: `${url}/dashboard`,
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (e) {
    console.log("Stripe billing portal error", e);
    return new NextResponse(`Internal server error: ${e}`, { status: 500 });
  }
}
