import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, ArrowLeft, Sparkles, ShieldCheck } from 'lucide-react';
import { Header } from '../components/Header';
import { Button } from '../components/Button';
import { PriceCard } from '../components/PriceCard';
import { ErrorMessage } from '../components/ErrorMessage';
import { useProductCreation } from '../context/ProductCreationContext';

export const PriceRecommendationPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    draftProduct,
    pricingData,
    updateDraftProduct,
    saveToCatalog,
    resetCreationFlow,
  } = useProductCreation();

  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const suggested = draftProduct.suggestedPrice || pricingData?.suggestedPrice || 429;
  const priceMin = draftProduct.priceMin || pricingData?.priceMin || 399;
  const priceMax = draftProduct.priceMax || pricingData?.priceMax || 449;
  const breakdown = draftProduct.priceBreakdown || pricingData?.priceBreakdown;
  const rationale = draftProduct.priceRationale || pricingData?.priceRationale;

  const handlePriceAdjusted = (newPrice: number) => {
    updateDraftProduct({ suggestedPrice: newPrice });
  };

  const handleSaveProduct = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const saved = await saveToCatalog();
      // Clear current creation draft and navigate to product details
      resetCreationFlow();
      navigate(`/products/${saved.id}`);
    } catch (err: any) {
      console.error('Save error:', err);
      setSaveError(err.message || 'Unable to save to catalog. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col pb-10 max-w-md mx-auto">
      <Header
        title="Price Recommendation"
        showBack
        onBack={() => navigate('/add-product/generated')}
      />

      <main className="p-4 space-y-4">
        {/* Banner */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
            Step 3 of 3 • Final Step
          </span>
          <h2 className="text-xl font-black text-stone-900 tracking-tight mt-0.5">
            Fair Artisan Price
          </h2>
          <p className="text-stone-500 text-xs mt-1 leading-relaxed">
            AI calculates prices based on your effort, raw materials, and fair market value so you are never underpaid.
          </p>
        </div>

        {/* Core Price Card Component */}
        <PriceCard
          suggestedPrice={suggested}
          priceMin={priceMin}
          priceMax={priceMax}
          breakdown={breakdown}
          rationale={rationale}
          onPriceChange={handlePriceAdjusted}
          editable={true}
        />

        {saveError && (
          <ErrorMessage
            title="Save Failed"
            message={saveError}
            onRetry={handleSaveProduct}
            actionLabel="Try Saving Again"
          />
        )}

        {/* Save CTA */}
        <div className="pt-2 space-y-2.5">
          <Button
            id="save-to-catalog-btn"
            onClick={handleSaveProduct}
            variant="warm"
            size="xl"
            fullWidth
            isLoading={isSaving}
            icon={<Check className="w-6 h-6" />}
          >
            Save to My Catalog (कैटलॉग में सहेजें)
          </Button>

          <Button
            type="button"
            onClick={() => navigate('/add-product/generated')}
            variant="ghost"
            size="md"
            fullWidth
            icon={<ArrowLeft className="w-4 h-4" />}
          >
            Back to Listing Preview
          </Button>
        </div>
      </main>
    </div>
  );
};
