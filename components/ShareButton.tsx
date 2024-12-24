"use client";

import React from "react";
import { Share2, Check, Copy } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";

interface ShareButtonProps {
  propertyTitle: string;
  propertyUrl?: string;
}

export const ShareButton = ({
  propertyTitle,
  propertyUrl,
}: ShareButtonProps) => {
  const t = useTranslations("shareButton");
  const { toast } = useToast();
  const [copied, setCopied] = React.useState(false);

  const url =
    propertyUrl || (typeof window !== "undefined" ? window.location.href : "");

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: propertyTitle,
          text: `${t("share")} ${propertyTitle}`,
          url,
        });
        toast({
          description: t("sharedSuccessfully"),
        });
      } catch (error) {
        if ((error as Error).name !== "AbortError") {
          console.error("Error sharing:", error);
        }
      }
    }
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        description: t("copied"),
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        description: t("failedToCopy"),
      });
    }
  };

  const canNativeShare = typeof navigator !== "undefined" && navigator.share;

  if (canNativeShare) {
    return (
      <Button
        variant="outline"
        size="sm"
        className="gap-2"
        onClick={handleShare}
      >
        <Share2 className="h-4 w-4" />
        {t("share")}
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Share2 className="h-4 w-4" />
          {t("share")}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={copyToClipboard}
          className="gap-2 cursor-pointer"
        >
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {t("copyLink")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                url
              )}`,
              "_blank"
            )
          }
          className="cursor-pointer"
        >
          {t("shareOnFacebook")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            window.open(
              `https://twitter.com/intent/tweet?url=${encodeURIComponent(
                url
              )}&text=${encodeURIComponent(propertyTitle)}`,
              "_blank"
            )
          }
          className="cursor-pointer"
        >
          {t("shareOnTwitter")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            window.open(
              `https://wa.me/?text=${encodeURIComponent(
                `${propertyTitle} ${url}`
              )}`,
              "_blank"
            )
          }
          className="cursor-pointer"
        >
          {t("shareOnWhatsApp")}
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            window.open(
              `mailto:?subject=${encodeURIComponent(
                propertyTitle
              )}&body=${encodeURIComponent(
                `${t("share")} ${propertyTitle}: ${url}`
              )}`,
              "_blank"
            )
          }
          className="cursor-pointer"
        >
          {t("shareViaEmail")}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
