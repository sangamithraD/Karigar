import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Share2, Edit3, Tag, Sparkles, ShieldCheck, ArrowLeft, Layers, Globe } from 'lucide-react';
import { Product } from '../types';
import { fetchProductById } from '../api/productApi';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { PriceCard } from '../components/PriceCard';
import { CraftStoryCard } from '../components/CraftStoryCard';
import { EmptyState } from '../components/EmptyState';

export const ProductDetailsPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);

  useEffect(() => {
    if (id) {
      loadProduct(id);
    }
  }, [id]);

  const loadProduct = async (productId: string) => {
    setIsLoading(true);
    try {
      const item = await fetchProductById(productId);
      setProduct(item);
    } catch (e) {
      console.error('Error fetching product details:', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4 max-w-md mx-auto text-stone-500 text-sm">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col p-4 max-w-md mx-auto">
        <Header title="Product Not Found" showBack onBack={() => navigate('/catalog')} />
        <EmptyState
          title="Product Not Found"
          description="The requested artisan listing does not exist or has been removed."
          actionText="Go to Catalog"
          onAction={() => navigate('/catalog')}
        />
      </div>
    );
  }

  const displayImage =
    product.enhancedImageUrl ||
    product.imageUrl ||
    'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80';

  const price = product.suggestedPrice || product.priceMin || 0;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col pb-12 max-w-md mx-auto">
      <Header
        title="Product Details"
        showBack
        onBack={() => navigate('/catalog')}
      />

      <main className="p-4 space-y-4">
        {/* Large Product Hero Image */}
        <div className="relative aspect-4/3 w-full rounded-3xl overflow-hidden bg-stone-900 border-2 border-stone-200 shadow-xs">
          <img
            src={displayImage}
            alt={product.productName}
            className="w-full h-full object-cover"
          />

          {/* AI Enhanced badge */}
          {product.enhancedImageUrl && (
            <div className="absolute top-3.5 right-3.5 bg-stone-900/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Studio Enhanced</span>
            </div>
          )}

          {/* Price Tag Overlay */}
          <div className="absolute bottom-3.5 left-3.5 bg-stone-900/90 backdrop-blur-xs text-white px-4 py-2 rounded-2xl flex items-center gap-2 shadow-lg">
            <span className="text-xs text-stone-300 uppercase tracking-wider font-semibold">
              Selling Price:
            </span>
            <span className="text-xl font-black text-amber-400">
              ₹{price.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Product Information Card */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 text-xs font-bold uppercase tracking-wider">
                {product.category}
              </span>
            </div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight leading-snug">
              {product.productName}
            </h2>
          </div>

          {/* Material */}
          {product.material && (
            <div className="pt-3 border-t border-stone-100">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block">
                Material & Craft Technique
              </span>
              <p className="text-sm font-semibold text-stone-800 mt-0.5">
                {product.material}
              </p>
            </div>
          )}

          {/* Description */}
          <div className="pt-3 border-t border-stone-100">
            <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
              Artisan Story & Details
            </span>
            <p className="text-sm text-stone-700 leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Feature 6: Craft Story */}
          <div className="pt-3 border-t border-stone-100">
            <CraftStoryCard
              craftStory={product.craftStory}
              productName={product.productName}
              material={product.material}
              editable={false}
            />
          </div>

          {/* Keywords */}
          {product.keywords && product.keywords.length > 0 && (
            <div className="pt-3 border-t border-stone-100">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-2">
                Keywords & Features
              </span>
              <div className="flex flex-wrap gap-1.5">
                {product.keywords.map((kw, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1 bg-stone-100 text-stone-700 text-xs font-medium px-3 py-1 rounded-full"
                  >
                    <Tag className="w-3 h-3 text-stone-400" />
                    <span>{kw}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Toggle Price Breakdown Card */}
          {product.priceBreakdown && (
            <div className="pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                className="w-full py-2 px-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-200 text-xs font-bold text-stone-700 flex items-center justify-between transition-colors"
              >
                <span className="flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-amber-700" />
                  View Transparent Fair-Wage Cost Breakdown
                </span>
                <span>{showPriceBreakdown ? 'Hide' : 'View'}</span>
              </button>

              {showPriceBreakdown && (
                <div className="mt-3">
                  <PriceCard
                    suggestedPrice={product.suggestedPrice || 429}
                    priceMin={product.priceMin}
                    priceMax={product.priceMax}
                    breakdown={product.priceBreakdown}
                    rationale={product.priceRationale}
                    editable={false}
                  />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Action Buttons: [Publish to Marketplace], [Share], [Edit] */}
        <div className="space-y-2.5 pt-2">
          <Button
            id="details-publish-marketplace-btn"
            onClick={() => navigate(`/marketplace?productId=${product.id}`)}
            variant="warm"
            size="xl"
            fullWidth
            icon={<Globe className="w-6 h-6" />}
          >
            Publish to Marketplaces (ONDC / GeM)
          </Button>

          <Button
            id="details-share-listing-btn"
            onClick={() => navigate(`/products/${product.id}/share`)}
            variant="outline"
            size="lg"
            fullWidth
            icon={<Share2 className="w-5 h-5" />}
          >
            Share Listing Card
          </Button>

          <Button
            id="details-edit-product-btn"
            onClick={() => navigate(`/products/${product.id}/edit`)}
            variant="ghost"
            size="md"
            fullWidth
            icon={<Edit3 className="w-4 h-4" />}
          >
            Edit Product
          </Button>
        </div>
      </main>
    </div>
  );
};
