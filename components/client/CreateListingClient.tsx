"use client";

import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
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
  SparklesIcon,
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
import PlanSelectionStep, { PricingPlan } from "../PlanSelectionStep";

export default function CreateListingClient() {
  const t = useTranslations("newListing");
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const locale = useLocale();

  // Google Maps Places Autocomplete
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
    libraries: ["places"],
  });

  const form = useForm<z.infer<typeof newListingSchema>>({
    resolver: zodResolver(newListingSchema),
    defaultValues: {
      title: "",
      description: "",
      price: 0,
      propertyType: "house",
      listingType: "sale",
      images: [],
      amenities: [],
      livingArea: 0,
      totalArea: 0,
      bedrooms: 0,
      bathrooms: 0,
      constructionYear: null,
      condition: "good",
      address: "",
      city: "",
      postalCode: "",
      latitude: null,
      longitude: null,
      contactName: "",
      contactPhone: "",
      contactEmail: "",
      preferredContactMethod: undefined,
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
    {
      id: "planSelection",
      title: t("steps.planSelection.title"),
      icon: SparklesIcon,
      description: t("steps.planSelection.description"),
    },
  ];

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
      case 5:
        return []; // Plan selection does not have validation fields
      default:
        return [];
    }
  };

  const currentStepProgress = ((currentStep + 1) / STEPS.length) * 100;

  const handleNext = useCallback(async () => {
    const fields = getFieldsForStep(currentStep);

    // Validate current step's fields
    const isValid = await form.trigger(fields);
    if (!isValid) {
      return;
    }

    // Clear errors for non-current fields
    const allFields = Object.keys(form.getValues()) as Array<
      keyof z.infer<typeof newListingSchema>
    >;
    const nonCurrentFields = allFields.filter(
      (field) => !fields.includes(field)
    );
    form.clearErrors(nonCurrentFields);

    // Move to next step
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length - 1));
  }, [currentStep, form, selectedPlan, t]);

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const onSubmit = async (values: z.infer<typeof newListingSchema>) => {
    if (!selectedPlan) {
      toast({
        title: t("errors.planNotSelected.title"),
        description: t("errors.planNotSelected.description"),
        variant: "destructive",
      });
      return;
    }

    try {
      setIsSubmitting(true);
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

      const listingResponse = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...values,
          images: uploadedImages,
        }),
      });

      if (!listingResponse.ok) {
        throw new Error("Failed to create listing");
      }

      const { listingId } = await listingResponse.json();

      const checkoutResponse = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          listingId,
          selectedPlan,
          locale: locale,
        }),
      });

      if (!checkoutResponse.ok) {
        throw new Error("Failed to create checkout session");
      }

      const { url } = await checkoutResponse.json();
      window.location.href = url;
    } catch (error) {
      toast({
        title: t("errors.submit.title"),
        description: t("errors.submit.description"),
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
            {/* Step Bubbles */}
            <nav aria-label="Progress">
              <ol role="list" className="flex items-center justify-between">
                {STEPS.map((step, index) => (
                  <li key={step.id} className="relative flex items-center">
                    <Button
                      variant={currentStep === index ? "default" : "outline"}
                      className="h-10 w-10 rounded-full"
                      onClick={() => setCurrentStep(index)}
                      disabled={index > currentStep}
                    >
                      <step.icon className="h-5 w-5" />
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

            {/* Content */}
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
                {currentStep === 3 && <ImagesStep form={form} />}
                {currentStep === 4 && <ContactStep form={form} />}
                {currentStep === 5 && (
                  <PlanSelectionStep
                    onPlanSelect={(plan) => setSelectedPlan(plan)}
                    selectedPlan={selectedPlan}
                  />
                )}
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
                  <Button
                    type="submit"
                    disabled={isSubmitting || !selectedPlan}
                  >
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
