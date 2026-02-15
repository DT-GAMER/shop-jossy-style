// services/api.ts
import { Product, ProductCategory, OrderRequest, OrderResponse } from "@/types";

// Base API URL - replace with actual API endpoint
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://magic.myradture.com/api/v1";

// Mock product data for development
const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    name: "Elegant Silk Blouse",
    price: 15000,
    category: "clothes",
    images: ["https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400"],
    description: "Beautiful silk blouse perfect for any occasion. Lightweight and comfortable.",
    inStock: true,
    stockQuantity: 12,
  },
  {
    id: "2",
    name: "Classic Denim Jacket",
    price: 22000,
    category: "clothes",
    images: ["https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400"],
    description: "Timeless denim jacket that pairs with everything in your wardrobe.",
    inStock: true,
    stockQuantity: 8,
  },
  {
    id: "3",
    name: "Designer Stiletto Heels",
    price: 35000,
    category: "shoes",
    images: ["https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400"],
    description: "Stunning stiletto heels for an elegant evening look.",
    inStock: true,
    stockQuantity: 5,
  },
  {
    id: "4",
    name: "Leather Ankle Boots",
    price: 28000,
    category: "shoes",
    images: ["https://images.unsplash.com/photo-1608256246200-53e635b5b65f?w=400"],
    description: "Premium leather ankle boots with comfortable cushioned soles.",
    inStock: false,
    stockQuantity: 0,
  },
  {
    id: "5",
    name: "Floral Eau de Parfum",
    price: 18000,
    category: "perfumes",
    images: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=400"],
    description: "A captivating floral fragrance that lasts all day. Notes of rose and jasmine.",
    inStock: true,
    stockQuantity: 20,
  },
  {
    id: "6",
    name: "Luxury Body Cream",
    price: 8500,
    category: "creams",
    images: ["https://images.unsplash.com/photo-1611930022073-b7a4ba5fcccd?w=400"],
    description: "Rich moisturizing body cream with shea butter and vitamin E.",
    inStock: true,
    stockQuantity: 30,
  },
  {
    id: "7",
    name: "Gold Chain Watch",
    price: 45000,
    category: "watches",
    images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=400"],
    description: "Elegant gold-toned watch with a classic chain bracelet design.",
    inStock: true,
    stockQuantity: 3,
  },
  {
    id: "8",
    name: "Crystal Pendant Necklace",
    price: 12000,
    category: "jewelry",
    images: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=400"],
    description: "Sparkling crystal pendant on a delicate silver chain.",
    inStock: true,
    stockQuantity: 15,
  },
  {
    id: "9",
    name: "Ankara Print Dress",
    price: 19500,
    category: "clothes",
    images: ["https://images.unsplash.com/photo-1590400516695-36e8bfa97eec?w=400"],
    description: "Vibrant Ankara print dress, perfect for celebrations and events.",
    inStock: true,
    stockQuantity: 7,
  },
  {
    id: "10",
    name: "Pearl Drop Earrings",
    price: 9500,
    category: "jewelry",
    images: ["https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400"],
    description: "Classic pearl drop earrings that add sophistication to any outfit.",
    inStock: true,
    stockQuantity: 25,
  },
  {
    id: "11",
    name: "Oud Wood Cologne",
    price: 25000,
    category: "perfumes",
    images: ["https://images.unsplash.com/photo-1594035910387-fea081e83206?w=400"],
    description: "Rich and woody cologne with deep oud notes. Long-lasting and masculine.",
    inStock: true,
    stockQuantity: 10,
  },
  {
    id: "12",
    name: "Sneaker Collection",
    price: 16000,
    category: "shoes",
    images: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400"],
    description: "Trendy sneakers perfect for casual and sporty outfits.",
    inStock: true,
    stockQuantity: 14,
  },
];

// Flag for using mock data vs real API
const USE_MOCK = false;

function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ============ PRODUCTS ENDPOINTS ============

export async function fetchProducts(category?: ProductCategory) {
  const params = new URLSearchParams();

  if (category) {
    params.append("category", category.toUpperCase());
  }

  const url = `${API_BASE_URL}/public/products${params.toString() ? `?${params}` : ""
    }`;

  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const raw = await res.json();

  const products = Array.isArray(raw) ? raw : raw.data ?? [];
  console.log(products)

  return products.map((p: any) => ({
    id: p.id,
    name: p.name,
    price: p.price,
    category: p.category?.toLowerCase(),
    description: p.description ?? "",
    images: Array.isArray(p.images)
      ? p.images
      : Array.isArray(p.media)
        ? p.media.map(item => item.url)
        : [],
    stockQuantity: Number(p.available ?? 0),
    inStock: Number(p.available ?? 0) > 0,
  }));
}

