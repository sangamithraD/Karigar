import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Filter, PackageOpen } from 'lucide-react';
import { Product } from '../types';
import { fetchAllProducts } from '../api/productApi';
import { Header } from '../components/Header';
import { ProductCard } from '../components/ProductCard';
import { EmptyState } from '../components/EmptyState';
import { BottomNav } from '../components/BottomNav';
import { useProductCreation } from '../context/ProductCreationContext';

export const ProductCatalogPage: React.FC = () => {
  const navigate = useNavigate();
  const { resetCreationFlow } = useProductCreation();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadCatalog();
  }, []);

  const loadCatalog = async () => {
    setIsLoading(true);
    try {
      const items = await fetchAllProducts();
      setProducts(items);
    } catch (e) {
      console.error('Failed loading catalog:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCategory =
        selectedCategory === 'All' || p.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        p.productName.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.material?.toLowerCase().includes(q) ||
        p.keywords?.some((k) => k.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col pb-20 max-w-md mx-auto">
      <Header
        title="My Catalog"
        showBack
        onBack={() => navigate('/dashboard')}
      />

      <main className="p-4 space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3.5 top-3.5 w-5 h-5 text-stone-400 pointer-events-none" />
          <input
            id="catalog-search-input"
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by craft, material, or keyword..."
            className="w-full min-h-[48px] rounded-2xl border-2 border-stone-200 bg-white text-stone-900 text-sm font-medium pl-11 pr-4 py-2.5 shadow-xs focus:outline-none focus:border-amber-600"
          />
        </div>

        {/* Category Filters */}
        {categories.length > 2 && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-700 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}

        {/* Product Count Header */}
        <div className="flex items-center justify-between text-xs font-semibold text-stone-500 pt-1">
          <span>
            Showing {filteredProducts.length} of {products.length} products
          </span>
          <button
            type="button"
            onClick={() => {
              resetCreationFlow();
              navigate('/add-product');
            }}
            className="text-amber-800 font-bold flex items-center gap-1 hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add New</span>
          </button>
        </div>

        {/* Catalog List / Grid */}
        {isLoading ? (
          <div className="text-center py-12 text-stone-400 text-sm font-medium">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <EmptyState
            title="No Products Found"
            description={
              searchQuery
                ? `No items match "${searchQuery}". Try a different search term.`
                : 'Your catalog is empty. Start adding handcrafted items.'
            }
            actionText="+ Add Product"
            onAction={() => {
              resetCreationFlow();
              navigate('/add-product');
            }}
          />
        ) : (
          <div className="grid grid-cols-1 gap-3.5">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={() => navigate(`/products/${product.id}`)}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};
