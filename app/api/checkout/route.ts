import { NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { stripe } from "@/lib/stripe";
import { inDevEnvironment } from "@/lib/utils";
import { STRIPE_PLANS } from "@/lib/config";

export async function POST(req: Request) {
  try {
    // Authenticate user
    const { userId } = await auth();
    const user = await currentUser();
    if (!userId || !user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Parse request body
    const { listingId, selectedPlan, locale } = await req.json();

    if (!listingId || !selectedPlan) {
      return new NextResponse("Missing required parameters", { status: 400 });
    }

    const planConfig = STRIPE_PLANS[selectedPlan];
    if (!planConfig) {
      return new NextResponse("Invalid plan selected", { status: 400 });
    }

    const baseUrl = inDevEnvironment
      ? "http://localhost:3000"
      : "https://www.bonjourimmo.com";

    // Create Stripe checkout session for the selected plan
    const session = await stripe.checkout.sessions.create({
      success_url: `${baseUrl}/success?listingId=${listingId}&plan=${selectedPlan}`,
      cancel_url: `${baseUrl}/create-listing?listingId=${listingId}`,
      payment_method_types: ["card"],
      mode: "payment",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      locale: locale,
      line_items: [
        {
          price: planConfig.price_id[inDevEnvironment ? "test" : "production"],
          quantity: 1,
        },
      ],
      metadata: {
        listingId,
        userId,
        selectedPlan,
      },
    });

    // Return session URL
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return new NextResponse("Failed to create checkout session", {
      status: 500,
    });
  }
}
