"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { ChevronLeft } from "lucide-react";

const ContactUsPage = () => {
  const t = useTranslations("contact");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      console.log(formData);

      if (!response.ok) {
        throw new Error("Failed to send the message.");
      }

      toast({
        title: t("success.title"),
        description: t("success.description"),
      });
      setFormData({ name: "", email: "", message: "" });
    } catch (error) {
      toast({
        title: t("error.title"),
        description: t("error.description"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container max-w-lg mx-auto">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground"
            onClick={() => router.push("/dashboard")}
          >
            <ChevronLeft className="h-4 w-4" />
            {t("back")}
          </Button>
        </div>

        {/* Page Content */}
        <h1 className="text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-muted-foreground mb-8">{t("description")}</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block font-medium mb-1">
              {t("fields.name.label")}
            </label>
            <Input
              id="name"
              name="name"
              placeholder={t("fields.name.placeholder")}
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="block font-medium mb-1">
              {t("fields.email.label")}
            </label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder={t("fields.email.placeholder")}
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <label htmlFor="message" className="block font-medium mb-1">
              {t("fields.message.label")}
            </label>
            <Textarea
              id="message"
              name="message"
              placeholder={t("fields.message.placeholder")}
              rows={4}
              value={formData.message}
              onChange={handleInputChange}
              required
            />
          </div>
          <Button type="submit" disabled={isSubmitting} className="w-full">
            {isSubmitting ? t("button.sending") : t("button.default")}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ContactUsPage;
