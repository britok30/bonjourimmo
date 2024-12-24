import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "bonjourimmo.s3.us-east-2.amazonaws.com",
      },
    ],
  },
};

export default withNextIntl(nextConfig);
