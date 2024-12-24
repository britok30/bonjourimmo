"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ArrowLeft, Check, Star, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useAuth } from "@clerk/nextjs"; // Add this for authentication
import { FAQ } from "@/components/FAQ";

type Tier = {
  name: string;
  price: string;
  planId: string;
  description: string;
  features: string[];
  buttonText: string;
  href?: string;
  priceDetail?: string;
  featured?: boolean;
};

const PricingPage = () => {
  const t = useTranslations("pricing");
  const router = useRouter();
  const { userId } = useAuth(); // Fetch user authentication state
  const [loading, setLoading] = useState<string | null>(null);

  const handleSubscribe = async (plan: string) => {
    if (!userId) {
      router.push("/sign-in"); // Redirect to sign-in if not authenticated
      return;
    }

    try {
      setLoading(plan);

      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ plan }),
      });

      if (!response.ok) {
        throw new Error("Failed to create checkout session");
      }

      const data = await response.json();

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const tiers: Tier[] = [
    {
      name: t("tiers.free.name"),
      price: t("tiers.free.price"),
      planId: "free",
      description: t("tiers.free.description"),
      features: t.raw("tiers.free.features") as string[],
      buttonText: t("tiers.free.buttonText"),
      href: "/create-listing",
    },
    {
      name: t("tiers.plus.name"),
      price: t("tiers.plus.price"),
      planId: "plus",
      priceDetail: t("perMonth"),
      description: t("tiers.plus.description"),
      features: t.raw("tiers.plus.features") as string[],
      buttonText: t("tiers.plus.buttonText"),
      featured: true,
    },
    {
      name: t("tiers.premium.name"),
      price: t("tiers.premium.price"),
      planId: "premium",
      priceDetail: t("perMonth"),
      description: t("tiers.premium.description"),
      features: t.raw("tiers.premium.features") as string[],
      buttonText: t("tiers.premium.buttonText"),
    },
  ];

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
            {t("subtitle")}
          </p>
          <Button variant="ghost" size="lg" asChild>
            <Link href="/dashboard">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("back")}
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {tiers.map((tier) => (
            <Card
              key={tier.name}
              className={cn(
                "relative",
                tier.featured && "border-primary shadow-lg scale-105"
              )}
            >
              {tier.featured && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-sm rounded-full px-3 py-1 flex items-center gap-1">
                    <Star className="w-4 h-4" />
                    {t("mostPopular")}
                  </span>
                </div>
              )}

              <CardHeader>
                <CardTitle>{tier.name}</CardTitle>
                <CardDescription>{tier.description}</CardDescription>
              </CardHeader>

              <CardContent>
                <div className="mb-6">
                  <span className="text-3xl font-bold">{tier.price}</span>
                  {tier.priceDetail && (
                    <span className="text-muted-foreground">
                      {tier.priceDetail}
                    </span>
                  )}
                </div>

                <ul className="space-y-3">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-primary" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter>
                {tier.planId === "free" ? (
                  <Button
                    className="w-full"
                    variant="outline"
                    size="lg"
                    asChild
                  >
                    <Link href={userId ? "/create-listing" : "/sign-in"}>
                      {tier.buttonText}
                    </Link>
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={tier.featured ? "default" : "outline"}
                    size="lg"
                    onClick={() =>
                      userId
                        ? handleSubscribe(tier.planId)
                        : router.push("/sign-in")
                    }
                    disabled={loading === tier.planId}
                  >
                    {loading === tier.planId ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        {t("processing")}
                      </>
                    ) : (
                      tier.buttonText
                    )}
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>

      <FAQ />
    </div>
  );
};

export default PricingPage;
