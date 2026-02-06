import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { useCart } from "@/contexts/CartContext";
import { createOrder, formatPrice } from "@/services/api";

const checkoutSchema = z.object({
  customerName: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  customerPhone: z
    .string()
    .trim()
    .min(10, "Enter a valid phone number")
    .max(15)
    .regex(/^[+\d\s()-]+$/, "Enter a valid phone number"),
});

export default function Checkout() {
  const { items, totalAmount, clearCart } = useCart();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ customerName: "", customerPhone: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (items.length === 0) {
    navigate("/cart");
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = checkoutSchema.safeParse(form);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) fieldErrors[err.path[0] as string] = err.message;
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    try {
      const order = await createOrder({
        customerName: result.data.customerName,
        customerPhone: result.data.customerPhone,
        items: items.map(item => ({
          productId: item.product.id,
          quantity: item.quantity,
        })),
      });
      clearCart();
      navigate(`/order-confirmation/${order.orderNumber}`, { state: { order } });
    } catch {
      toast.error("Failed to place order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout>
      <div className="container max-w-lg py-6 md:py-10">
        <h1 className="font-display text-2xl font-bold text-foreground">Checkout</h1>

        {/* Order Summary */}
        <div className="mt-6 rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-base font-semibold text-card-foreground">Order Summary</h2>
          <div className="mt-3 space-y-2">
            {items.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm">
                <span className="truncate pr-2 text-muted-foreground">
                  {product.name} × {quantity}
                </span>
                <span className="font-medium text-card-foreground">
                  {formatPrice(product.price * quantity)}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span className="text-accent">{formatPrice(totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label htmlFor="name" className="mb-1 block text-sm font-medium text-foreground">
              Full Name
            </label>
            <input
              id="name"
              type="text"
              value={form.customerName}
              onChange={e => setForm(f => ({ ...f, customerName: e.target.value }))}
              placeholder="Enter your full name"
              className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {errors.customerName && (
              <p className="mt-1 text-xs text-destructive">{errors.customerName}</p>
            )}
          </div>

          <div>
            <label htmlFor="phone" className="mb-1 block text-sm font-medium text-foreground">
              Phone Number (WhatsApp)
            </label>
            <input
              id="phone"
              type="tel"
              value={form.customerPhone}
              onChange={e => setForm(f => ({ ...f, customerPhone: e.target.value }))}
              placeholder="+234..."
              className="w-full rounded-lg border border-input bg-card px-4 py-3 text-sm text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-ring"
            />
            {errors.customerPhone && (
              <p className="mt-1 text-xs text-destructive">{errors.customerPhone}</p>
            )}
          </div>

          {/* Payment Notice */}
          <div className="rounded-lg border border-accent/30 bg-accent/10 p-4">
            <p className="text-sm font-medium text-foreground">💳 Payment via Bank Transfer Only</p>
            <p className="mt-1 text-xs text-muted-foreground">
              After placing your order, you'll receive bank account details to complete payment. 
              No online payment gateway is used.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02] active:scale-95 disabled:opacity-60"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Placing Order…
              </>
            ) : (
              "Place Order"
            )}
          </button>
        </form>
      </div>
    </Layout>
  );
}
