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
  const plan = searchParams.get("plan");

  const valueMap: Partial<Record<string, number>> = {
    basic: 29,
    plus: 49,
    premium: 99,
  };

  useEffect(() => {
    if (!plan) return;
    const value = valueMap[plan];
    // @ts-expect-error gtag is defined in the global scope

    window.gtag("event", "conversion", {
      send_to: "AW-16763653327/SvH1COj-x_0ZEM-ZxLk-",
      value: value,
      currency: "USD",
      transaction_id: "",
    });
  }, [plan]);

  return (
    <div className="min-h-screen bg-success bg-cover flex items-center justify-center bg-background text-white">
      <main className="container mx-auto px-4 w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg text-center mx-auto"
        >
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-lg mb-8">{t("description")}</p>
          <Button
            size="lg"
            onClick={() => router.push("/dashboard")}
            variant="secondary"
          >
            {t("button")}
          </Button>
        </motion.div>
      </main>
    </div>
  );
};

export default SuccessPage;
