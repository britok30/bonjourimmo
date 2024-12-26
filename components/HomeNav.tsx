import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Search, ChevronDown, Globe, Moon, User } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { ThemeToggle } from "@/components/ThemeToggle";

export default function HomeNav() {
  const t = useTranslations("nav");

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-b border-white/10"
    >
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/">
          <motion.h1
            className="text-2xl font-bold tracking-tighter text-white relative"
            whileHover={{ scale: 1.02 }}
          >
            BonjourImmo
          </motion.h1>
        </Link>

        <div className="flex items-center space-x-2">
          <ThemeToggle />
          <LocaleSwitcher />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center gap-2 text-white hover:text-white hover:bg-white/10"
              >
                {t("menu")}
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {/* Browse */}
              <DropdownMenuItem asChild>
                <Link href="/listings">
                  <div className="flex items-center gap-2">
                    <Search className="w-4 h-4" />
                    {t("browse")}
                  </div>
                </Link>
              </DropdownMenuItem>
              {/* Pricing */}
              <DropdownMenuItem asChild>
                <Link href="/pricing">
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4" />
                    {t("pricing")}
                  </div>
                </Link>
              </DropdownMenuItem>

              {/* Sign In */}
              <DropdownMenuItem asChild>
                <Link href="/sign-in">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {t("signIn")}
                  </div>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </motion.nav>
  );
}
