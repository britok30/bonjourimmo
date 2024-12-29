"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Settings, Sun, Moon, SparklesIcon, Loader2, Mail } from "lucide-react";
import { useTheme } from "next-themes";
import { Link, usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "@/hooks/use-toast";
import { useState } from "react";

interface HeaderDropdownProps {
  userPlan: "free" | "plus" | "premium";
}

export function HeaderDropdown({ userPlan }: HeaderDropdownProps) {
  const locale = useLocale();
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();
  const t = useTranslations("dashboard");
  const [isPortalLoading, setPortalLoading] = useState(false);

  const locales = [
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "en", label: "English", flag: "🇬🇧" },
  ];

  const handleManageSubscription = async () => {
    try {
      setPortalLoading(true);
      const response = await fetch("/api/billing-portal", {
        method: "POST",
        body: JSON.stringify({ locale }),
      });

      if (!response.ok) {
        throw new Error("Failed to access billing portal");
      }

      const data = await response.json();
      window.location.href = data.url;
    } catch (error) {
      toast({
        title: t("header.errors.portal.title"),
        description: t("header.errors.portal.description"),
        variant: "destructive",
      });
    } finally {
      setPortalLoading(false);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon">
          <Settings className="h-5 w-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        {/* Main Settings Label */}
        <DropdownMenuLabel>{t("header.settings.title")}</DropdownMenuLabel>
        <DropdownMenuSeparator />

        {/* Theme Section */}
        <DropdownMenuLabel className="text-xs">
          {t("header.settings.theme.title")}
        </DropdownMenuLabel>
        <div className="px-2 py-1.5">
          <div className="flex flex-col gap-2">
            <Button
              variant={theme === "light" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTheme("light")}
              className="justify-start"
            >
              <Sun className="mr-2 h-4 w-4" />
              {t("header.settings.theme.light")}
            </Button>
            <Button
              variant={theme === "dark" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setTheme("dark")}
              className="justify-start"
            >
              <Moon className="mr-2 h-4 w-4" />
              {t("header.settings.theme.dark")}
            </Button>
          </div>
        </div>

        <DropdownMenuSeparator />

        {/* Language Section */}
        <DropdownMenuLabel className="text-xs">
          {t("header.settings.language.title")}
        </DropdownMenuLabel>
        <div className="px-2 py-1.5">
          <div className="flex flex-col gap-2">
            {locales.map((l) => (
              <Link
                href={pathname}
                locale={l.code}
                key={l.code}
                className="w-full"
              >
                <Button
                  variant={locale === l.code ? "secondary" : "ghost"}
                  size="sm"
                  className="w-full justify-start"
                >
                  {l.flag} <span className="ml-2">{l.label}</span>
                </Button>
              </Link>
            ))}
          </div>
        </div>

        <DropdownMenuSeparator />

        <div className="px-2 py-1.5 space-y-2">
          <Link href="/contact" className="block">
            <Button className="w-full" size="sm">
              <Mail className="mr-2 h-4 w-4" />
              {t("header.settings.subscription.contact")}
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
