"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

interface DeleteButtonProps {
  listingId: number;
}

export function DeleteButton({ listingId }: DeleteButtonProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const t = useTranslations("deleteButton");

  const handleDelete = async () => {
    if (!confirm(t("confirmation"))) return;

    try {
      setIsDeleting(true);
      const response = await fetch(`/api/listings/${listingId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(t("errorDescription"));
      }

      toast({
        title: t("successTitle"),
        description: t("successDescription"),
      });

      router.refresh();
    } catch (error) {
      toast({
        title: t("errorTitle"),
        description: t("errorDescription"),
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Button
      variant="destructive"
      size="icon"
      onClick={handleDelete}
      disabled={isDeleting}
      className="h-8 w-8"
    >
      <Trash2 className="h-4 w-4" />
    </Button>
  );
}
