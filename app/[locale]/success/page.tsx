"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

const SuccessPage = () => {
  const t = useTranslations("success");
  const router = useRouter();
  const searchParams = useSearchParams();
  const type = searchParams.get("type");

  const valueMap: Partial<Record<string, number>> = {
    plus: 29,
    premium: 49,
  };

  // useEffect(() => {
  //   // Redirect to imagine page after 5 seconds
  //   const timer = setTimeout(() => {
  //     router.push("/dashboard");
  //   }, 5000);

  //   return () => clearTimeout(timer);
  // }, [router]);

  useEffect(() => {
    if (!type) return;
    // Send conversion event to Google Ads based on the subscription type

    const value = valueMap[type];
    // @ts-expect-error gtag is defined in the global scope
    window.gtag("event", "conversion", {
      send_to: "AW-11405036790/E6OgCM24oPkZEPaZrL4q",
      value: value,
      currency: "EUR",
      transaction_id: "",
    });
  }, [type]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <main className="container mx-auto px-4 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg text-center mx-auto"
        >
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-lg mb-8">{t("description")}</p>
          <Button size="lg" onClick={() => router.push("/dashboard")}>
            {t("button")}
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default SuccessPage;
