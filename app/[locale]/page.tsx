"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { ThemeToggle } from "@/components/ThemeToggle";
import { LocaleSwitcher } from "@/components/LocaleSwitcher";
import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import {
  Euro,
  Clock,
  ShieldCheck,
  Building,
  Users,
  Search,
  X,
  ArrowRight,
} from "lucide-react";

const HomePage = () => {
  const t = useTranslations("home");

  const benefits = [
    {
      icon: Euro,
      title: t("benefits.commission.title"),
      description: t("benefits.commission.description"),
    },
    {
      icon: Users,
      title: t("benefits.direct.title"),
      description: t("benefits.direct.description"),
    },
    {
      icon: Clock,
      title: t("benefits.control.title"),
      description: t("benefits.control.description"),
    },
    {
      icon: ShieldCheck,
      title: t("benefits.secure.title"),
      description: t("benefits.secure.description"),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Container with Background */}
      <div className="bg-hero bg-cover bg-center min-h-screen saturate-[1.5]">
        {/* Navigation */}
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

            <div className="flex items-center gap-4">
              <Link href="/listings">
                <Button
                  variant="ghost"
                  className="text-white hover:text-white hover:bg-white/10"
                >
                  <Search className="h-4 w-4 mr-2" />
                  {t("nav.browse")}
                </Button>
              </Link>
              <Link href="/pricing">
                <Button
                  variant="ghost"
                  className="text-white hover:text-white hover:bg-white/10"
                >
                  {t("nav.pricing")}
                </Button>
              </Link>
              <div className="flex items-center gap-2">
                <LocaleSwitcher />
                <ThemeToggle />
              </div>
              <Link href="/sign-in">
                <Button className="bg-white text-black hover:bg-white/90">
                  {t("nav.signIn")}
                </Button>
              </Link>
            </div>
          </div>
        </motion.nav>

        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="container mx-auto px-4 py-24 md:py-32"
        >
          <div className="text-center max-w-3xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-5xl font-bold leading-tight mb-6 text-white"
            >
              {t("hero.title")}
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xl mb-8 text-white/90"
            >
              {t("hero.subtitle")}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Link href="/sign-in">
                <Button size="lg" variant="secondary">
                  {t("hero.cta.primary")} <ArrowRight />
                </Button>
              </Link>
            </motion.div>
          </div>
        </motion.section>
      </div>

      {/* Benefits Section */}
      <section className="py-16 bg-muted/50">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-semibold mb-12 text-center">
            {t("benefits.title")}
          </h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="bg-background">
                <CardContent className="p-6">
                  <Icon className="w-8 h-8 text-primary mb-4" />
                  <h4 className="font-medium mb-2">{title}</h4>
                  <p className="text-sm text-muted-foreground">{description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="text-white bg-how bg-cover bg-center py-16 relative">
        {/* Dark overlay */}
        <div className="absolute inset-0 bg-black/70"></div>

        <div className="container mx-auto px-4 relative z-10">
          <h3 className="text-2xl font-semibold mb-12 text-center">
            {t("howItWorks.title")}
          </h3>
          <div className="grid md:grid-cols-3 gap-12 max-w-4xl mx-auto">
            {[1, 2, 3].map((step) => (
              <div key={step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-secondary/30 flex items-center justify-center mx-auto mb-4 text-xl font-semibold">
                  {step}
                </div>
                <h4 className="font-medium mb-2">
                  {t(`howItWorks.step${step}.title`)}
                </h4>
                <p className="text-sm text-zinc-300">
                  {t(`howItWorks.step${step}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Transparency Section */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4">
          <h3 className="text-2xl font-semibold mb-12 text-center">
            {t("transparency.title")}
          </h3>
          <div className="grid md:grid-cols-2 gap-12">
            {/* Why BonjourImmo */}
            <div>
              <h4 className="font-medium text-xl mb-4">
                {t("transparency.bonjourImmo.title")}
              </h4>
              <ul className="space-y-4">
                {[
                  t("transparency.bonjourImmo.noCommission"),
                  t("transparency.bonjourImmo.directControl"),
                  t("transparency.bonjourImmo.streamlinedPosting"),
                  t("transparency.bonjourImmo.effortlessManagement"),
                  t("transparency.bonjourImmo.affordability"),
                ].map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <ShieldCheck className="w-5 h-5 text-primary" />
                    <p className="text-sm text-muted-foreground">{point}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* Why Not Traditional Agencies */}
            <div>
              <h4 className="font-medium text-xl mb-4">
                {t("transparency.agencies.title")}
              </h4>
              <ul className="space-y-4">
                {[
                  t("transparency.agencies.highCommission"),
                  t("transparency.agencies.lackOfControl"),
                  t("transparency.agencies.delays"),
                  t("transparency.agencies.hiddenFees"),
                  t("transparency.agencies.limitedTransparency"),
                ].map((point, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <X className="w-5 h-5 text-red-600" />
                    <p className="text-sm text-muted-foreground">{point}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 mt-auto">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">
              © 2024 BonjourImmo. {t("footer.rights")}
            </p>
            <div className="flex gap-6">
              {[
                { href: "/pricing", text: t("footer.pricing") },
                // { href: "/privacy", text: t("footer.privacy") },
                { href: "/terms", text: t("footer.terms") },
                // { href: "/contact", text: t("footer.contact") },
              ].map(({ href, text }) => (
                <Link key={href} href={href}>
                  <Button variant="link" className="text-sm">
                    {text}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
