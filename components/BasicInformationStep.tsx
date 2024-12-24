"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { newListingSchema } from "@/lib/listing-form-schema";
import { useTranslations } from "next-intl";

type FormSchema = z.infer<typeof newListingSchema>;

const BasicInformationStep = ({
  form,
}: {
  form: UseFormReturn<FormSchema>;
}) => {
  const t = useTranslations("newListing.basic.fields");

  const propertyTypeOptions = [
    "apartment",
    "house",
    "garage_parking",
    "land",
    "building",
    "business_funds",
    "commercial",
    "shared_room",
    "office",
    "business_premises",
    "other",
  ];

  const listingTypeOptions = ["sale", "rent", "vacation"];

  return (
    <div className="space-y-6">
      {/* Title */}
      <FormField
        control={form.control}
        name="title"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("title.label")}</FormLabel>
            <FormControl>
              <Input placeholder={t("title.placeholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Description */}
      <FormField
        control={form.control}
        name="description"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("description.label")}</FormLabel>
            <FormControl>
              <Textarea placeholder={t("description.placeholder")} {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Price */}
      <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("price.label")}</FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder={t("price.placeholder")}
                {...field}
                onWheel={(e) => e.currentTarget.blur()}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Property Type */}
      <FormField
        control={form.control}
        name="propertyType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("propertyType.label")}</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("propertyType.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypeOptions.map((value) => (
                    <SelectItem key={value} value={value}>
                      {t(`propertyType.options.${value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Listing Type */}
      <FormField
        control={form.control}
        name="listingType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("listingType.label")}</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
                  <SelectValue placeholder={t("listingType.placeholder")} />
                </SelectTrigger>
                <SelectContent>
                  {listingTypeOptions.map((value) => (
                    <SelectItem key={value} value={value}>
                      {t(`listingType.options.${value}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};

export default BasicInformationStep;
