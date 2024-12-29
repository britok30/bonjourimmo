import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CreateListingClient from "../../../components/client/CreateListingClient";

export default async function CreateListingPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  return <CreateListingClient />;
}
