import { useLocation, Link, Navigate } from "react-router-dom";
import { CheckCircle, MessageCircle, Copy } from "lucide-react";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { OrderResponse, BANK_DETAILS, WHATSAPP_NUMBER } from "@/types";
import { formatPrice } from "@/services/api";

export default function OrderConfirmation() {
  const location = useLocation();
  const order = location.state?.order as OrderResponse | undefined;

  if (!order) {
    return <Navigate to="/" replace />;
  }

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    toast.success("Order number copied!");
  };

  const sendWhatsApp = () => {
    const message = encodeURIComponent(
      `Hello! I just placed an order.\n\nOrder Number: ${order.orderNumber}\nTotal: ${formatPrice(order.totalAmount)}\n\nI have completed the bank transfer. Please confirm.`
    );
    window.open(
      `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}?text=${message}`,
      "_blank"
    );
  };

  return (
    <Layout>
      <div className="container max-w-lg py-8 md:py-12">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-whatsapp/10">
            <CheckCircle className="h-10 w-10 text-whatsapp" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">
            Order Placed Successfully!
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Your order has been received. Please complete payment to proceed.
          </p>
        </div>

        {/* Order Number */}
        <div className="mt-6 rounded-xl border border-border bg-card p-5 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Order Number
          </p>
          <div className="mt-2 flex items-center justify-center gap-2">
            <span className="font-display text-2xl font-bold text-primary">{order.orderNumber}</span>
            <button
              onClick={copyOrderNumber}
              className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              aria-label="Copy order number"
            >
              <Copy className="h-4 w-4" />
            </button>
          </div>
          <div className="mt-2 inline-flex items-center gap-1 rounded-full bg-accent/20 px-3 py-1 text-xs font-medium text-accent-foreground">
            ⏳ Pending Payment
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-4 rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-base font-semibold text-card-foreground">Order Items</h2>
          <div className="mt-3 space-y-2">
            {order.items.map(item => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {item.productName} × {item.quantity}
                </span>
                <span className="font-medium text-card-foreground">
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-2">
              <div className="flex justify-between font-bold text-card-foreground">
                <span>Total</span>
                <span className="text-accent">{formatPrice(order.totalAmount)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bank Details */}
        <div className="mt-4 rounded-xl border-2 border-primary bg-secondary p-5">
          <h2 className="font-display text-base font-semibold text-secondary-foreground">
            💳 Bank Transfer Details
          </h2>
          <div className="mt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Bank</span>
              <span className="font-medium text-secondary-foreground">{BANK_DETAILS.bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Name</span>
              <span className="font-medium text-secondary-foreground">{BANK_DETAILS.accountName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Number</span>
              <span className="font-medium text-secondary-foreground">{BANK_DETAILS.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-bold text-accent">{formatPrice(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-4 rounded-xl border border-accent/30 bg-accent/10 p-5">
          <h3 className="text-sm font-semibold text-foreground">📋 Next Steps</h3>
          <ol className="mt-2 space-y-2 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">1</span>
              Transfer the exact amount to the bank account above
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">2</span>
              Send your order number <strong className="text-foreground">{order.orderNumber}</strong> via WhatsApp
            </li>
            <li className="flex gap-2">
              <span className="flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">3</span>
              Wait for payment confirmation from our team
            </li>
          </ol>
        </div>

        {/* WhatsApp CTA */}
        <button
          onClick={sendWhatsApp}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-whatsapp px-6 py-3 text-sm font-semibold text-whatsapp-foreground transition-transform hover:scale-[1.02] active:scale-95"
        >
          <MessageCircle className="h-5 w-5" fill="currentColor" />
          Send Order Number via WhatsApp
        </button>

        <Link
          to="/shop"
          className="mt-3 block text-center text-sm text-primary underline"
        >
          Continue Shopping
        </Link>
      </div>
    </Layout>
  );
}
