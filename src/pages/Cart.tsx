import { Link } from "react-router-dom";
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Layout from "@/components/Layout";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/services/api";

export default function Cart() {
  const { items, updateQuantity, removeFromCart, totalAmount } = useCart();

  if (items.length === 0) {
    return (
      <Layout>
        <div className="container flex flex-col items-center justify-center py-20 text-center">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/40" />
          <h1 className="mt-4 font-display text-xl font-bold text-foreground">Your cart is empty</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Add some items to get started
          </p>
          <Link
            to="/shop"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
          >
            Continue Shopping
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container py-6 md:py-10">
        <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">
          Shopping Cart
        </h1>

        <div className="mt-6 grid gap-6 lg:grid-cols-3">
          {/* Cart Items */}
          <div className="space-y-3 lg:col-span-2">
            {items.map(({ product, quantity }) => (
              <div
                key={product.id}
                className="flex gap-4 rounded-xl border border-border bg-card p-4"
              >
                <Link to={`/product/${product.id}`}>
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-20 w-20 flex-shrink-0 rounded-lg object-cover"
                  />
                </Link>
                <div className="flex flex-1 flex-col">
                  <div className="flex items-start justify-between">
                    <div>
                      <Link
                        to={`/product/${product.id}`}
                        className="text-sm font-medium text-card-foreground hover:text-primary"
                      >
                        {product.name}
                      </Link>
                      <p className="text-sm font-bold text-accent">{formatPrice(product.price)}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(product.id)}
                      className="text-muted-foreground transition-colors hover:text-destructive"
                      aria-label={`Remove ${product.name}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-auto flex items-center gap-2 pt-2">
                    <div className="flex items-center rounded-lg border border-border">
                      <button
                        onClick={() => updateQuantity(product.id, quantity - 1)}
                        className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="flex h-8 w-8 items-center justify-center text-xs font-medium">
                        {quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(product.id, quantity + 1)}
                        className="flex h-8 w-8 items-center justify-center text-muted-foreground hover:text-foreground"
                        disabled={quantity >= product.stockQuantity}
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>
                    <span className="ml-auto text-sm font-bold text-card-foreground">
                      {formatPrice(product.price * quantity)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="h-fit rounded-xl border border-border bg-card p-5">
            <h2 className="font-display text-lg font-bold text-card-foreground">Order Summary</h2>
            <div className="mt-4 space-y-2 text-sm">
              {items.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-muted-foreground">
                  <span className="truncate pr-2">
                    {product.name} × {quantity}
                  </span>
                  <span>{formatPrice(product.price * quantity)}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 border-t border-border pt-4">
              <div className="flex justify-between text-base font-bold text-card-foreground">
                <span>Total</span>
                <span className="text-accent">{formatPrice(totalAmount)}</span>
              </div>
            </div>
            <Link
              to="/checkout"
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95"
            >
              Proceed to Checkout
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
