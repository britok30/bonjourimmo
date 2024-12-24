"use client";

import { useLocale } from "next-intl";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Link, usePathname } from "@/i18n/routing";
import { Check } from "lucide-react";

export const LocaleSwitcher = ({ className }: { className?: string }) => {
  const locale = useLocale();
  const pathname = usePathname();

  const locales = [
    { code: "fr", label: "Français", flag: "🇫🇷" },
    { code: "en", label: "English", flag: "🇬🇧" },
  ];

  const currentLocale = locales.find((l) => l.code === locale);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className={className}>
          {currentLocale?.flag} {currentLocale?.label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((l) => (
          <DropdownMenuItem key={l.code} asChild>
            <Link href={pathname} locale={l.code} className="w-full">
              <div className="flex items-center justify-between w-full">
                <span>
                  {l.flag} {l.label}
                </span>
                {locale === l.code && <Check className="h-4 w-4 ml-2" />}
              </div>
            </Link>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
