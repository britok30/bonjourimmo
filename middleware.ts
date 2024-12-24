// middleware.ts
import createMiddleware from "next-intl/middleware";
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { DEFAULT_LOCALE, locales } from "./lib/locales";

const intlMiddleware = createMiddleware({
  locales: locales,
  defaultLocale: DEFAULT_LOCALE,
});

const isProtectedRoute = createRouteMatcher([
  "/:locale/dashboard(.*)",
  "/:locale/my-listings(.*)",
  "/:locale/create-listing(.*)",
  "/:locale/favorites(.*)",
  "/:locale/success(.*)",
]);

const isAPIRoute = createRouteMatcher([
  "/api/listings",
  "/api/listings/check",
  "/api/listings/:id",
  "/api/listings/status",
  "/api/favorites",
  "/api/favorites/check",
  "/api/webhook",
  "/api/checkout",
  "/api/billing-portal",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isProtectedRoute(req)) await auth.protect();
  if (isAPIRoute(req)) return;

  return intlMiddleware(req);
});

export const config = {
  matcher: [
    "/((?!.+\\.[\\w]+$|_next).*)", // exclude static & next
    "/(api|trpc)(.*)", // include all API routes
  ],
};
