export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  images: string[];
  description: string;
  inStock: boolean;
  stockQuantity: number;
  originalPrice?: number;
}

export type ProductCategory = string;

export const CATEGORY_LABELS: Record<string, string> = {};

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface OrderRequest {
  customerName: string;
  customerPhone: string;
  items: { productId: string; quantity: number }[];
}

export interface OrderResponse {
  orderId: string;
  orderNumber: string;
  status: "pending_payment";
  totalAmount: number;
  items: { productId: string; productName: string; quantity: number; price: number; priceAtOrder?: number; }[];
}

export const WHATSAPP_NUMBER = "+2349049264366";
export const BANK_DETAILS = {
  bankName: "First Bank of Nigeria",
  accountName: "Jossy-Diva Collections",
  accountNumber: "1234567890",
};