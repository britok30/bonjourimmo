import type { Metadata } from "next";
import localFont from "next/font/local";
import "../globals.css";
import { getMessages } from "next-intl/server";
import { enGB, frFR } from "@clerk/localizations";
import { ClerkProvider } from "@clerk/nextjs";
import { NextIntlClientProvider, useLocale } from "next-intl";
import { Toaster } from "@/components/ui/toaster";
import { Analytics } from "@vercel/analytics/react";
import { ThemeProvider } from "@/components/ThemeProvider";
import GoogleTag from "@/components/GoogleTag";
// import GoogleTag from "@/components/GoogleTag";

const eudoxusSans = localFont({
  src: [
    {
      path: "../../app/fonts/EudoxusSans-Light.woff",
      weight: "300",
      style: "normal",
    },
    {
      path: "../../app/fonts/EudoxusSans-Regular.woff",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../app/fonts/EudoxusSans-Medium.woff",
      weight: "500",
      style: "normal",
    },
    {
      path: "../../app/fonts/EudoxusSans-Bold.woff",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../app/fonts/EudoxusSans-ExtraBold.woff",
      weight: "900",
      style: "normal",
    },
  ],
});

export const generateMetadata = async ({
  params,
}: {
  params: Promise<{ locale: string }>;
}) => {
  const { locale } = await params;

  const metadataContent: Record<string, Metadata> = {
    en: {
      title: "BonjourImmo - Private Real Estate Listings Platform",
      description:
        "BonjourImmo empowers private homeowners to list properties for sale, rent, or vacation. Enjoy a commission-free, user-friendly experience tailored for private landlords.",
    },
    fr: {
      title: "BonjourImmo - Plateforme d'annonces immobilières privées",
      description:
        "BonjourImmo permet aux propriétaires privés de publier leurs biens à vendre, à louer ou pour les vacances. Profitez d'une expérience conviviale sans commission, conçue pour les propriétaires privés.",
    },
  };

  const selectedContent = metadataContent[locale] || metadataContent.en;

  return {
    title: selectedContent.title,
    description: selectedContent.description,
    alternates: {
      languages: {
        en: "/en",
        fr: "/fr",
      },
    },
    openGraph: {
      type: "website",
      title: selectedContent.title as string,
      description: selectedContent.description as string,
      url: "https://www.bonjourimmo.com",
      images: [
        {
          url: "/main.jpg",
          alt: "BonjourImmo Platform",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: selectedContent.title as string,
      description: selectedContent.description as string,
      images: [
        {
          url: "/main.jpg",
          alt: "BonjourImmo Platform",
        },
      ],
    },
  };
};

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  const messages = await getMessages();

  const localization = () => {
    switch (locale) {
      case "fr":
        return frFR;
      default:
        return enGB;
    }
  };

  return (
    <ClerkProvider localization={localization()}>
      <html lang={locale} suppressHydrationWarning>
        <body className={`${eudoxusSans.className} antialiased`}>
          <Analytics />
          <GoogleTag />

          <NextIntlClientProvider messages={messages}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              {children}
              <Toaster />
            </ThemeProvider>
          </NextIntlClientProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
