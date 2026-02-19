import { useLocation, Link, Navigate, useParams } from "react-router-dom";
import { CheckCircle, MessageCircle, Copy } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import Layout from "@/components/Layout";
import { OrderResponse, WHATSAPP_NUMBER } from "@/types";
import { formatPrice, fetchOrder, fetchProduct, fetchAccountInfo } from "@/services/api";

export default function OrderConfirmation() {
  const location = useLocation();
  const { orderNumber } = useParams<{ orderNumber: string }>();
  const [copied, setCopied] = useState(false);
  const [productNames, setProductNames] = useState<Record<string, string>>({});
  
  // Get order from navigation state if available
  const stateOrder = location.state?.order as OrderResponse | undefined;
  const customerName = location.state?.customerName as string | undefined;
  const customerPhone = location.state?.customerPhone as string | undefined;

  
  // Fetch order if not in state (e.g., on page refresh)
  const { data: fetchedOrder, isLoading, error } = useQuery({
    queryKey: ["order", orderNumber],
    queryFn: () => fetchOrder(orderNumber!),
    enabled: !stateOrder && !!orderNumber,
    retry: 1,
  });

  // Use state order if available, otherwise use fetched order
  const order = stateOrder || fetchedOrder;

  const [accountInfo, setAccountInfo] = useState(null);

  useEffect(() => {
    async function checkAccountInfo() {
      try {
        const data = await fetchAccountInfo();
        setAccountInfo(data);
      } catch (error) {
        console.error("Failed to fetch account info:", error);
        toast.error("Unable to load payment details. Please try again later.");
      }
    }
    checkAccountInfo();
  }, []);

  // Fetch product names for all items
  useEffect(() => {
    async function fetchProductNames() {
      if (!order?.items) return;
      
      const names: Record<string, string> = {};
      
      await Promise.all(
        order.items.map(async (item) => {
          try {
            const product = await fetchProduct(item.productId);
            names[item.productId] = product.name;
          } catch (error) {
            console.error(`Failed to fetch product ${item.productId}:`, error);
            names[item.productId] = `Product (${item.productId.slice(0, 8)})`;
          }
        })
      );
      
      setProductNames(names);
    }

    fetchProductNames();
  }, [order]);

  // Show loading state while fetching
  if (isLoading) {
    return (
      <Layout>
        <div className="container max-w-lg py-8 md:py-12 text-center">
          <div className="animate-pulse">
            <div className="mx-auto h-16 w-16 rounded-full bg-muted"></div>
            <div className="mt-4 h-8 w-48 mx-auto rounded bg-muted"></div>
            <div className="mt-2 h-4 w-64 mx-auto rounded bg-muted"></div>
          </div>
        </div>
      </Layout>
    );
  }

  // If no order and error, show not found
  if (!order && error) {
    return (
      <Layout>
        <div className="container max-w-lg py-8 md:py-12 text-center">
          <p className="text-muted-foreground">Order not found.</p>
          <Link to="/" className="mt-4 inline-block text-primary underline">
            Go to Home
          </Link>
        </div>
      </Layout>
    );
  }

  // If still no order, redirect
  if (!order) {
    return <Navigate to="/" replace />;
  }

  const copyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    toast.success("Order number copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const sendWhatsApp = () => {
  // Create a formatted list of items
  const itemsList = order.items
    .map(item => {
      const productName = productNames[item.productId] || `Product (${item.productId.slice(0, 8)})`;
      return `• ${productName} × ${item.quantity} - ${formatPrice(item.priceAtOrder * item.quantity)}`;
    })
    .join('\n');

  const message = encodeURIComponent(
    `Hello, I just placed an order on Jossy-Diva Collections and would like to confirm it.\n\n` +
    `Order Number: ${order.orderNumber}\n` +
    `Customer Name: ${customerName}\n` +
    `Phone Number: ${customerPhone}\n` +
    `Total Amount: ${formatPrice(order.totalAmount)}\n\n` +
    `ITEMS ORDERED:\n` +
    `${itemsList}\n\n` +
    `I have completed the bank transfer and will send the payment receipt shortly.\n` +
    `Please confirm once you've received the payment.\n\n` +
    `Thank you!`
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
            ⏳ {order.status === "pending_payment" ? "Pending Payment" : order.status}
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-4 rounded-xl border border-border bg-card p-5">
          <h2 className="font-display text-base font-semibold text-card-foreground">Order Items</h2>
          <div className="mt-3 space-y-2">
            {order.items.map(item => (
              <div key={item.productId} className="flex justify-between text-sm">
                <span className="text-muted-foreground">
                  {productNames[item.productId] || `Loading...`} × {item.quantity}
                </span>
                <span className="font-medium text-card-foreground">
                  {formatPrice(item.priceAtOrder * item.quantity)}
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
              <span className="font-medium text-secondary-foreground">{accountInfo?.bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Name</span>
              <span className="font-medium text-secondary-foreground">{accountInfo?.accountName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Account Number</span>
              <span className="font-medium text-secondary-foreground">{accountInfo?.accountNumber}</span>
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