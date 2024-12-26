"use client";

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
import { useEffect } from "react";

// Infer the schema type
type FormSchema = z.infer<typeof newListingSchema>;

const ContactStep = ({ form }: { form: UseFormReturn<FormSchema> }) => {
  const t = useTranslations("newListing.contact.fields");

  // Watch preferred contact method
  const preferredMethod = form.watch("preferredContactMethod");

  // Clear irrelevant fields when contact method changes
  useEffect(() => {
    if (preferredMethod === "phone") {
      form.setValue("contactEmail", "", { shouldValidate: false });
    } else if (preferredMethod === "email") {
      form.setValue("contactPhone", "", { shouldValidate: false });
    }
  }, [preferredMethod, form]);

  return (
    <div className="space-y-6">
      {/* Contact Name */}
      <FormField
        control={form.control}
        name="contactName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("contactName.label")}</FormLabel>
            <FormControl>
              <Input
                placeholder={t("contactName.placeholder")}
                {...field}
                value={field.value || ""}
                autoComplete="off"
                onBlur={(e) => {
                  field.onBlur();
                  if (e.target.value) {
                    form.trigger("contactName");
                  }
                }}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Preferred Contact Method - Move this up */}
      <FormField
        control={form.control}
        name="preferredContactMethod"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t("preferredContactMethod.label")}</FormLabel>
            <FormControl>
              <Select
                value={field.value}
                onValueChange={(value) => {
                  field.onChange(value);
                  // Clear validation errors when method changes
                  form.clearErrors(["contactPhone", "contactEmail"]);
                }}
              >
                <SelectTrigger>
                  <SelectValue
                    placeholder={t("preferredContactMethod.placeholder")}
                  />
                </SelectTrigger>
                <SelectContent>
                  {["phone", "email", "both"].map((method) => (
                    <SelectItem key={method} value={method}>
                      {t(`preferredContactMethod.options.${method}`)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Contact Phone */}
      {(preferredMethod === "phone" || preferredMethod === "both") && (
        <FormField
          control={form.control}
          name="contactPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contactPhone.label")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="tel"
                  placeholder={t("contactPhone.placeholder")}
                  value={field.value || ""}
                  autoComplete="off"
                  onChange={(e) => {
                    const normalizedValue = e.target.value.replace(/\s+/g, "");
                    field.onChange(normalizedValue);
                  }}
                  onBlur={(e) => {
                    field.onBlur();
                    if (e.target.value) {
                      form.trigger("contactPhone");
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}

      {/* Contact Email */}
      {(preferredMethod === "email" || preferredMethod === "both") && (
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("contactEmail.label")}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  type="email"
                  value={field.value || ""}
                  placeholder={t("contactEmail.placeholder")}
                  autoComplete="off"
                  onBlur={(e) => {
                    field.onBlur();
                    if (e.target.value) {
                      form.trigger("contactEmail");
                    }
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      )}
    </div>
  );
};

export default ContactStep;
