import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Share2, Copy, Check, MessageSquare, ArrowLeft, ShieldCheck, Heart, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { fetchProductById } from '../api/productApi';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { EmptyState } from '../components/EmptyState';

export const ShareListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

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
      console.error('Error loading product for share:', e);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col items-center justify-center p-4 max-w-md mx-auto text-stone-500 text-sm">
        Preparing marketplace card...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-stone-100 flex flex-col p-4 max-w-md mx-auto">
        <Header title="Share Listing" showBack onBack={() => navigate('/catalog')} />
        <EmptyState
          title="Product Not Found"
          description="Cannot find the listing to share."
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

  const shareText = `*ARTISAN PRODUCT LISTING*\n✨ *${product.productName}*\n💰 *Price: ₹${price.toLocaleString('en-IN')}*\n🌿 *Material:* ${product.material || 'Natural Handcrafted'}\n🏷️ *Category:* ${product.category}\n\n📖 *Story & Description:*\n${product.description}\n\n🤝 *Handmade • Eco-friendly • Direct from Rural Artisan*\nSupported by Karigan AI Artisan Business Assistant`;

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.productName,
          text: shareText,
          url: window.location.href,
        });
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopy();
        }
      }
    } else {
      handleCopy();
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(shareText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const encoded = encodeURIComponent(shareText);
    window.open(`https://api.whatsapp.com/send?text=${encoded}`, '_blank');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col pb-10 max-w-md mx-auto">
      <Header
        title="Share Listing"
        showBack
        onBack={() => navigate(`/products/${product.id}`)}
      />

      <main className="p-4 space-y-4">
        {/* Helper Note */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 text-center">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
            Marketplace-Ready
          </span>
          <h2 className="text-xl font-black text-stone-900 tracking-tight mt-0.5">
            Artisan Showcase Card
          </h2>
          <p className="text-stone-500 text-xs mt-1">
            Share directly with prospective customers, WhatsApp groups, or social markets.
          </p>
        </div>

        {/* Clean Marketplace-Ready Product Card specified in prompt */}
        <div
          id="marketplace-card-preview"
          className="bg-white rounded-3xl border-2 border-stone-300 overflow-hidden shadow-md text-stone-900"
        >
          {/* Top Label */}
          <div className="bg-stone-900 text-white px-4 py-2.5 flex items-center justify-between">
            <span className="text-[11px] font-black tracking-widest uppercase text-amber-400 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              ARTISAN PRODUCT
            </span>
            <span className="text-[10px] text-stone-300 font-medium">
              Verified Heritage Craft
            </span>
          </div>

          {/* Image */}
          <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
            <img
              src={displayImage}
              alt={product.productName}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-3 left-3 bg-white/95 text-stone-900 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
              Direct from Maker
            </div>
          </div>

          {/* Details */}
          <div className="p-5 space-y-3">
            <div className="flex items-baseline justify-between gap-2">
              <h3 className="font-extrabold text-xl text-stone-900 leading-tight">
                {product.productName}
              </h3>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-stone-900">
                ₹{price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-stone-500 font-semibold">
                (Fair Artisan Price)
              </span>
            </div>

            {/* Badges */}
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-800 bg-amber-50/80 px-3 py-2 rounded-xl border border-amber-200/70">
              <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0" />
              <span>Handmade • Eco-friendly • Direct from Artisan</span>
            </div>

            {/* Description */}
            <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">
              {product.description}
            </p>

            {/* Footer stamp */}
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-medium">
              <span>Authentic Indian Artisan Work</span>
              <span>100% Ethical Wage</span>
            </div>
          </div>
        </div>

        {/* Share Action Buttons */}
        <div className="space-y-2.5 pt-2">
          {/* Primary Share */}
          <Button
            id="web-share-btn"
            onClick={handleNativeShare}
            variant="warm"
            size="xl"
            fullWidth
            icon={<Share2 className="w-6 h-6" />}
          >
            Share to Buyers
          </Button>

          {/* WhatsApp Share */}
          <button
            type="button"
            id="whatsapp-share-btn"
            onClick={handleWhatsAppShare}
            className="w-full min-h-[52px] rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base flex items-center justify-center gap-2.5 shadow-xs transition-colors cursor-pointer"
          >
            <MessageSquare className="w-5 h-5" />
            <span>Share on WhatsApp</span>
          </button>

          {/* Fallback Copy Text */}
          <Button
            id="copy-listing-text-btn"
            onClick={handleCopy}
            variant="outline"
            size="md"
            fullWidth
            icon={copied ? <Check className="w-5 h-5 text-emerald-600" /> : <Copy className="w-5 h-5" />}
          >
            {copied ? 'Listing Copied to Clipboard!' : 'Copy Listing Text & Details'}
          </Button>
        </div>
      </main>
    </div>
  );
};
