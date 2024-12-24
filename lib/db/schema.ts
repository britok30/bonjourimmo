import {
  pgTable,
  serial,
  varchar,
  text,
  decimal,
  integer,
  timestamp,
  json,
  pgEnum,
} from "drizzle-orm/pg-core";

export const subscriptionPlanEnum = pgEnum("subscription_plan", [
  "free",
  "plus",
  "premium",
]);

// Property Types Enum
export const propertyTypeEnum = pgEnum("property_type", [
  "apartment", // Apartment
  "house", // Home
  "garage_parking", // Garage / Parking
  "land", // Ground
  "building", // Building
  "business_funds", // Business funds
  "commercial", // Commercial premises
  "shared_room", // Shared room
  "office", // Offices & professional premises
  "business_premises", // Business premises
  "other", // Others
]);

export const listingTypeEnum = pgEnum("listing_type", [
  "sale",
  "rent",
  "vacation",
]);

export const listingStatusEnum = pgEnum("listing_status", [
  "active", // Listing is active and visible
  "sold", // Property has been sold
  "rented", // Property has been rented
  "inactive", // Temporarily hidden by user
]);

export const propertyConditionEnum = pgEnum("property_condition", [
  "new",
  "excellent",
  "good",
  "to_renovate",
  "to_rebuild",
]);

export const floodZoneEnum = pgEnum("flood_zone", [
  "no_risk",
  "possible",
  "effective",
]);

export const energyClassEnum = pgEnum("energy_class", [
  "has", // Hors Ancien Système
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
]);

export const ghgEmissionClassEnum = pgEnum("ghg_emission_class", [
  "has", // Hors Ancien Système
  "a",
  "b",
  "c",
  "d",
  "e",
  "f",
  "g",
]);

// Users Table
export const users = pgTable("users", {
  id: varchar("id").primaryKey(), // Clerk user ID
  email: varchar("email", { length: 255 }).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Listings Table
export const listings = pgTable("listings", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull(),
  userId: varchar("user_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  // Basic Information
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 12, scale: 2 }).notNull(),
  listingType: listingTypeEnum("listing_type").notNull(),
  propertyType: propertyTypeEnum("property_type").notNull(),

  // Location
  address: varchar("address", { length: 255 }).notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  postalCode: varchar("postal_code", { length: 10 }).notNull(),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),

  // Property Details
  livingArea: integer("living_area").notNull(), // in square meters
  totalArea: integer("total_area").notNull(), // in square meters
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  condition: propertyConditionEnum("condition"),
  constructionYear: integer("construction_year"),

  // Energy Performance
  energyClass: energyClassEnum("energy_class"),
  ghgEmissionClass: ghgEmissionClassEnum("ghg_emission_class"),


  // Features
  amenities: json("amenities").$type<string[]>(),
  images: json("images").$type<{ url: string; key: string }[]>(),

  // Listing Status
  status: listingStatusEnum("status").default("active").notNull(),

  // Contact Information
  contactPhone: varchar("contact_phone", { length: 20 }).notNull(),
  contactEmail: varchar("contact_email", { length: 255 }).notNull(),
  contactName: varchar("contact_name", { length: 100 }).notNull(),
  preferredContactMethod: varchar("preferred_contact_method", {
    enum: ["phone", "email", "both"],
  }).notNull(),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Favorites Table
export const favorites = pgTable("favorites", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id").notNull(),
  listingId: integer("listing_id").references(() => listings.id, {
    onDelete: "cascade",
  }),
  createdAt: timestamp("created_at").defaultNow(),
});

// Subscriptions Table
export const userSubscriptions = pgTable("user_subscriptions", {
  id: serial("id").primaryKey(),
  userId: varchar("user_id", { length: 256 }).notNull().unique(),
  userEmail: varchar("user_email", { length: 256 }).notNull(),
  stripeCustomerId: varchar("stripe_customer_id", { length: 256 })
    .notNull()
    .unique(),
  stripeSubscriptionId: varchar("stripe_subscription_id", {
    length: 256,
  }).unique(),
  stripePriceId: varchar("stripe_price_id", { length: 256 }),
  stripeCurrentPeriodEnd: timestamp("stripe_current_period_ended_at"),
  stripeRole: varchar("stripe_role", { length: 256 }).notNull(),
  stripeStatus: varchar("stripe_status", { length: 256 }).notNull(),
});

export type Listing = typeof listings.$inferSelect;
export type User = typeof users.$inferSelect;
