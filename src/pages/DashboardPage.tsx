import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Grid, Sparkles, ArrowRight, Package, Clock, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { fetchAllProducts } from '../api/productApi';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { BottomNav } from '../components/BottomNav';
import { useProductCreation } from '../context/ProductCreationContext';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { resetCreationFlow } = useProductCreation();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setIsLoading(true);
    try {
      const items = await fetchAllProducts();
      setProducts(items);
    } catch (e) {
      console.error('Error fetching dashboard products:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStartAddProduct = () => {
    resetCreationFlow();
    navigate('/add-product');
  };

  const recentProducts = products.slice(0, 3);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col pb-20 max-w-md mx-auto">
      <Header />

      <main className="p-4 space-y-5">
        {/* Welcome Greeting Card */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
                नमस्ते • Welcome
              </span>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight mt-0.5">
                Artisan Studio
              </h2>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-800">
              <Sparkles className="w-6 h-6" />
            </div>
          </div>

          <p className="text-stone-600 text-sm mt-2 leading-relaxed">
            Manage your products and generate market-ready listings in minutes.
          </p>

          {/* Quick Stats Strip */}
          <div className="mt-4 pt-4 border-t border-stone-100 grid grid-cols-2 gap-3">
            <div
              onClick={() => navigate('/catalog')}
              className="bg-stone-50 rounded-2xl p-3 border border-stone-200 cursor-pointer hover:bg-stone-100 transition-colors"
            >
              <div className="flex items-center justify-between text-stone-500 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">Catalog Items</span>
                <Package className="w-4 h-4 text-amber-700" />
              </div>
              <div className="text-2xl font-black text-stone-900">
                {products.length}
              </div>
            </div>

            <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200">
              <div className="flex items-center justify-between text-stone-500 mb-1">
                <span className="text-xs font-bold uppercase tracking-wider">Fair Wage</span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-sm font-bold text-emerald-700 mt-1">
                100% Protected
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Hero Button: + Add Product */}
        <div className="space-y-2">
          <Button
            id="dashboard-add-product-primary-btn"
            onClick={handleStartAddProduct}
            variant="warm"
            size="xl"
            fullWidth
            icon={<PlusCircle className="w-7 h-7" />}
          >
            + Add Product
          </Button>
          <p className="text-center text-xs text-stone-500 font-medium">
            Photo + Voice → Instant AI Listing & Pricing
          </p>
        </div>

        {/* My Catalog CTA */}
        <div
          onClick={() => navigate('/catalog')}
          className="bg-stone-900 text-white rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-stone-800 transition-colors shadow-xs active:scale-[0.99]"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-amber-400">
              <Grid className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">View My Catalog</h3>
              <p className="text-xs text-stone-400">
                {products.length} active listings ready to share
              </p>
            </div>
          </div>
          <ArrowRight className="w-5 h-5 text-stone-400" />
        </div>

        {/* Recently Added Products Section */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-stone-500" />
              <h3 className="font-bold text-base text-stone-900 tracking-tight">
                Recently Added
              </h3>
            </div>
            {products.length > 3 && (
              <button
                type="button"
                onClick={() => navigate('/catalog')}
                className="text-xs font-bold text-amber-800 hover:text-amber-900"
              >
                See all ({products.length})
              </button>
            )}
          </div>

          {isLoading ? (
            <div className="text-center py-8 text-stone-400 text-sm">
              Loading your artisan catalog...
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-stone-200">
              <p className="text-stone-500 text-sm">
                No products yet. Tap "+ Add Product" to list your first item!
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onClick={() => navigate(`/products/${prod.id}`)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
