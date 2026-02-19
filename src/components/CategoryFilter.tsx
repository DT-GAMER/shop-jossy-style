import { useEffect, useState } from "react";
import { fetchCategories } from "@/services/api";

interface CategoryFilterProps {
  selected: string | null;
  onSelect: (category: string | null) => void;
}

export default function CategoryFilter({ selected, onSelect }: CategoryFilterProps) {
  const [categories, setCategories] = useState<{ value: string; label: string }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const data = await fetchCategories();
      console.log('📦 Loaded categories:', data);
      setCategories(data);
    } catch (error) {
      console.error("Failed to load categories:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        <div className="h-10 w-16 bg-muted rounded-full animate-pulse" />
        <div className="h-10 w-24 bg-muted rounded-full animate-pulse" />
        <div className="h-10 w-28 bg-muted rounded-full animate-pulse" />
      </div>
    );
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
      <button
        onClick={() => onSelect(null)}
        className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
          selected === null
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-muted-foreground hover:bg-muted/80"
        }`}
      >
        All
      </button>
      {categories.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onSelect(cat.value)}
          className={`flex-shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
            selected === cat.value
              ? "bg-primary text-primary-foreground"
              : "bg-muted text-muted-foreground hover:bg-muted/80"
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}