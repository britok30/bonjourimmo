import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { listings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Stripe signature verification failed:", error.message);
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        const { listingId, selectedPlan } = session.metadata as any;
        if (!listingId || !selectedPlan) {
          return new NextResponse("Missing required metadata", { status: 400 });
        }

        // Determine priority based on the plan
        const planPriorityMap: Record<string, number> = {
          premium: 3,
          plus: 2,
          basic: 1,
        };

        const listingPriority = planPriorityMap[selectedPlan] || 1;

        // Update the listing to active with the correct plan and priority
        await db
          .update(listings)
          .set({
            status: "active",
            listingPlan: selectedPlan,
            listingPriority,
          })
          .where(eq(listings.id, listingId));

        console.log(
          `Listing ${listingId} activated under the ${selectedPlan} plan with priority ${listingPriority}.`
        );
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
        break;
    }

    return new NextResponse("Webhook processed successfully", { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse(
      "Webhook handler failed. Check server logs for details.",
      { status: 500 }
    );
  }
}
