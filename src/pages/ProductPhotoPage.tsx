import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { ImageUploader } from '../components/ImageUploader';
import { useProductCreation } from '../context/ProductCreationContext';

export const ProductPhotoPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    photoUrl,
    enhancedPhotoUrl,
    isEnhancing,
    setPhoto,
    enhancePhoto,
  } = useProductCreation();

  const handleContinue = () => {
    if (photoUrl) {
      navigate('/add-product/voice');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col pb-10 max-w-md mx-auto">
      <Header
        title="Product Photo"
        showBack
        onBack={() => navigate('/add-product')}
      />

      <main className="p-4 space-y-4 flex-1 flex flex-col items-center">
        {/* Helper Banner */}
        <div className="w-full bg-white rounded-2xl p-4 border border-stone-200 text-center">
          <span className="text-xs font-bold text-amber-700 uppercase tracking-wider block">
            Step 1 of 2
          </span>
          <h2 className="text-xl font-black text-stone-900 tracking-tight mt-0.5">
            Capture Your Craft
          </h2>
          <p className="text-stone-500 text-xs mt-1">
            Place your item in good lighting. AI will improve the background automatically.
          </p>
        </div>

        {/* Core Image Uploader Component */}
        <ImageUploader
          currentImageUrl={photoUrl}
          enhancedImageUrl={enhancedPhotoUrl}
          isEnhancing={isEnhancing}
          onImageSelected={(url) => setPhoto(url)}
          onEnhanceClick={enhancePhoto}
          onContinue={handleContinue}
        />
      </main>
    </div>
  );
};
