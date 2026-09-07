import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Edit3, ArrowRight, Tag, ShieldCheck } from 'lucide-react';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { CraftStoryCard } from '../components/CraftStoryCard';
import { useProductCreation } from '../context/ProductCreationContext';

export const AiGeneratedListingPage: React.FC = () => {
  const navigate = useNavigate();
  const { draftProduct, updateDraftProduct } = useProductCreation();

  const displayImage =
    draftProduct.enhancedImageUrl ||
    draftProduct.imageUrl ||
    'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col pb-10 max-w-md mx-auto">
      <Header
        title="AI Generated Listing"
        showBack
        onBack={() => navigate('/add-product/voice')}
      />

      <main className="p-4 space-y-4">
        {/* Banner with AI badge */}
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-600 text-white flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-bold text-stone-900 text-sm">
              Review AI Generated Details
            </h3>
            <p className="text-stone-600 text-xs mt-0.5">
              Everything is customizable. Review before checking price recommendation.
            </p>
          </div>
        </div>

        {/* Product Visual Card */}
        <div className="bg-white rounded-3xl border-2 border-stone-200 overflow-hidden shadow-xs">
          {/* Image */}
          <div className="relative aspect-4/3 w-full bg-stone-900 overflow-hidden">
            <img
              src={displayImage}
              alt={draftProduct.productName || 'Artisan item'}
              className="w-full h-full object-cover"
            />
            {draftProduct.enhancedImageUrl && (
              <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>Enhanced Photo</span>
              </div>
            )}
          </div>

          {/* Details Body */}
          <div className="p-5 space-y-4">
            {/* Name */}
            <div>
              <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wider block">
                Product Title
              </span>
              <h2 className="text-xl font-black text-stone-900 tracking-tight mt-0.5">
                {draftProduct.productName || 'Untitled Artisan Product'}
              </h2>
            </div>

            {/* Category & Material Grid */}
            <div className="grid grid-cols-2 gap-3 pt-2 border-t border-stone-100">
              <div className="bg-stone-50 p-2.5 rounded-xl">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Category
                </span>
                <span className="text-xs font-bold text-stone-800 line-clamp-1 mt-0.5">
                  {draftProduct.category || 'Handicrafts'}
                </span>
              </div>

              <div className="bg-stone-50 p-2.5 rounded-xl">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                  Material
                </span>
                <span className="text-xs font-bold text-stone-800 line-clamp-1 mt-0.5">
                  {draftProduct.material || 'Natural Materials'}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="pt-2 border-t border-stone-100">
              <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1">
                Product Description
              </span>
              <p className="text-sm text-stone-700 leading-relaxed">
                {draftProduct.description ||
                  'Authentic handcrafted product made by rural artisan with sustainable materials.'}
              </p>
            </div>

            {/* Feature 6: Craft Story */}
            <div className="pt-2 border-t border-stone-100">
              <CraftStoryCard
                craftStory={draftProduct.craftStory}
                productName={draftProduct.productName}
                material={draftProduct.material}
                editable
                onSave={(story) => updateDraftProduct({ craftStory: story })}
              />
            </div>

            {/* Keywords */}
            {draftProduct.keywords && draftProduct.keywords.length > 0 && (
              <div className="pt-2 border-t border-stone-100">
                <span className="text-[11px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                  Search Tags
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {draftProduct.keywords.map((kw, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-1 bg-stone-100 text-stone-700 text-xs font-medium px-2.5 py-1 rounded-full"
                    >
                      <Tag className="w-3 h-3 text-stone-400" />
                      <span>{kw}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2.5 pt-2">
          <Button
            id="continue-to-pricing-btn"
            onClick={() => navigate('/add-product/pricing')}
            variant="warm"
            size="lg"
            fullWidth
            icon={<ArrowRight className="w-5 h-5" />}
            iconPosition="right"
          >
            Continue to Pricing Recommendation
          </Button>

          <Button
            id="edit-generated-listing-btn"
            onClick={() => navigate('/add-product/edit')}
            variant="outline"
            size="lg"
            fullWidth
            icon={<Edit3 className="w-5 h-5" />}
          >
            Edit Listing Details
          </Button>
        </div>
      </main>
    </div>
  );
};
