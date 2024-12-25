"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import {
  ArrowLeft,
  Bed,
  Bath,
  Square,
  Phone,
  Mail,
  MapPin,
  Euro,
  Car,
  Trees,
  Building2,
  Wind,
  Sofa,
  CircleParking,
  Heater,
  ShieldCheck,
  Grid2X2,
  Sun,
  LandPlot,
  WavesLadder,
  Home,
  Flame,
  Bell,
  AudioLines,
  MoveUp,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import type { CarouselApi } from "@/components/ui/carousel";
import type { Listing } from "@/lib/db/schema";
import { FavoriteButton } from "../FavoriteButton";
import PropertyMap from "../PropertyMap";
import { ShareButton } from "../ShareButton";

export default function ListingDetailsClient({
  listing,
}: {
  listing: Listing;
}) {
  const t = useTranslations("listingDetails");
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  const getAmenityIcon = (amenity: string) => {
    const icons = {
      parking: <CircleParking className="h-4 w-4 text-primary" />,
      garden: <Trees className="h-4 w-4 text-primary" />,
      terrace: <Building2 className="h-4 w-4 text-primary" />,
      elevator: <MoveUp className="h-4 w-4 text-primary" />,
      pool: <WavesLadder className="h-4 w-4 text-primary" />,
      security: <ShieldCheck className="h-4 w-4 text-primary" />,
      cellar: <Home className="h-4 w-4 text-primary" />,
      balcony: <Building2 className="h-4 w-4 text-primary" />,
      garage: <Car className="h-4 w-4 text-primary" />,
      air_conditioning: <Wind className="h-4 w-4 text-primary" />,
      fireplace: <Flame className="h-4 w-4 text-primary" />,
      alarm: <Bell className="h-4 w-4 text-primary" />,
      intercom: <AudioLines className="h-4 w-4 text-primary" />,
      digicode: <Grid2X2 className="h-4 w-4 text-primary" />,
      furnished: <Sofa className="h-4 w-4 text-primary" />,
      handicap_access: <ShieldCheck className="h-4 w-4 text-primary" />,
    };

    return (
      icons[amenity as keyof typeof icons] || (
        <Building2 className="h-4 w-4 text-primary" />
      )
    );
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/listings">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Images Carousel */}
          <div className="relative">
            <Carousel setApi={setApi} className="w-full mb-6">
              <CarouselContent>
                {listing.images?.map((image, index) => (
                  <CarouselItem key={index}>
                    <div className="aspect-[4/3] relative rounded-lg overflow-hidden">
                      <Image
                        src={image.url}
                        alt={`${listing.title} - Image ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="-left-12 bg-background border-2 hover:bg-accent hover:text-accent-foreground" />
              <CarouselNext className="-right-12 bg-background border-2 hover:bg-accent hover:text-accent-foreground" />
              <div className="absolute bottom-4 right-4 bg-black/60 text-white px-2 py-1 rounded text-sm">
                {current + 1} / {listing.images?.length}
              </div>
            </Carousel>

            {listing.latitude && listing.longitude && (
              <div>
                <h2 className="text-xl font-semibold mb-3">{t("location")}</h2>
                <PropertyMap
                  latitude={Number(listing.latitude)}
                  longitude={Number(listing.longitude)}
                  address={listing.address}
                  title={listing.title}
                />
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="space-y-6">
            {/* Top Section */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={
                      listing.listingType === "sale" ? "default" : "secondary"
                    }
                  >
                    {t(`listingType.${listing.listingType}`)}
                  </Badge>
                  <Badge variant="outline">
                    {t(`propertyTypes.${listing.propertyType}`)}
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <FavoriteButton listingId={listing.id} />
                  <ShareButton propertyTitle={listing.title} />
                </div>
              </div>
              <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
              <p className="text-2xl font-semibold text-primary flex items-center gap-1">
                {Number(listing.price).toLocaleString("fr-FR", {
                  style: "currency",
                  currency: "EUR",
                  minimumFractionDigits: 0,
                  maximumFractionDigits: 2,
                })}
              </p>
              <div className="flex items-center text-muted-foreground mt-2">
                <MapPin className="h-4 w-4 mr-2" />
                <p>
                  {listing.address}, {listing.city}
                </p>
              </div>
            </div>

            <Separator />

            {/* Key Features */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Bed className="h-4 w-4 text-muted-foreground" />
                <span>
                  {listing.bedrooms} {t("bedrooms")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Bath className="h-4 w-4 text-muted-foreground" />
                <span>
                  {listing.bathrooms} {t("bathrooms")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Square className="h-4 w-4 text-muted-foreground" />
                <span>
                  {listing.livingArea}m² {t("livingArea")}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <LandPlot className="h-4 w-4 text-muted-foreground" />
                <span>
                  {listing.totalArea}m² {t("totalArea")}
                </span>
              </div>
            </div>

            <Separator />

            {/* Description */}
            <div>
              <h2 className="text-xl font-semibold mb-3">{t("description")}</h2>
              <p className="text-muted-foreground whitespace-pre-line break-words">
                {listing.description}
              </p>
            </div>

            <Separator />

            {/* Amenities */}
            {listing.amenities && listing.amenities?.length > 0 && (
              <div>
                <h2 className="text-xl font-semibold mb-3">{t("amenities")}</h2>
                <div className="grid grid-cols-2 gap-4">
                  {listing.amenities?.map((amenity) => (
                    <div key={amenity} className="flex items-center gap-2">
                      <div className="p-2 bg-primary/10 rounded-full">
                        {getAmenityIcon(amenity)}
                      </div>
                      <span>{t(`amenitiesList.${amenity}`)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Separator />

            {/* Energy Classes */}
            <div>
              <h2 className="text-xl font-semibold mb-3">{t("energy")}</h2>
              <div className="grid grid-cols-2 gap-4">
                {listing.energyClass && (
                  <div>
                    <p className="text-muted-foreground">
                      {t("energyClass.label")}
                    </p>
                    <p className="font-medium">
                      {t(`energyClass.options.${listing.energyClass}`)}
                    </p>
                  </div>
                )}
                {listing.ghgEmissionClass && (
                  <div>
                    <p className="text-muted-foreground">
                      {t("ghgEmissionClass.label")}
                    </p>
                    <p className="font-medium">
                      {t(
                        `ghgEmissionClass.options.${listing.ghgEmissionClass}`
                      )}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Contact Information */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">{t("contact")}</h2>
                <div className="space-y-4">
                  {listing.contactPhone && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Phone className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{listing.contactPhone}</p>
                        <p className="text-sm text-muted-foreground">
                          {listing.contactName}
                        </p>
                      </div>
                    </div>
                  )}
                  {listing.contactEmail && (
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-full">
                        <Mail className="h-4 w-4 text-primary" />
                      </div>
                      <p className="font-medium">{listing.contactEmail}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
