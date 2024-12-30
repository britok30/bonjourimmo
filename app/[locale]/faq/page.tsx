"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { FAQ } from "@/components/FAQ";

const FAQPage = () => {
  const t = useTranslations("faq");

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto mb-4">
            {t("subtitle")}
          </p>
          <Button variant="ghost" size="lg" asChild>
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              {t("back")}
            </Link>
          </Button>
        </div>

        {/* FAQ Section */}
        <div className="faq-section">
          <FAQ />
        </div>
      </div>
    </div>
  );
};

export default FAQPage;
