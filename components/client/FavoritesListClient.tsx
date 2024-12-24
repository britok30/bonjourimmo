"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Link } from "@/i18n/routing";
import {
  ArrowLeft,
  ArrowRight,
  Euro,
  Heart,
  BedDouble,
  Ruler,
} from "lucide-react";
import { type Listing } from "@/lib/db/schema";
import favoritesEmpty from "@/public/favorites/empty.jpg";

export interface FavoriteWithListing {
  favorite: {
    id: number;
    userId: string;
    listingId: number;
    createdAt: Date;
  };
  listing: Listing;
}

interface FavoritesListClientProps {
  favorites: FavoriteWithListing[];
}

export default function FavoritesListClient({
  favorites,
}: FavoritesListClientProps) {
  const t = useTranslations("favorites");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-xl font-bold">{t("title")}</h1>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="relative w-32 h-32 mb-4">
              <Image
                src={favoritesEmpty}
                alt="No favorites illustration"
                fill
                className="object-cover rounded-full"
                placeholder="blur"
              />
            </div>

            <p className="text-xl font-semibold mb-2">{t("noFavorites")}</p>
            <p className="text-muted-foreground mb-8">{t("noFavoritesDesc")}</p>
            <Button size="lg" asChild>
              <Link href="/listings">
                {t("browseListing")}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        ) : (
          <div className="max-w-3xl mx-auto space-y-4">
            {favorites.map(({ listing, favorite }) => (
              <div
                key={favorite.id}
                className="flex items-center gap-6 p-4 bg-card rounded-lg border hover:border-primary transition-colors"
              >
                {/* Image */}
                <div className="relative w-48 h-32 rounded-md overflow-hidden shrink-0">
                  <Image
                    src={listing.images?.[0]?.url || "/placeholder.png"}
                    alt={listing.title}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg truncate">
                        {listing.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {listing.address}, {listing.city}
                      </p>
                      <div className="flex items-center gap-4 mt-2">
                        <p className="text-primary font-semibold flex items-center gap-1">
                          <Euro className="h-4 w-4" />
                          {Number(listing.price).toLocaleString()}
                        </p>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-muted-foreground">
                          {listing.bedrooms} {t("bedrooms")}
                        </p>
                        <span className="text-muted-foreground">•</span>
                        <p className="text-muted-foreground">
                          {listing.livingArea}m²
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2">
                  <FavoriteButton
                    listingId={listing.id}
                    initialFavorited={true}
                  />
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/listings/${listing.slug}`}>
                      {t("viewDetails")}
                    </Link>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
