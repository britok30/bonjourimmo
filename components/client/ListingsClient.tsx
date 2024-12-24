"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Search,
  Loader2,
  Home,
  X,
  LayoutGrid,
  MapIcon,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import { Listing } from "@/lib/db/schema";
import { FavoriteButton } from "@/components/FavoriteButton";
import { Badge } from "@/components/ui/badge";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Filters, ListingsFilters } from "@/components/ListingsFilter";
import ListingsMap from "../ListingsMap";
import { useUser } from "@clerk/nextjs";
import { ADMIN_EMAIL } from "@/lib/utils";
import { DeleteButton } from "../DeleteButton";
import listingsEmpty from "@/public/listings/empty.jpg";

interface ListingsClientProps {
  initialListings: Listing[];
}

export default function ListingsClient({
  initialListings,
}: ListingsClientProps) {
  const t = useTranslations("listings");
  const [listings] = useState<Listing[]>(initialListings);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState<Filters>({
    search: "",
    propertyType: [],
    listingType: [],
    priceRange: { min: "", max: "" },
    bedrooms: "",
    bathrooms: "",
    livingAreaRange: { min: "", max: "" },
    condition: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const { user } = useUser();
  const isAdmin = user?.primaryEmailAddress?.emailAddress === ADMIN_EMAIL;

  const filteredListings = listings.filter((listing) => {
    const matchesSearch =
      filters.search === "" ||
      listing.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      listing.address.toLowerCase().includes(filters.search.toLowerCase()) ||
      listing.city.toLowerCase().includes(filters.search.toLowerCase());

    const matchesPropertyType =
      filters.propertyType.length === 0 ||
      filters.propertyType.includes(listing.propertyType);

    const matchesListingType =
      filters.listingType.length === 0 ||
      filters.listingType.includes(listing.listingType);

    const matchesPriceRange =
      (filters.priceRange.min === "" ||
        Number(listing.price) >= Number(filters.priceRange.min)) &&
      (filters.priceRange.max === "" ||
        Number(listing.price) <= Number(filters.priceRange.max));

    const matchesBedrooms =
      filters.bedrooms === "" ||
      (filters.bedrooms === "5+"
        ? listing.bedrooms! >= 5
        : listing.bedrooms === filters.bedrooms);

    const matchesBathrooms =
      filters.bathrooms === "" ||
      (filters.bathrooms === "4+"
        ? listing.bathrooms! >= 4
        : listing.bathrooms === filters.bathrooms);

    const matchesLivingArea =
      (filters.livingAreaRange.min === "" ||
        listing.livingArea >= filters.livingAreaRange.min) &&
      (filters.livingAreaRange.max === "" ||
        listing.livingArea <= filters.livingAreaRange.max);

    const matchesCondition =
      filters.condition === "" || filters.condition === listing.condition;

    return (
      matchesSearch &&
      matchesPropertyType &&
      matchesListingType &&
      matchesPriceRange &&
      matchesBedrooms &&
      matchesBathrooms &&
      matchesLivingArea &&
      matchesCondition
    );
  });

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setFilters((prev) => ({ ...prev, search: searchValue }));
      setIsLoading(false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  return (
    <>
      <ListingsFilters
        filters={filters}
        onFiltersChange={setFilters}
        totalListings={filteredListings.length}
        t={t}
      />
      <main className="flex-1 px-8">
        <div className="container mx-auto py-8 px-4">
          {/* Header */}
          <div className="flex items-center gap-4 mb-8">
            <SidebarTrigger />
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <h1 className="text-3xl font-bold flex-1">{t("title")}</h1>

            {/* View Toggle */}
            <div className="flex gap-2 bg-muted p-1 rounded-md">
              <Button
                size="sm"
                variant={viewMode === "grid" ? "default" : "ghost"}
                onClick={() => setViewMode("grid")}
              >
                <LayoutGrid className="h-4 w-4 mr-2" />
                {t("grid")}
              </Button>
              <Button
                size="sm"
                variant={viewMode === "map" ? "default" : "ghost"}
                onClick={() => setViewMode("map")}
              >
                <MapIcon className="h-4 w-4 mr-2" />
                {t("map")}
              </Button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-xl mx-auto mb-8">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              className="pl-9"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            {searchValue && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute right-2 top-1 h-8 w-8 p-0"
                onClick={() => setSearchValue("")}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* Listings */}
          {filteredListings.length === 0 && !isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="relative w-32 h-32 mb-4">
                <Image
                  src={listingsEmpty}
                  alt="No listings illustration"
                  fill
                  className="object-cover rounded-full"
                  placeholder="blur"
                />
              </div>

              <p className="text-xl font-semibold mb-2">{t("noListings")}</p>
              <Button asChild>
                <Link href="/create-listing">{t("createFirstListing")}</Link>
              </Button>
            </div>
          ) : isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, index) => (
                <div
                  key={index}
                  className="bg-muted h-48 rounded-md animate-pulse"
                />
              ))}
            </div>
          ) : viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredListings.map((listing) => (
                <Card
                  key={listing.id}
                  className="group overflow-hidden rounded-lg"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={listing.images?.[0]?.url || "/placeholder.png"}
                      alt={listing.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/50 transition" />
                    <div className="absolute top-2 left-2 flex items-center gap-2 z-10">
                      <FavoriteButton listingId={listing.id} />
                      {isAdmin && <DeleteButton listingId={listing.id} />}
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <h2 className="font-semibold text-lg">{listing.title}</h2>
                    <p className="text-muted-foreground text-sm">
                      {listing.address}, {listing.city}
                    </p>
                    <div className="flex justify-between items-center mt-4">
                      <span className="font-bold">
                        €{Number(listing.price).toLocaleString()}
                      </span>
                      <Button variant="outline" asChild>
                        <Link href={`/listings/${listing.slug}`}>
                          {t("view")}
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <ListingsMap listings={filteredListings} />
          )}
        </div>
      </main>
    </>
  );
}
