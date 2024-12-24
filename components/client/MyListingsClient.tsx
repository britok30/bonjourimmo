"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { ArrowLeft, Plus } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DeleteButton } from "@/components/DeleteButton";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Listing } from "@/lib/db/schema";
import listingEmpty from "@/public/my-listings/empty.jpg";
import { toast } from "@/hooks/use-toast";
import { Label } from "../ui/label";

export default function MyListingsClient({
  listings,
  subscriptionTier,
}: {
  listings: Listing[];
  subscriptionTier: "free" | "plus" | "premium";
}) {
  const t = useTranslations("myListings");

  const [listingsState, setListingsState] = useState(listings);
  const [loadingListingId, setLoadingListingId] = useState<number | null>(null);

  const updateListingStatus = async (
    listingId: number,
    newStatus: "active" | "sold" | "rented" | "inactive"
  ) => {
    setLoadingListingId(listingId);
    try {
      const response = await fetch(`/api/listings/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: newStatus, listingId: listingId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || "Failed to update listing status.");
      }

      setListingsState((prev) =>
        prev.map((listing) =>
          listing.id === listingId ? { ...listing, status: newStatus } : listing
        )
      );

      toast({
        description: t("statusUpdated"),
      });
    } catch (error: any) {
      console.error("Error updating listing status:", error);
      toast({
        variant: "destructive",
        description: error.message || t("statusUpdateError"),
      });
    } finally {
      setLoadingListingId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-xl font-bold">{t("title")}</h1>
          </div>
          <Button asChild>
            <Link href="/create-listing">
              <Plus className="w-4 h-4 mr-2" />
              {t("createNew")}
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4">
        {/* Empty State or Listings Grid */}
        {listingsState.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="relative w-32 h-32 mb-4">
              <Image
                src={listingEmpty}
                alt="No listings illustration"
                fill
                className="object-cover rounded-full"
                placeholder="blur"
              />
            </div>

            <p className="text-2xl font-semibold mb-2">{t("noListings")}</p>
            <p className="text-muted-foreground text-center mb-6">
              {t("noListingsDescription")}
            </p>
            <Button asChild>
              <Link href="/create-listing">
                <Plus className="w-4 h-4 mr-2" />
                {t("createFirst")}
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listingsState.map((listing) => (
              <Card
                key={listing.id}
                className="group overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative h-48">
                  <Image
                    src={listing.images?.[0]?.url || "/placeholder.png"}
                    alt={listing.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <CardContent className="p-4">
                  <h2 className="font-semibold text-lg mb-2 truncate">
                    {listing.title}
                  </h2>
                  <p className="text-muted-foreground text-sm mb-2 truncate">
                    {listing.address}, {listing.city}
                  </p>
                  <div className="flex flex-col gap-4">
                    {(subscriptionTier === "premium" ||
                      subscriptionTier === "plus") && (
                      <div>
                        <Label className="mb-3 inline-block">
                          {t("status")}
                        </Label>

                        <Select
                          value={listing.status}
                          onValueChange={(value) =>
                            updateListingStatus(listing.id, value as any)
                          }
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {(listing.listingType === "sale"
                              ? ["active", "sold", "inactive"]
                              : ["active", "rented", "inactive"]
                            ).map((status) => (
                              <SelectItem key={status} value={status}>
                                {t(`statuses.${status}`)}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/listings/${listing.slug}`}>
                        {t("view")}
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
