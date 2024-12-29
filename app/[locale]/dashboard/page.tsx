import { currentUser } from "@clerk/nextjs/server";
import DashboardClient from "../../../components/client/DashboardClient";

export default async function DashboardPage() {
  const user = await currentUser();

  if (!user) return null;

  return <DashboardClient />;
}
