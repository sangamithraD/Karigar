import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  PlusCircle,
  Grid,
  Sparkles,
  ArrowRight,
  Package,
  Clock,
  ShieldCheck,
  Mic,
  BookOpen,
  Globe,
  Lightbulb,
} from 'lucide-react';
import { Product, AIInsight } from '../types';
import { fetchAllProducts } from '../api/productApi';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { BottomNav } from '../components/BottomNav';
import { AIInsightCard } from '../components/AIInsightCard';
import { useProductCreation } from '../context/ProductCreationContext';
import { useVoiceAssistant } from '../context/VoiceAssistantContext';
import { rawMaterialService } from '../services/rawMaterialService';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { resetCreationFlow } = useProductCreation();
  const { openAssistant } = useVoiceAssistant();

  const [products, setProducts] = useState<Product[]>([]);
  const [materialsCount, setMaterialsCount] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const items = await fetchAllProducts();
      setProducts(items);
    } catch (e) {
      console.error('Error fetching dashboard products:', e);
    } finally {
      setIsLoading(false);
    }

    const mats = rawMaterialService.getRawMaterials();
    setMaterialsCount(mats.length);
  };

  const handleStartAddProduct = () => {
    resetCreationFlow();
    navigate('/add-product');
  };

  const recentProducts = products.slice(0, 3);

  // Dynamic AI Insights (Feature 9)
  const aiInsights: AIInsight[] = [
    {
      id: 'insight-1',
      type: 'inventory',
      title: 'Material Opportunity',
      description:
        'You have 12 kg Bamboo stored in your inventory. Making 3 Woven Baskets can generate approximately ₹1,440.',
      actionLabel: 'What can I make?',
      actionRoute: '/ideas?material=Bamboo',
      badge: 'High Demand',
    },
    {
      id: 'insight-2',
      type: 'opportunity',
      title: 'Marketplace Reach',
      description:
        'Your artisan catalog is ready for nationwide digital publishing across ONDC and GeM channels.',
      actionLabel: 'Publish Products',
      actionRoute: '/marketplace',
      badge: 'Direct Income',
    },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col pb-24 max-w-md mx-auto">
      <Header />

      <main className="p-4 space-y-4">
        {/* Welcome Greeting Card */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200/90 shadow-xs">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
                Welcome • Artisan Studio
              </span>
              <h2 className="text-2xl font-black text-stone-900 tracking-tight mt-0.5">
                Karigan Assistant
              </h2>
            </div>
            <button
              type="button"
              onClick={openAssistant}
              className="w-12 h-12 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white flex items-center justify-center shadow-md transition-all active:scale-95 cursor-pointer"
              title="Activate Voice AI"
            >
              <Mic className="w-6 h-6" />
            </button>
          </div>

          <p className="text-stone-600 text-xs mt-2 leading-relaxed">
            Hands-free digital cataloging, raw material planning, fair-trade pricing, and nationwide marketplace linkage.
          </p>

          {/* Quick Stats Strip */}
          <div className="mt-4 pt-3 border-t border-stone-100 grid grid-cols-2 gap-2">
            <div
              onClick={() => navigate('/catalog')}
              className="bg-stone-50 rounded-2xl p-3 border border-stone-200 cursor-pointer hover:bg-stone-100 transition-colors"
            >
              <div className="flex items-center justify-between text-stone-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Catalog Items</span>
                <Package className="w-3.5 h-3.5 text-amber-700" />
              </div>
              <div className="text-2xl font-black text-stone-900">
                {products.length}
              </div>
            </div>

            <div
              onClick={() => navigate('/raw-materials')}
              className="bg-stone-50 rounded-2xl p-3 border border-stone-200 cursor-pointer hover:bg-stone-100 transition-colors"
            >
              <div className="flex items-center justify-between text-stone-500 mb-1">
                <span className="text-[10px] font-bold uppercase tracking-wider">Raw Materials</span>
                <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              </div>
              <div className="text-2xl font-black text-stone-900">
                {materialsCount} <span className="text-xs font-normal text-stone-500">stocked</span>
              </div>
            </div>
          </div>
        </div>

        {/* Feature 9: AI Insights Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 px-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
              AI Business Insights
            </h3>
          </div>
          <div className="space-y-2.5">
            {aiInsights.map((insight) => (
              <AIInsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </div>

        {/* Primary Action Button: + Add Product */}
        <div className="space-y-2">
          <Button
            id="dashboard-add-product-primary-btn"
            onClick={handleStartAddProduct}
            variant="warm"
            size="xl"
            fullWidth
            icon={<PlusCircle className="w-6 h-6" />}
          >
            + Add New Product
          </Button>
          <p className="text-center text-[11px] text-stone-500 font-medium">
            Photo + Voice Description → Instant Catalog & Fair Pricing
          </p>
        </div>

        {/* Core Hub Quick Grid (Learning, Marketplace, Ideation) */}
        <div className="grid grid-cols-3 gap-2">
          <button
            type="button"
            onClick={() => navigate('/ideas')}
            className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs hover:border-amber-700 text-left transition-colors flex flex-col justify-between space-y-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Lightbulb className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-stone-900 block leading-tight">
                Ideas
              </span>
              <span className="text-[10px] text-stone-500">What to make</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/learning')}
            className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs hover:border-amber-700 text-left transition-colors flex flex-col justify-between space-y-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-stone-900 block leading-tight">
                Learning
              </span>
              <span className="text-[10px] text-stone-500">Craft tutorials</span>
            </div>
          </button>

          <button
            type="button"
            onClick={() => navigate('/marketplace')}
            className="bg-white p-3 rounded-2xl border border-stone-200 shadow-xs hover:border-amber-700 text-left transition-colors flex flex-col justify-between space-y-2 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <span className="font-bold text-xs text-stone-900 block leading-tight">
                Marketplace
              </span>
              <span className="text-[10px] text-stone-500">ONDC & GeM</span>
            </div>
          </button>
        </div>

        {/* Recently Added Products Section */}
        <div className="space-y-3 pt-1">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-stone-500" />
              <h3 className="font-bold text-sm text-stone-900 tracking-tight">
                Recent Catalog Items
              </h3>
            </div>
            <button
              type="button"
              onClick={() => navigate('/catalog')}
              className="text-xs font-bold text-amber-800 hover:text-amber-900 cursor-pointer"
            >
              View all ({products.length})
            </button>
          </div>

          {isLoading ? (
            <div className="text-center py-6 text-stone-400 text-xs">
              Loading your catalog...
            </div>
          ) : recentProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-stone-200">
              <p className="text-stone-500 text-xs">
                No products yet. Tap "+ Add New Product" to list your first craft item!
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
