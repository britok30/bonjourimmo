"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@clerk/nextjs";
import { useTranslations } from "next-intl";

interface FavoriteButtonProps {
  listingId: number;
  initialFavorited?: boolean; // Optional initial state
}

export function FavoriteButton({
  listingId,
  initialFavorited,
}: FavoriteButtonProps) {
  const [isFavorited, setIsFavorited] = useState<boolean | null>(
    initialFavorited ?? null
  );
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { userId } = useAuth();
  const t = useTranslations("favoriteButton");

  useEffect(() => {
    if (!userId || initialFavorited !== undefined) return; // Skip fetching if state is provided

    const fetchFavoriteStatus = async () => {
      try {
        const response = await fetch(
          `/api/favorites/check?listingId=${listingId}`
        );
        const data = await response.json();
        setIsFavorited(data.isFavorited);
      } catch (error) {
        console.error("Error fetching favorite status:", error);
      }
    };

    fetchFavoriteStatus();
  }, [listingId, userId, initialFavorited]);

  const toggleFavorite = async () => {
    if (!userId) {
      toast({
        description: t("signInRequired"),
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    const previousState = isFavorited;

    try {
      setIsFavorited(!isFavorited); // Optimistic update
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ listingId }),
      });

      if (!response.ok) throw new Error("Failed to toggle favorite");

      const data = await response.json();
      toast({
        description: data.favorited ? t("add") : t("remove"),
      });
    } catch (error) {
      setIsFavorited(previousState); // Revert on failure
      toast({
        description: t("error"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFavorited === null) {
    return (
      <Button variant="outline" size="icon" className="h-8 w-8" disabled>
        <Heart className="h-4 w-4" />
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="h-8 w-8"
      disabled={isLoading}
      onClick={toggleFavorite}
    >
      <Heart
        className={`h-4 w-4 ${isFavorited ? "fill-primary text-primary" : ""}`}
      />
    </Button>
  );
}
