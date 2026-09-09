import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { useUserAuth } from "@/hooks/useUserAuth";

interface EnhancedFavoriteButtonProps {
  productId: string;
  size?: "sm" | "md" | "lg";
  className?: string;
  showText?: boolean;
  variant?: "default" | "outline" | "ghost";
  onStateChange?: (isFavorited: boolean) => void;
}

const EnhancedFavoriteButton: React.FC<EnhancedFavoriteButtonProps> = ({
  productId,
  size = "sm",
  className = "",
  showText = false,
  variant = "outline",
  onStateChange,
}) => {
  const { currentUser } = useUserAuth();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (currentUser?.id) {
      initializeFavoriteState();
    }
  }, [currentUser?.id, productId]);

  const initializeFavoriteState = async () => {
    if (!currentUser?.id) return;

    try {
      const { default: EnhancedFavoritesManager } = await import(
        "../services/EnhancedFavoritesManager"
      );

      const activeFavorites = EnhancedFavoritesManager.getActiveFavorites(
        currentUser.id,
      );
      const favorited = activeFavorites.includes(productId);
      setIsFavorited(favorited);
    } catch (error) {
      console.error("Error initializing favorite state:", error);
    }
  };

  const handleToggleFavorite = async (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (!currentUser?.id) {
      alert("Please sign in to add favorites");
      return;
    }

    setIsLoading(true);

    try {
      const { default: EnhancedFavoritesManager } = await import(
        "../services/EnhancedFavoritesManager"
      );

      const result = await EnhancedFavoritesManager.toggleFavorite(
        currentUser.id,
        productId,
        {
          x: event.clientX,
          y: event.clientY,
          buttonElement: event.currentTarget as HTMLElement,
          page: window.location.pathname,
        },
      );

      if (result.success) {
        setIsFavorited(result.newState);
        onStateChange?.(result.newState);
        console.log(
          `✅ Enhanced Favorite Button: ${result.newState ? "Added" : "Removed"} ${productId}`,
        );
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const buttonSize =
    size === "sm" ? "h-8 w-8" : size === "md" ? "h-10 w-10" : "h-12 w-12";
  const iconSize =
    size === "sm" ? "w-4 h-4" : size === "md" ? "w-5 h-5" : "w-6 h-6";

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handleToggleFavorite}
      disabled={isLoading}
      className={`${showText ? "" : `${buttonSize} p-0`} ${
        isFavorited ? "text-red-500" : "text-gray-400"
      } ${className}`}
      data-favorite-button="true"
      data-product-id={productId}
      data-favorited={isFavorited}
      aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}
    >
      <Heart
        className={`heart-icon ${iconSize} ${
          isFavorited ? "fill-current text-red-500" : "text-gray-400"
        } ${isLoading ? "animate-pulse" : ""}`}
      />
      {showText && (
        <span className="ml-2">
          {isFavorited ? "Favorited" : "Add to Favorites"}
        </span>
      )}
    </Button>
  );
};

export default EnhancedFavoriteButton;
