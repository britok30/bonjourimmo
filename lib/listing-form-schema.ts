import * as z from "zod";

export const newListingSchema = z
  .object({
    // Basic Information
    title: z
      .string()
      .min(10, "Le titre doit comporter au moins 10 caractères")
      .max(200, "Le titre ne peut pas dépasser 200 caractères"),
    description: z
      .string()
      .min(50, "La description doit comporter au moins 50 caractères")
      .max(5000, "La description ne peut pas dépasser 5000 caractères"),
    price: z.coerce
      .number()
      .positive("Le prix doit être supérieur à 0")
      .max(100000000, "Le prix ne peut pas dépasser 100 000 000 €")
      .multipleOf(0.01, "Le prix ne peut avoir que 2 décimales"),

    propertyType: z.enum([
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
    ]),

    listingType: z.enum(["sale", "rent", "vacation"]),

    // Location
    address: z
      .string()
      .min(5, "L'adresse doit comporter au moins 5 caractères")
      .max(255, "L'adresse ne peut pas dépasser 255 caractères"),
    city: z
      .string()
      .min(2, "La ville doit comporter au moins 2 caractères")
      .max(100, "La ville ne peut pas dépasser 100 caractères"),
    postalCode: z
      .string()
      .regex(
        /^[0-9]{5}$/,
        "Le code postal doit comporter exactement 5 chiffres"
      ),
    latitude: z
      .number()
      .min(41, "La latitude doit être située en France")
      .max(51.5, "La latitude doit être située en France")
      .nullable(),
    longitude: z
      .number()
      .min(-5, "La longitude doit être située en France")
      .max(10, "La longitude doit être située en France")
      .nullable(),

    // Property Details
    livingArea: z.coerce
      .number()
      .min(1, "La surface habitable doit être d'au moins 1 m²")
      .max(10000, "La surface habitable semble déraisonnablement grande"),
    totalArea: z.coerce
      .number()
      .min(1, "La surface totale doit être d'au moins 1 m²")
      .max(100000, "La surface totale semble déraisonnablement grande"),
    bedrooms: z.coerce
      .number()
      .min(1, "Doit avoir au moins 1 chambre")
      .max(20, "La valeur semble déraisonnablement élevée")
      .nullable()
      .optional(),
    bathrooms: z.coerce
      .number()
      .min(1, "Doit avoir au moins 1 salle de bain")
      .max(10, "La valeur semble déraisonnablement élevée")
      .nullable()
      .optional(),
    constructionYear: z.coerce
      .number()
      .min(1800, "L'année doit être postérieure à 1800")
      .max(new Date().getFullYear(), "L'année ne peut pas être dans le futur")
      .nullable()
      .optional(),
    condition: z
      .enum(["new", "excellent", "good", "to_renovate", "to_rebuild"])
      .optional(),

    // Energy Performance
    energyClass: z.enum(["has", "a", "b", "c", "d", "e", "f", "g"]).optional(),

    ghgEmissionClass: z
      .enum(["has", "a", "b", "c", "d", "e", "f", "g"])
      .optional(),

    // Features
    amenities: z
      .array(
        z.enum([
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
        ])
      )
      .default([]),

    // Images
    images: z
      .array(
        z
          .object({
            url: z.string(),
            key: z.string(),
          })
          .or(
            z
              .instanceof(File)
              .refine(
                (file) => file.size <= 25 * 1024 * 1024,
                "La taille du fichier doit être inférieure à 25 Mo"
              )
              .refine(
                (file) =>
                  [
                    "image/jpeg",
                    "image/jpg",
                    "image/png",
                    "image/webp",
                  ].includes(file.type),
                "Le fichier doit être au format JPEG, PNG ou WebP"
              )
          )
      )
      .min(1, "Au moins une image est requise"),

    // Contact Information
    contactName: z
      .string()
      .min(2, "Le nom doit comporter au moins 2 caractères")
      .max(100, "Le nom ne peut pas dépasser 100 caractères")
      .trim(),
    contactPhone: z
      .string()
      .max(15, "Le numéro de téléphone est trop long")
      .trim()
      .optional()
      .nullable()
      .refine((val) => {
        if (val === null || val === undefined || val === "") return true;
        // French phone numbers: +33 or 0 followed by 9 digits
        return /^(?:(?:\+33|0)[1-9](?:\d{2}){4})$/.test(val);
      }, "Doit être un numéro de téléphone français valide"),

    contactEmail: z
      .string()
      .max(255, "L'email ne peut pas dépasser 255 caractères")
      .toLowerCase()
      .optional()
      .nullable()
      .refine(
        (val) => val === "" || z.string().email().safeParse(val).success,
        {
          message: "Doit être une adresse email valide",
        }
      ),

    preferredContactMethod: z.enum(["phone", "email", "both"]),

    // The status will be set automatically
    status: z.enum(["active", "sold", "rented", "inactive"]).default("active"),
  })
  .superRefine((data, ctx) => {
    // Total area must be greater than or equal to living area
    if (data.totalArea < data.livingArea) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Total area must be greater than or equal to living area",
        path: ["totalArea"],
      });
    }

    const { preferredContactMethod, contactPhone, contactEmail } = data;

    if (preferredContactMethod === "phone") {
      if (!contactPhone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Le numéro de téléphone est requis lorsque la méthode de contact préférée est le téléphone",
          path: ["contactPhone"],
        });
      }
    }

    if (preferredContactMethod === "email") {
      if (!contactEmail) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "L'adresse e-mail est requise lorsque la méthode de contact préférée est l'e-mail",
          path: ["contactEmail"],
        });
      }
    }

    if (preferredContactMethod === "both") {
      if (!contactPhone) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "Le numéro de téléphone est requis lorsque la méthode de contact préférée est les deux",
          path: ["contactPhone"],
        });
      }
      if (!contactEmail) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message:
            "L'adresse e-mail est requise lorsque la méthode de contact préférée est les deux",
          path: ["contactEmail"],
        });
      }
    }
  });