// Fetch a single product by ID
export async function fetchProduct(id: string): Promise<Product> {
  if (USE_MOCK) {
    await delay(200);
    const product = MOCK_PRODUCTS.find(p => p.id === id);
    if (!product) throw new Error("Product not found");
    return product;
  }

  const res = await fetch(`${API_BASE_URL}/public/products/${id}`);
  if (!res.ok) throw new Error("Failed to fetch product");
  
  const raw = await res.json();
  console.log('Raw product data:', raw);
  
  // Transform the product data to match the expected format
  return {
    id: raw.data.id,
    name: raw.data.name,
    price: raw.data.price,
    category: raw.data.category?.toLowerCase(),
    description: raw.data.description ?? "",
    // Transform images/media to array of URL strings
    images: Array.isArray(raw.data.images)
      ? raw.data.images
      : Array.isArray(raw.data.media)
        ? raw.data.media.map((item: any) => item.url)
        : [],
    // Also keep the images array for the component
    media: Array.isArray(raw.data.images)
      ? raw.data.images
      : Array.isArray(raw.data.media)
        ? raw.data.media.map((item: any) => item.url)
        : [],
    stockQuantity: Number(raw.data.available ?? 0),
    inStock: Number(raw.data.available ?? 0) > 0,
  };
}


export async function createProduct(product: Omit<Product, 'id'>): Promise<Product> {
  if (USE_MOCK) {
    await delay(500);
    const newProduct = {
      ...product,
      id: crypto.randomUUID(),
      inStock: product.stockQuantity > 0,
    };
    MOCK_PRODUCTS.push(newProduct);
    return newProduct;
  }

  const res = await fetch(`${API_BASE_URL}/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

export async function updateProduct(id: string, product: Partial<Product>): Promise<Product> {
  if (USE_MOCK) {
    await delay(500);
    const index = MOCK_PRODUCTS.findIndex(p => p.id === id);
    if (index === -1) throw new Error("Product not found");

    MOCK_PRODUCTS[index] = {
      ...MOCK_PRODUCTS[index],
      ...product,
      inStock: product.stockQuantity !== undefined ? product.stockQuantity > 0 : MOCK_PRODUCTS[index].inStock
    };
    return MOCK_PRODUCTS[index];
  }

  const res = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(product),
  });
  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

export async function fetchCategories(): Promise<string[]> {
  if (USE_MOCK) {
    await delay(200);
    const categories = [...new Set(MOCK_PRODUCTS.map(p => p.category))];
    return categories;
  }

  const res = await fetch(`${API_BASE_URL}/products/categories`);
  if (!res.ok) throw new Error("Failed to fetch categories");
  return res.json();
}

// ============ ORDERS ENDPOINTS ============
export async function createOrder(order: OrderRequest): Promise<OrderResponse> {
  if (USE_MOCK) {
    await delay(500);
    const orderNumber = `JDC-${Date.now().toString(36).toUpperCase()}`;
    const items = order.items.map(item => {
      const product = MOCK_PRODUCTS.find(p => p.id === item.productId)!;
      return {
        productId: item.productId,
        productName: product.name,
        quantity: item.quantity,
        price: product.price,
      };
    });
    return {
      orderId: crypto.randomUUID(),
      orderNumber,
      status: "pending_payment",
      totalAmount: items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      items,
    };
  }

  // Transform the order to match backend expectations
  const requestBody = {
    customerName: order.customerName,
    phone: order.customerPhone,  // Change from customerPhone to phone
    items: order.items.map(item => ({
      productId: item.productId,
      quantity: item.quantity
    }))
  };

  console.log('Sending order request:', requestBody); // For debugging

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
  console.log('Order creation response:', raw); // For debugging
  
  // Handle response wrapper if needed
  return raw.data || raw;
}

export async function fetchOrder(orderNumber: string): Promise<OrderResponse> {
  if (USE_MOCK) {
    await delay(200);
    // In mock mode, we'll try to find it in mock orders or create a plausible response
    // For now, we'll throw an error if not found in a real scenario
    throw new Error("Order not found in mock mode");
  }

  const res = await fetch(`${API_BASE_URL}/orders/${orderNumber}`);
  
  if (!res.ok) {
    if (res.status === 404) {
      throw new Error("Order not found");
    }
    throw new Error("Failed to fetch order");
  }
  
  const raw = await res.json();
  console.log('Raw order response:', raw);

  const orderData = raw.data || raw;
  
  return {
    orderId: orderData.orderId,
    orderNumber: orderData.orderNumber,
    status: orderData.status || "pending_payment",
    totalAmount: orderData.totalAmount,
    items: orderData.items || [],
  };
}
// ============ UTILITY FUNCTIONS ============

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
  }).format(amount);
}