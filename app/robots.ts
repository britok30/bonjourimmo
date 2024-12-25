import { MetadataRoute } from "next";

const baseUrl = "https://www.bonjourimmo.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/listings", "listings/*"],
        disallow: [
          "/api/",
          "/dashboard",
          "/success",
          "/my-listings",
          "/create-listing",
          "/favorites",
          "/*.json",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
