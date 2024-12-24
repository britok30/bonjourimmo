"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { Autocomplete } from "@react-google-maps/api";
import { z } from "zod";
import { newListingSchema } from "@/lib/listing-form-schema";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";

type FormSchema = z.infer<typeof newListingSchema>;

const LocationStep = ({
  form,
  isLoaded,
}: {
  form: UseFormReturn<FormSchema>;
  isLoaded: boolean;
}) => {
  const t = useTranslations("newListing.location.fields");
  const [inputValue, setInputValue] = useState("");

  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);

  // Sync `inputValue` with the form's address field
  useEffect(() => {
    setInputValue(form.getValues("address") || "");
  }, [form]);

  const extractAddressComponent = (
    components: google.maps.GeocoderAddressComponent[],
    type: string
  ) => {
    const component = components.find((c) => c.types.includes(type));
    return component ? component.long_name : "";
  };

  const onPlaceSelected = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place && place.geometry) {
        const address = place.formatted_address || "";
        const latitude = place.geometry.location?.lat() || null;
        const longitude = place.geometry.location?.lng() || null;

        // Extract city and postal code
        const city = extractAddressComponent(
          place.address_components || [],
          "locality"
        );
        const postalCode = extractAddressComponent(
          place.address_components || [],
          "postal_code"
        );

        // Update form fields
        form.setValue("address", address);
        form.setValue("latitude", latitude); // Hidden field
        form.setValue("longitude", longitude); // Hidden field
        form.setValue("city", city);
        form.setValue("postalCode", postalCode);

        // Update input value
        setInputValue(address);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* Address Field with Google Maps Autocomplete */}
      <FormField
        control={form.control}
        name="address"
        render={({ field }) => (
          <FormItem className="col-span-full">
            <FormLabel>{t("address.label")}</FormLabel>
            <FormControl>
              {isLoaded ? (
                <Autocomplete
                  onLoad={setAutocomplete}
                  onPlaceChanged={onPlaceSelected}
                  restrictions={{ country: "fr" }} // Change country as needed
                >
                  <Input
                    {...field}
                    value={inputValue}
                    onChange={(e) => {
                      setInputValue(e.target.value);
                    }}
                    onBlur={() => {
                      if (
                        !form.getValues("latitude") ||
                        !form.getValues("longitude")
                      ) {
                        setInputValue("");
                        form.setValue("address", "");
                      }
                    }}
                    autoComplete="off"
                    placeholder={t("address.placeholder")}
                  />
                </Autocomplete>
              ) : (
                <Input {...field} disabled placeholder={t("address.loading")} />
              )}
            </FormControl>
            <FormDescription className="text-muted-foreground">
              {t("address.description")}
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Hidden fields for latitude/longitude */}
      <input type="hidden" {...form.register("latitude")} autoComplete="off" />
      <input type="hidden" {...form.register("longitude")} autoComplete="off" />

      {/* City */}
      <FormField
        control={form.control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("city.label")}</FormLabel>
            <FormControl>
              <Input autoComplete="off" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Postal Code */}
      <FormField
        control={form.control}
        name="postalCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("postalCode.label")}</FormLabel>
            <FormControl>
              <Input {...field} autoComplete="off" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default LocationStep;
