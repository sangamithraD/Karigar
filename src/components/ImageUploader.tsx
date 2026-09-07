import React, { useRef, useState } from 'react';
import { Camera, Image as ImageIcon, Sparkles, RefreshCw, Check, Eye } from 'lucide-react';
import { Button } from './Button';

interface ImageUploaderProps {
  currentImageUrl: string | null;
  enhancedImageUrl: string | null;
  isEnhancing: boolean;
  onImageSelected: (url: string) => void;
  onEnhanceClick: () => void;
  onContinue: () => void;
}

// Preset artisan photos for instant hackathon testing
const PRESET_ARTISAN_PHOTOS = [
  {
    name: 'Palm Leaf Basket',
    url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Handloom Cotton Saree',
    url: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Terracotta Clay Pot',
    url: 'https://images.unsplash.com/photo-1578749556568-bc2c40e68b61?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Wooden Channapatna Toy',
    url: 'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Beaded Tribal Necklace',
    url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
  },
];

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImageUrl,
  enhancedImageUrl,
  isEnhancing,
  onImageSelected,
  onEnhanceClick,
  onContinue,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [showOriginal, setShowOriginal] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onImageSelected(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const activeDisplayUrl =
    enhancedImageUrl && !showOriginal ? enhancedImageUrl : currentImageUrl;

  return (
    <div id="image-uploader-component" className="w-full flex flex-col items-center">
      {/* Hidden file inputs */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      <input
        type="file"
        ref={cameraInputRef}
        onChange={handleFileChange}
        accept="image/*"
        capture="environment"
        className="hidden"
      />

      {!currentImageUrl ? (
        /* Empty State / Photo Selection Screen */
        <div className="w-full flex flex-col items-center gap-6">
          <div className="w-full aspect-4/3 max-w-sm rounded-3xl border-3 border-dashed border-stone-300 bg-stone-50 flex flex-col items-center justify-center p-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
              <Camera className="w-8 h-8" />
            </div>
            <h3 className="font-bold text-stone-900 text-lg">
              Take a clear photo
            </h3>
            <p className="text-stone-500 text-sm mt-1 max-w-[240px]">
              Keep product in good light on a clean flat surface
            </p>
          </div>

          {/* Action Buttons */}
          <div className="w-full max-w-sm flex flex-col gap-3">
            <Button
              id="take-photo-btn"
              onClick={() => cameraInputRef.current?.click()}
              size="lg"
              variant="warm"
              fullWidth
              icon={<Camera className="w-6 h-6" />}
            >
              Take Photo
            </Button>

            <Button
              id="choose-gallery-btn"
              onClick={() => fileInputRef.current?.click()}
              size="lg"
              variant="outline"
              fullWidth
              icon={<ImageIcon className="w-6 h-6" />}
            >
              Choose from Gallery
            </Button>
          </div>

          {/* Quick Preset Selector for Immediate Testing */}
          <div className="w-full max-w-sm mt-2 pt-4 border-t border-stone-200">
            <p className="text-xs font-bold text-stone-500 uppercase tracking-wider mb-2">
              Or pick an artisan sample item:
            </p>
            <div className="grid grid-cols-5 gap-2">
              {PRESET_ARTISAN_PHOTOS.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onImageSelected(preset.url)}
                  className="aspect-square rounded-xl overflow-hidden border-2 border-stone-200 hover:border-amber-600 transition-all focus:outline-none focus:ring-2 focus:ring-amber-500"
                  title={preset.name}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Image Preview with Enhancement and Controls */
        <div className="w-full max-w-sm flex flex-col items-center">
          {/* Main Photo Display Card */}
          <div className="relative w-full aspect-4/3 rounded-2xl overflow-hidden border-2 border-stone-200 bg-stone-900 shadow-sm">
            {activeDisplayUrl && (
              <img
                src={activeDisplayUrl}
                alt="Product preview"
                className="w-full h-full object-cover"
              />
            )}

            {/* AI Enhanced Status Pill */}
            {enhancedImageUrl && (
              <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {showOriginal ? 'Showing Original' : 'AI Enhanced'}
                </span>
              </div>
            )}

            {/* Before / After Toggle Button */}
            {enhancedImageUrl && (
              <button
                type="button"
                id="toggle-before-after-btn"
                onClick={() => setShowOriginal(!showOriginal)}
                className="absolute bottom-3 right-3 bg-white/95 text-stone-900 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5 shadow-md active:scale-95"
              >
                <Eye className="w-3.5 h-3.5" />
                <span>{showOriginal ? 'View Enhanced' : 'View Original'}</span>
              </button>
            )}
          </div>

          {/* Enhancement Feedback */}
          {enhancedImageUrl ? (
            <div className="w-full mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-900 font-medium">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                Studio enhancement applied: lighting balanced & clean focus adjusted.
              </span>
            </div>
          ) : (
            <div className="w-full mt-3">
              <Button
                id="enhance-image-btn"
                onClick={onEnhanceClick}
                isLoading={isEnhancing}
                variant="outline"
                fullWidth
                size="md"
                icon={<Sparkles className="w-4 h-4 text-amber-600" />}
              >
                Enhance with AI (Studio Lighting)
              </Button>
            </div>
          )}

          {/* Change or Retake options */}
          <div className="grid grid-cols-2 gap-2 w-full mt-3">
            <button
              type="button"
              id="retake-photo-btn"
              onClick={() => cameraInputRef.current?.click()}
              className="min-h-[44px] px-3 py-2 rounded-xl border border-stone-300 text-stone-700 font-medium text-sm flex items-center justify-center gap-1.5 hover:bg-stone-50"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Retake</span>
            </button>

            <button
              type="button"
              id="choose-another-btn"
              onClick={() => fileInputRef.current?.click()}
              className="min-h-[44px] px-3 py-2 rounded-xl border border-stone-300 text-stone-700 font-medium text-sm flex items-center justify-center gap-1.5 hover:bg-stone-50"
            >
              <ImageIcon className="w-4 h-4" />
              <span>Gallery</span>
            </button>
          </div>

          {/* Next Step Button */}
          <div className="w-full mt-5">
            <Button
              id="continue-to-voice-btn"
              onClick={onContinue}
              variant="warm"
              size="lg"
              fullWidth
            >
              Continue to Voice Step
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
