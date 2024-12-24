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

    // Get plan from request
    const { plan } = await req.json();
    const planConfig = STRIPE_PLANS[plan as keyof typeof STRIPE_PLANS];

    if (!planConfig) {
      return new NextResponse("Invalid plan", { status: 400 });
    }

    const url = inDevEnvironment
      ? "http://localhost:3000"
      : "https://www.bonjourimmo.com";

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      success_url: `${url}/success?type=${plan}`,
      cancel_url: `${url}/pricing`,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.emailAddresses[0].emailAddress,
      line_items: [
        {
          price: planConfig.price_id[inDevEnvironment ? "test" : "production"],
          quantity: 1,
        },
      ],
      metadata: {
        userId,
        plan,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error("Stripe error:", error);
    return new NextResponse("Failed to create checkout session", {
      status: 500,
    });
  }
}
