import { Link } from "react-router-dom";
import { Product } from "@/types";
import { formatPrice } from "@/services/api";
import { ShoppingBag, Clock } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";
import MediaRenderer from "@/components/MediaRenderer";
import { useEffect, useState } from "react";

interface ProductCardProps {
  product: Product;
}

const FALLBACK_IMAGE =
  "https://via.placeholder.com/400x400?text=No+Image";

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const [timeDisplay, setTimeDisplay] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<'days' | 'countdown' | null>(null);

  const formatCountdown = (seconds: number): string => {
    if (seconds <= 0) return "00:00:00";

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      secs.toString().padStart(2, '0')
    ].join(':');
  };

  const formatDaysRemaining = (seconds: number): string => {
    const days = Math.ceil(seconds / 86400); // 86400 seconds in a day
    return `${days} day${days > 1 ? 's' : ''} left`;
  };

  useEffect(() => {
    if (product.discountRemainingSeconds && product.discountRemainingSeconds > 0) {
      // Determine initial display mode
      if (product.discountRemainingSeconds > 86400) { // More than 24 hours
        setDisplayMode('days');
        setTimeDisplay(formatDaysRemaining(product.discountRemainingSeconds));
      } else {
        setDisplayMode('countdown');
        setTimeDisplay(formatCountdown(product.discountRemainingSeconds));
      }

      const interval = setInterval(() => {
        setTimeDisplay(prev => {
          if (!prev) return null;

          // Get current seconds remaining
          const currentSeconds = (() => {
            if (displayMode === 'days') {
              // Parse days from string like "X days left"
              const days = parseInt(prev.split(' ')[0]);
              return days * 86400;
            } else {
              // Parse from countdown format "HH:MM:SS"
              const [hours, minutes, seconds] = prev.split(':').map(Number);
              return hours * 3600 + minutes * 60 + seconds;
            }
          })();

          const newSeconds = currentSeconds - 1;

          if (newSeconds <= 0) {
            clearInterval(interval);
            return "00:00:00";
          }

          // Switch to countdown mode if crossing below 24 hours
          if (displayMode === 'days' && newSeconds <= 86400) {
            setDisplayMode('countdown');
            return formatCountdown(newSeconds);
          }

          // Continue in current mode
          return displayMode === 'days' 
            ? formatDaysRemaining(newSeconds)
            : formatCountdown(newSeconds);
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [product.discountRemainingSeconds, displayMode]);

  // Get first media item (image or video)
  const getFirstMedia = () => {
    if (product.media && product.media.length > 0) {
      return product.media[0];
    }
    if (product.images && product.images.length > 0) {
      return { url: product.images[0], type: 'IMAGE' as const };
    }
    return { url: FALLBACK_IMAGE, type: 'IMAGE' as const };
  };

  const firstMedia = getFirstMedia();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  // Check if this is a discounted product (has originalPrice and it's different from price)
  const hasDiscount = product.originalPrice !== undefined && 
                      product.originalPrice !== product.price && 
                      product.originalPrice > product.price;

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <MediaRenderer
          src={firstMedia.url}
          type={firstMedia.type}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          showControls={false}
        />

        {/* Time Display Badge (Days or Countdown) */}
        {timeDisplay && timeDisplay !== "00:00:00" && (
          <div className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1.5 text-xs font-bold text-destructive-foreground flex items-center gap-1.5 shadow-lg">
            <Clock className="h-3 w-3" />
            <span>{timeDisplay}</span>
          </div>
        )}

        {/* Discount Percentage Badge */}
        {hasDiscount && timeDisplay && timeDisplay !== "00:00:00" && (
          <div className="absolute left-3 top-14 rounded-full bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground">
            {product.discountType === 'FIXED' 
              ? `₦${product.discountValue} off`
              : `${product.discountValue}% off`
            }
          </div>
        )}

        {!product.inStock && (
          <div className="absolute inset-0 flex items-center justify-center bg-foreground/50">
            <span className="rounded-full bg-card px-3 py-1 text-sm font-semibold text-destructive">
              Out of Stock
            </span>
          </div>
        )}

        {product.inStock && (
          <button
            onClick={handleAddToCart}
            className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground opacity-0 shadow-lg transition-all group-hover:opacity-100 hover:bg-primary/90 active:scale-95"
          >
            <ShoppingBag className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="p-3">
        <h3 className="truncate text-sm font-medium">{product.name}</h3>
        <div className="mt-1 flex items-center justify-between">
          {hasDiscount ? (
            <div className="flex items-center gap-2">
              <p className="text-xs text-bold line-through text-accent/70">
                {formatPrice(product.originalPrice)}
              </p>
              <p className="font-display text-base font-bold text-accent">
                {formatPrice(product.price)}
              </p>
            </div>
          ) : (
            <p className="font-display text-base font-bold text-accent">
              {formatPrice(product.price)}
            </p>
          )}
          {product.inStock && (
            <span className="text-xs text-whatsapp">In Stock</span>
          )}
        </div>
      </div>
    </Link>
  );
}