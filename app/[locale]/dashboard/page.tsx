import { currentUser } from "@clerk/nextjs/server";
import DashboardClient from "../../../components/client/DashboardClient";
import { getUserTier } from "@/lib/subscription";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) return null;

  const subscriptionTier = await getUserTier();

  return <DashboardClient subscriptionTier={subscriptionTier} />;
}
