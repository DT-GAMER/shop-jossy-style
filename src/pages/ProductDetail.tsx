import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Minus, Plus, ShoppingBag, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { fetchProduct, formatPrice } from "@/services/api";
import { useCart } from "@/contexts/CartContext";
import { CATEGORY_LABELS } from "@/types";
import MediaRenderer from "@/components/MediaRenderer";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: () => fetchProduct(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="container py-20 text-center">
          <p className="text-muted-foreground">Product not found.</p>
          <Link to="/shop" className="mt-4 inline-block text-primary underline">
            Back to Shop
          </Link>
        </div>
      </Layout>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${product.name} added to cart`);
  };

  // Get media array with type information
  const mediaItems = product.media && product.media.length > 0
    ? product.media
    : (product.images || []).map(url => ({ url, type: 'IMAGE' as const }));

  const currentMedia = mediaItems[currentMediaIndex] || { url: "/placeholder-image.jpg", type: 'IMAGE' };

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex((prev) => (prev - 1 + mediaItems.length) % mediaItems.length);
  };

  return (
    <Layout>
      <div className="container py-6 md:py-10">
        <Link
          to="/shop"
          className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Shop
        </Link>

        <div className="grid gap-8 md:grid-cols-2">
          {/* Media Gallery */}
          <div className="overflow-hidden rounded-xl bg-muted">
            <div className="relative aspect-square">
              <MediaRenderer
                src={currentMedia.url}
                type={currentMedia.type}
                alt={product.name}
                className="h-full w-full object-cover"
                showControls={true}
              />
              {mediaItems.length > 1 && (
                <>
                  <button
                    onClick={prevMedia}
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                    aria-label="Previous media"
                  >
                    <ArrowLeft className="h-4 w-4" />
                  </button>
                  <button
                    onClick={nextMedia}
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-2 text-white transition-colors hover:bg-black/70"
                    aria-label="Next media"
                  >
                    <ArrowLeft className="h-4 w-4 rotate-180" />
                  </button>

                  {/* Media indicators */}
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1">
                    {mediaItems.map((media, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentMediaIndex(index)}
                        className={`h-1.5 w-1.5 rounded-full transition-all ${index === currentMediaIndex
                            ? "w-4 bg-white"
                            : "bg-white/50 hover:bg-white/80"
                          }`}
                        aria-label={`Go to media ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Video indicator for thumbnails */}
              {mediaItems.length > 1 && (
                <div className="absolute top-4 right-4 flex gap-1">
                  {mediaItems.map((media, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${media.type === 'VIDEO' ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                      title={media.type === 'VIDEO' ? 'Video' : 'Image'}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Product Details */}
          <div className="flex flex-col">
            <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {CATEGORY_LABELS[product.category]}
            </span>
            <h1 className="mt-2 font-display text-2xl font-bold text-foreground md:text-3xl">
              {product.name}
            </h1>
            <p className="mt-2 font-display text-2xl font-bold text-accent">
              {formatPrice(product.price)}
            </p>

            <div className="mt-3">
              {product.inStock ? (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-whatsapp">
                  <span className="h-2 w-2 rounded-full bg-whatsapp" />
                  In Stock ({product.stockQuantity} available)
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-sm font-medium text-destructive">
                  <span className="h-2 w-2 rounded-full bg-destructive" />
                  Out of Stock
                </span>
              )}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
              {product.description}
            </p>

            {product.inStock && (
              <div className="mt-6 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-foreground">Quantity:</span>
                  <div className="flex items-center rounded-lg border border-border">
                    <button
                      onClick={() => setQuantity(q => Math.max(1, q - 1))}
                      className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                      disabled={quantity <= 1}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="flex h-10 w-12 items-center justify-center text-sm font-medium">
                      {quantity}
                    </span>
                    <button
                      onClick={() => setQuantity(q => Math.min(product.stockQuantity, q + 1))}
                      className="flex h-10 w-10 items-center justify-center text-muted-foreground transition-colors hover:text-foreground"
                      disabled={quantity >= product.stockQuantity}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Add to Cart
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}