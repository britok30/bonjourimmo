// app/[locale]/dashboard/DashboardClient.tsx
"use client";

import { UserButton } from "@clerk/nextjs";
import { useTranslations } from "next-intl";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Home, Heart, Search } from "lucide-react";
import { Link } from "@/i18n/routing";
import { HeaderDropdown } from "@/components/HeaderDropdown";
import Image from "next/image";
import FranceClock from "@/components/FranceClock";
import createListing from "@/public/dashboard/create-listing.jpg";
import myListings from "@/public/dashboard/my-listings.jpg";
import favorites from "@/public/dashboard/favorites.jpg";
import browse from "@/public/dashboard/browse.jpg";

const actions = [
  {
    href: "/create-listing",
    icon: Plus,
    translationKey: "newListing",
    image: createListing,
    alt: "Modern French apartment interior",
  },
  {
    href: "/my-listings",
    icon: Home,
    translationKey: "myListings",
    image: myListings,
    alt: "Beautiful French townhouses",
  },
  {
    href: "/favorites",
    icon: Heart,
    translationKey: "favorites",
    image: favorites,
    alt: "Charming French countryside home",
  },
  {
    href: "/listings",
    icon: Search,
    translationKey: "browseProperties",
    image: browse,
    alt: "Typical Parisian street with classic buildings",
  },
];

const DashboardClient = () => {
  const t = useTranslations("dashboard");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard">
            <h1 className="text-xl font-bold">BonjourImmo</h1>
          </Link>

          <div className="flex items-center gap-4">
            <FranceClock />
            <HeaderDropdown />
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <h2 className="text-3xl font-bold mb-2">{t("welcome")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {actions.map(({ href, icon: Icon, translationKey, image, alt }) => (
            <Link key={href} href={href}>
              <Card className="group overflow-hidden hover:border-primary transition-all duration-300">
                <CardContent className="p-0">
                  <div className="relative h-40 w-full overflow-hidden">
                    <Image
                      src={image}
                      alt={alt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      placeholder="blur"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
                  </div>
                  <div className="p-4 relative">
                    <div className="p-3 bg-primary/10 rounded-full w-fit mb-3">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-1">
                      {t(`actions.${translationKey}`)}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      {t(`actions.${translationKey}Desc`)}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
};

export default DashboardClient;
