import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { userSubscriptions } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { getPlanFromPriceId } from "@/lib/config";

export async function POST(req: Request) {
  const body = await req.text();
  const headersList = await headers();
  const signature = headersList.get("Stripe-Signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    return new NextResponse(`Webhook Error: ${error.message}`, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object;

        if (!session?.metadata?.userId) {
          return new NextResponse("No userId in metadata", { status: 400 });
        }

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        // Insert or update subscription
        await db
          .insert(userSubscriptions)
          .values({
            userId: session.metadata.userId,
            userEmail: session.customer_email!,
            stripeCustomerId: subscription.customer as string,
            stripeSubscriptionId: subscription.id,
            stripePriceId: subscription.items.data[0].price.id,
            stripeRole: session.metadata.plan || "free",
            stripeStatus: subscription.status,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          })
          .onConflictDoUpdate({
            target: userSubscriptions.userId,
            set: {
              stripeSubscriptionId: subscription.id,
              stripePriceId: subscription.items.data[0].price.id,
              stripeRole: session.metadata.plan || "free",
              stripeStatus: subscription.status,
              stripeCurrentPeriodEnd: new Date(
                subscription.current_period_end * 1000
              ),
            },
          });
        break;
      }

      case "customer.subscription.updated": {
        const subscription = event.data.object;

        if (!subscription?.id) {
          return new NextResponse("No subscription ID", { status: 400 });
        }

        const newPlan = getPlanFromPriceId(subscription.items.data[0].price.id);

        await db
          .update(userSubscriptions)
          .set({
            stripePriceId: subscription.items.data[0].price.id,
            stripeRole: newPlan,
            stripeStatus: subscription.status,
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          })
          .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id));
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object;

        if (!subscription?.id) {
          return new NextResponse("No subscription ID", { status: 400 });
        }

        await db
          .update(userSubscriptions)
          .set({
            stripeStatus: "canceled",
            stripeRole: "free",
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
            stripeSubscriptionId: null, // Clear the subscription ID
          })
          .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id));
        break;
      }

      case "invoice.payment_failed": {
        const session = event.data.object;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await db
          .update(userSubscriptions)
          .set({
            stripeStatus: "past_due",
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          })
          .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id));
        break;
      }

      case "invoice.payment_succeeded": {
        const session = event.data.object;

        const subscription = await stripe.subscriptions.retrieve(
          session.subscription as string
        );

        await db
          .update(userSubscriptions)
          .set({
            stripeStatus: "active",
            stripeCurrentPeriodEnd: new Date(
              subscription.current_period_end * 1000
            ),
          })
          .where(eq(userSubscriptions.stripeSubscriptionId, subscription.id));
        break; // Add missing break statement
      }
    }

    return new NextResponse(null, { status: 200 });
  } catch (error) {
    console.error("Webhook error:", error);
    return new NextResponse(
      "Webhook handler failed. View your nextjs console for more details.",
      { status: 500 }
    );
  }
}
