import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import Layout from "@/components/Layout";
import ProductCard from "@/components/ProductCard";
import CategoryFilter from "@/components/CategoryFilter";
import { fetchProducts } from "@/services/api";

export default function Shop() {
  const [category, setCategory] = useState<string | null>(null);

  const { data: products, isLoading, error } = useQuery({
    queryKey: ["products", category],
    queryFn: () => fetchProducts(category ?? undefined),
  });

  console.log('Current category:', category);
  console.log('Products:', products);

  return (
    <Layout>
      <div className="container py-6 md:py-10">
        <div className="mb-6">
          <h1 className="font-display text-2xl font-bold text-foreground md:text-3xl">Shop</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Browse our collection of premium fashion items
          </p>
        </div>

        <CategoryFilter selected={category} onSelect={setCategory} />

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="py-20 text-center">
            <p className="text-destructive">Error loading products</p>
          </div>
        ) : products && products.length > 0 ? (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center">
            <p className="text-muted-foreground">No products found in this category.</p>
          </div>
        )}
      </div>
    </Layout>
  );
}