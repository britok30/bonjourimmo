"use client";

import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import type { z } from "zod";
import { Link } from "@/i18n/routing";
import { useLoadScript } from "@react-google-maps/api";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Loader2,
  Home,
  MapPin,
  ImagePlus,
  Phone,
  CircleDot,
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { uploadToS3, getS3Url } from "@/lib/s3";

// UI Components
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Form } from "@/components/ui/form";
import { Progress } from "@/components/ui/progress";
import { newListingSchema } from "@/lib/listing-form-schema";
import BasicInformationStep from "../BasicInformationStep";
import LocationStep from "../LocationStep";
import DetailsStep from "../DetailsStep";
import ImagesStep from "../ImagesStep";
import ContactStep from "../ContactStep";

const IMAGE_LIMITS = {
  free: 10,
  plus: 30,
  premium: 60,
} as const;

export default function CreateListingClient({
  subscriptionTier,
}: {
  subscriptionTier: "free" | "plus" | "premium";
}) {
  const t = useTranslations("newListing");
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Google Maps Places Autocomplete
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const form = useForm<z.infer<typeof newListingSchema>>({
    resolver: zodResolver(newListingSchema),
    defaultValues: {
      // Basic Information
      title: "",
      description: "",
      price: 0,
      propertyType: "house",
      listingType: "sale",

      // Images
      images: [],

      // Property Details
      amenities: [],
      livingArea: 0,
      totalArea: 0,
      bedrooms: 0,
      bathrooms: 0,
      constructionYear: null,
      condition: "good",

      // Location
      address: "",
      city: "",
      postalCode: "",
      latitude: null,
      longitude: null,

      // Contact Information
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      preferredContactMethod: undefined,

      // Status
      status: "active",
    },
  });

  const STEPS = [
    {
      id: "basic",
      title: t("steps.basic.title"),
      icon: Home,
      description: t("steps.basic.description"),
    },
    {
      id: "location",
      title: t("steps.location.title"),
      icon: MapPin,
      description: t("steps.location.description"),
    },
    {
      id: "details",
      title: t("steps.details.title"),
      icon: CircleDot,
      description: t("steps.details.description"),
    },
    {
      id: "images",
      title: t("steps.images.title"),
      icon: ImagePlus,
      description: t("steps.images.description"),
    },
    {
      id: "contact",
      title: t("steps.contact.title"),
      icon: Phone,
      description: t("steps.contact.description"),
    },
  ];

  const currentStepProgress = ((currentStep + 1) / STEPS.length) * 100;

  const getFieldsForStep = (
    step: number
  ): Array<keyof z.infer<typeof newListingSchema>> => {
    switch (step) {
      case 0:
        return ["title", "description", "price", "propertyType", "listingType"];
      case 1:
        return ["address", "city", "postalCode", "latitude", "longitude"];
      case 2:
        return [
          "livingArea",
          "totalArea",
          "bedrooms",
          "bathrooms",
          "constructionYear",
          "condition",
          "energyClass",
          "ghgEmissionClass",
          "amenities",
        ];
      case 3:
        return ["images"];
      case 4:
        return [
          "contactName",
          "contactPhone",
          "contactEmail",
          "preferredContactMethod",
        ];
      default:
        return [];
    }
  };

  const handleNext = useCallback(async () => {
    const fields = getFieldsForStep(currentStep);
    // Validate current step fields
    const isValid = await form.trigger(fields);

    if (isValid) {
      // Clear errors for all non-current fields before moving to the next step
      const allFields = Object.keys(form.getValues()) as Array<
        keyof z.infer<typeof newListingSchema>
      >;
      const nonCurrentFields = allFields.filter(
        (field) => !fields.includes(field)
      );
      form.clearErrors(nonCurrentFields);

      // Move to the next step
      setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
    }
  }, [currentStep, form]);

  const handleBack = () => {
    // Clear errors for current step fields
    const fields = getFieldsForStep(currentStep);
    form.clearErrors(fields as Array<keyof z.infer<typeof newListingSchema>>);

    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (values: z.infer<typeof newListingSchema>) => {
    try {
      setIsSubmitting(true);

      // First check if user can create listing
      const checkResponse = await fetch("/api/listings/check");
      if (!checkResponse.ok) {
        const data = await checkResponse.json();

        if (checkResponse.status === 429) {
          toast({
            title: t("errors.rateLimit.title"),
            description: t("errors.rateLimit.description"),
            variant: "destructive",
            action: (
              <Button
                variant="secondary"
                size="sm"
                onClick={() => router.push("/pricing")}
              >
                {t("errors.rateLimit.action")}
              </Button>
            ),
          });
          return;
        }

        throw new Error(
          data.error || "Something went wrong during rate limit check"
        );
      }

      const imagePromises = values.images.map(async (image) => {
        if (image instanceof File) {
          const { file_key } = await uploadToS3(image, image.name);
          return {
            url: getS3Url(file_key),
            key: file_key,
          };
        }
        return image;
      });

      const uploadedImages = await Promise.all(imagePromises);

      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          images: uploadedImages,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create listing");
      }

      toast({
        title: t("success.title"),
        description: t("success.description"),
      });

      router.push("/dashboard");
    } catch (error) {
      toast({
        title: t("error.title"),
        description: t("error.description"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="px-10 sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-2xl items-center">
          <div className="flex flex-1 items-center justify-between">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard" passHref>
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>

            <div className="flex items-center gap-4">
              <Progress value={currentStepProgress} className="w-[100px]" />
              <p className="text-sm text-muted-foreground">
                {t("step")} {currentStep + 1} / {STEPS.length}
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto container flex items-center justify-center min-h-[80vh] py-8">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="w-full max-w-3xl space-y-8"
          >
            <div className="hidden md:block">
              <nav aria-label="Progress">
                <ol role="list" className="flex items-center justify-between">
                  {STEPS.map((step, index) => (
                    <li key={step.id} className="relative flex items-center">
                      <Button
                        variant={currentStep >= index ? "default" : "outline"}
                        className="h-10 w-10 rounded-full p-0"
                        onClick={() =>
                          index <= currentStep && setCurrentStep(index)
                        }
                        disabled={index > currentStep}
                      >
                        <step.icon className="h-5 w-5" />
                        <span className="sr-only">{step.title}</span>
                      </Button>

                      {index !== STEPS.length - 1 && (
                        <div
                          className={cn(
                            "absolute left-full top-1/2 h-0.5 w-full -translate-y-1/2 transform",
                            index < currentStep ? "bg-primary" : "bg-muted"
                          )}
                        />
                      )}
                    </li>
                  ))}
                </ol>
              </nav>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>{STEPS[currentStep].title}</CardTitle>
                <CardDescription>
                  {STEPS[currentStep].description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {currentStep === 0 && <BasicInformationStep form={form} />}
                {currentStep === 1 && (
                  <LocationStep form={form} isLoaded={isLoaded} />
                )}
                {currentStep === 2 && <DetailsStep form={form} />}
                {currentStep === 3 && (
                  <ImagesStep
                    form={form}
                    maxFiles={IMAGE_LIMITS[subscriptionTier]}
                  />
                )}
                {currentStep === 4 && <ContactStep form={form} />}
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                >
                  {t("actions.back")}
                </Button>
                {currentStep === STEPS.length - 1 ? (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {t("actions.submitting")}
                      </>
                    ) : (
                      t("actions.submit")
                    )}
                  </Button>
                ) : (
                  <Button type="button" onClick={handleNext}>
                    {t("actions.next")}
                  </Button>
                )}
              </CardFooter>
            </Card>
          </form>
        </Form>
      </main>
    </div>
  );
}
