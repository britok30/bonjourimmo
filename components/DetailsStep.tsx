"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { newListingSchema } from "@/lib/listing-form-schema";
import { UseFormReturn } from "react-hook-form";
import { useTranslations } from "next-intl";
import { z } from "zod";

// Infer the schema type
type FormSchema = z.infer<typeof newListingSchema>;

const DetailsStep = ({ form }: { form: UseFormReturn<FormSchema> }) => {
  const t = useTranslations("newListing.details.fields");

  const conditionOptions = [
    "new",
    "excellent",
    "good",
    "to_renovate",
    "to_rebuild",
  ];

  const energyClassOptions = ["has", "a", "b", "c", "d", "e", "f", "g"];
  const ghgEmissionClassOptions = ["has", "a", "b", "c", "d", "e", "f", "g"];
  const amenitiesOptions = [
    "parking",
    "garden",
    "terrace",
    "elevator",
    "pool",
    "security",
    "cellar",
    "balcony",
    "garage",
    "air_conditioning",
    "fireplace",
    "alarm",
    "intercom",
    "digicode",
    "furnished",
    "handicap_access",
  ];

  return (
    <div className="space-y-6">
      {/* Living Area */}
      <FormField
        control={form.control}
        name="livingArea"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("livingArea.label")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                step="any"
                placeholder={t("livingArea.placeholder")}
                {...field}
                value={field.value ?? undefined}
                onWheel={(e) => e.currentTarget.blur()}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Total Area */}
      <FormField
        control={form.control}
        name="totalArea"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("totalArea.label")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                step="any"
                placeholder={t("totalArea.placeholder")}
                {...field}
                value={field.value ?? undefined}
                onWheel={(e) => e.currentTarget.blur()}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Bedrooms */}
      <FormField
        control={form.control}
        name="bedrooms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("bedrooms.label")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                placeholder={t("bedrooms.placeholder")}
                {...field}
                value={field.value ?? undefined}
                onWheel={(e) => e.currentTarget.blur()}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Bathrooms */}
      <FormField
        control={form.control}
        name="bathrooms"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("bathrooms.label")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                placeholder={t("bathrooms.placeholder")}
                {...field}
                value={field.value ?? undefined}
                onWheel={(e) => e.currentTarget.blur()}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Construction Year */}
      <FormField
        control={form.control}
        name="constructionYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("constructionYear.label")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                min="0"
                placeholder={t("constructionYear.placeholder")}
                {...field}
                value={
                  field.value !== null && field.value !== undefined
                    ? field.value
                    : ""
                }
                onChange={(e) =>
                  field.onChange(
                    e.target.value ? parseInt(e.target.value, 10) : null
                  )
                }
                onWheel={(e) => e.currentTarget.blur()}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Condition */}
      <FormField
        control={form.control}
        name="condition"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("condition.label")}</FormLabel>
            <FormControl>
              <Select
                value={field.value ?? undefined}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("condition.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {conditionOptions.map((value) => (
                    <SelectItem key={value} value={value}>
                      {t(`condition.options.${value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Energy Class */}
      <FormField
        control={form.control}
        name="energyClass"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("energyClass.label")}</FormLabel>
            <FormControl>
              <Select
                value={field.value ?? undefined}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t("energyClass.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {energyClassOptions.map((value) => (
                    <SelectItem key={value} value={value}>
                      {t(`energyClass.options.${value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* GHG Emission Class */}
      <FormField
        control={form.control}
        name="ghgEmissionClass"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("ghgEmissionClass.label")}</FormLabel>
            <FormControl>
              <Select
                value={field.value ?? undefined}
                onValueChange={field.onChange}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("ghgEmissionClass.placeholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {ghgEmissionClassOptions.map((value) => (
                    <SelectItem key={value} value={value}>
                      {t(`ghgEmissionClass.options.${value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Amenities */}
      <FormField
        control={form.control}
        name="amenities"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("amenities.label")}</FormLabel>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {amenitiesOptions.map((amenity) => (
                <div key={amenity} className="flex items-center space-x-2">
                  <Checkbox
                    //@ts-expect-error - Type issue with zod
                    checked={field.value?.includes(amenity)}
                    onCheckedChange={(checked) => {
                      const updatedAmenities = checked
                        ? [...(field.value || []), amenity]
                        : field.value?.filter((a) => a !== amenity) || [];
                      field.onChange(updatedAmenities);
                    }}
                  />
                  <Label>{t(`amenities.${amenity}`)}</Label>
                </div>
              ))}
            </div>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default DetailsStep;
