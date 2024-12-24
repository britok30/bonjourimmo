"use client";

import { SignIn, useClerk } from "@clerk/nextjs";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { ChevronLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";

export default function SignInPage() {
  const t = useTranslations("auth");
  const [isLoading, setIsLoading] = useState(true);
  const { loaded } = useClerk();

  // Update loading state when Clerk is loaded
  useEffect(() => {
    if (loaded) {
      setIsLoading(false);
    }
  }, [loaded]);

  return (
    <div className="min-h-screen flex items-center justify-center relative">
      {/* Background */}
      <div className="absolute inset-0 bg-sign-in bg-cover bg-center">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
      </div>

      {/* Back Button */}
      <div className="absolute top-4 left-4">
        <Link href="/">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:text-white hover:bg-white/10"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            {t("back")}
          </Button>
        </Link>
      </div>

      {/* Content */}
      <div className="relative z-10 w-full">
        {/* Main Content */}
        <div className="max-w-md mx-auto px-4">
          {/* Logo & Welcome */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-block">
              <h1 className="text-3xl font-bold tracking-tighter text-white mb-2">
                BonjourImmo
              </h1>
            </Link>
            <p className="text-zinc-200">{t("welcome")}</p>
          </div>

          {/* Sign In Form with Loading State */}
          <div className="relative min-h-[500px] flex items-center justify-center">
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm rounded-lg">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                  <p className="text-sm text-muted-foreground">
                    {t("loading")}
                  </p>
                </div>
              </div>
            )}
            <SignIn
              forceRedirectUrl="/dashboard"
              appearance={{
                layout: {
                  socialButtonsVariant: "iconButton",
                  socialButtonsPlacement: "bottom",
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
