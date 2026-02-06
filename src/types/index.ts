export interface Product {
  id: string;
  name: string;
  price: number;
  category: ProductCategory;
  images: string[];
  description: string;
  inStock: boolean;
  stockQuantity: number;
}

export type ProductCategory = 
  | "clothes" 
  | "shoes" 
  | "perfumes" 
  | "creams" 
  | "watches" 
  | "jewelry";

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
  items: { productId: string; productName: string; quantity: number; price: number }[];
}

export const CATEGORY_LABELS: Record<ProductCategory, string> = {
  clothes: "Clothes",
  shoes: "Shoes",
  perfumes: "Perfumes",
  creams: "Creams",
  watches: "Watches",
  jewelry: "Jewelry",
};

export const WHATSAPP_NUMBER = "+2349049264366";
export const BANK_DETAILS = {
  bankName: "First Bank of Nigeria",
  accountName: "Jossy-Diva Collections",
  accountNumber: "1234567890",
};
