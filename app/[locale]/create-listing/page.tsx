import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getSubscription, getUserTier } from "@/lib/subscription";
import CreateListingClient from "../../../components/client/CreateListingClient";

export default async function CreateListingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  // Get user's subscription tier
  const subscriptionTier = await getUserTier();

  return <CreateListingClient subscriptionTier={subscriptionTier} />;
}
