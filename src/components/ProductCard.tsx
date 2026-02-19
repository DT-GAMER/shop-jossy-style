import { Link } from "react-router-dom";
import { Product } from "@/types";
import { formatPrice } from "@/services/api";
import { ShoppingBag } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
}

const FALLBACK_IMAGE =
  "https://via.placeholder.com/400x400?text=No+Image";

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();

  const imageSrc =
    product.images && product.images.length > 0
      ? product.images[0]
      : FALLBACK_IMAGE;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addToCart(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link
      to={`/product/${product.id}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={imageSrc}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

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
          {product.originalPrice !== undefined && product.originalPrice !== product.price ? (
            <div className="flex gap-2">
              <p className="text-xs text-bold line-through text-accent/70 mt-1">
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
