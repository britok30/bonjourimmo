import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_API_KEY as string, {
  typescript: true,
  apiVersion: "2024-12-18.acacia",
});
