// services/api.ts
import { Product, ProductCategory, OrderRequest, OrderResponse } from "@/types";

// Base API URL - replace with actual API endpoint
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://magic.myradture.com/api/v1";

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============ PRODUCTS ENDPOINTS ============

export async function fetchProducts(category?: string) {
  const params = new URLSearchParams();

  if (category) {
    params.append("category", category.toUpperCase());
  }

  const url = `${API_BASE_URL}/public/products${params.toString() ? `?${params}` : ""}`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const raw = await res.json();

  const products = Array.isArray(raw) ? raw : raw.data ?? [];

  return products.map((p: any) => {
    // Process media with type information
    let media: { url: string; type: 'IMAGE' | 'VIDEO' }[] = [];
    let images: string[] = [];
    
    if (Array.isArray(p.media)) {
      media = p.media.map((item: any) => ({
        url: item.url,
        type: item.type || 'IMAGE',
      }));
      // For backward compatibility, create images array from IMAGE type media
      images = media.filter(m => m.type === 'IMAGE').map(m => m.url);
    } else if (Array.isArray(p.images)) {
      images = p.images;
      media = p.images.map((url: string) => ({ url, type: 'IMAGE' }));
    }

    return {
      id: p.id,
      name: p.name,
      originalPrice: p.originalPrice ? Number(p.originalPrice) : undefined,
      price: p.sellingPrice || p.price,
      category: p.category?.toLowerCase() || "",
      description: p.description ?? "",
      images: images,
      media: media,
      stockQuantity: Number(p.quantity || p.available || 0),
      inStock: Number(p.quantity || p.available || 0) > 0,
      discountType: p.discountType || null,
      discountValue: p.discountValue ? Number(p.discountValue) : undefined,
      discountRemainingSeconds: p.discountRemainingSeconds ? Number(p.discountRemainingSeconds) : undefined,
    };
  });
}

// Fetch a single product by ID
export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/public/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");

  const raw = await res.json();
  
  const productData = raw.data || raw;

  // Process media with type information
  let media: { url: string; type: 'IMAGE' | 'VIDEO' }[] = [];
  let images: string[] = [];
  
  if (Array.isArray(productData.media)) {
    media = productData.media.map((item: any) => ({
      url: item.url,
      type: item.type || 'IMAGE',
    }));
    images = media.filter(m => m.type === 'IMAGE').map(m => m.url);
  } else if (Array.isArray(productData.images)) {
    images = productData.images;
    media = productData.images.map((url: string) => ({ url, type: 'IMAGE' }));
  }

  return {
    id: productData.id,
    name: productData.name,
    price: productData.sellingPrice || productData.price,
    category: productData.category?.toLowerCase(),
    description: productData.description ?? "",
    images: images,
    media: media,
    stockQuantity: Number(productData.quantity || productData.available || 0),
    inStock: Number(productData.quantity || productData.available || 0) > 0,
  };
}


export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function fetchCategories(): Promise<{ value: string; label: string }[]> {
  const res = await fetch(`${API_BASE_URL}/products/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  
  const raw = await res.json();
  
  // The backend returns an array of strings directly
  const categoriesData = raw.data || raw;
  
  // Transform the array of strings into objects with value and label
  if (Array.isArray(categoriesData)) {
    return categoriesData.map((cat: string) => ({
      value: cat.toLowerCase(),
      label: cat.split('_').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
      ).join(' '),
    }));
  }
  
  return [];
}

// Helper function to get icon for category
function getCategoryIcon(category: string): string {
  const iconMap: Record<string, string> = {
    clothes: '👗',
    shoes: '👠',
    perfumes: '🧴',
    creams: '✨',
    watches: '⌚',
    jewelry: '💍',
    bags: '👜',
    men_clothings: '👔',
    women_clothings: '👚',
    skin_cares: '🧴',
  };
  return iconMap[category.toLowerCase()] || '📦';
}

// ============ ORDERS ENDPOINTS ============
export async function createOrder(order: OrderRequest): Promise<OrderResponse> {
  // Transform the order to match backend expectations
  const requestBody = {
    customerName: order.customerName,
    phone: order.customerPhone,  // Change from customerPhone to phone
    items: order.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }))
  };

  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error('Order creation failed:', res.status, errorText);
    throw new Error("Failed to create order");
  }

  const raw = await res.json();

  // Handle response wrapper if needed
  return raw.data || raw;
}

export async function fetchOrder(orderNumber: string): Promise<OrderResponse> {
  const res = await fetch(`${API_BASE_URL}/orders/${orderNumber}`);

  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Order not found");
    }
    throw new Error("Failed to fetch order");
  }

  const raw = await res.json();

  const orderData = raw.data || raw;

  return {
    orderId: orderData.orderId,
    orderNumber: orderData.orderNumber,
    status: orderData.status || "pending_payment",
    totalAmount: orderData.totalAmount,
    items: orderData.items || [],
  };
}

export async function fetchAccountInfo() {
  const res = await fetch(`${API_BASE_URL}/public/account-details`);
  if (!res.ok) throw new Error("Failed to fetch account info");
  
  const raw = await res.json();

  const accountData = raw.data;
  return accountData;
}
// ============ UTILITY FUNCTIONS ============

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}