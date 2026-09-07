import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CatalogGenerateResponse,
  PricingSuggestResponse,
  Product,
} from '../types';
import {
  enhanceProductImage,
  generateCatalogDetails,
  suggestProductPricing,
  transcribeVoiceAudio,
} from '../api/aiApi';
import { createProduct } from '../api/productApi';

interface ProductCreationContextType {
  // Step 1: Photo
  photoUrl: string | null;
  enhancedPhotoUrl: string | null;
  isEnhancing: boolean;
  setPhoto: (url: string) => void;
  enhancePhoto: () => Promise<void>;

  // Step 2: Voice
  audioBlob: Blob | null;
  audioUrl: string | null;
  transcription: string;
  setAudioRecording: (blob: Blob, url: string) => void;
  clearAudio: () => void;

  // Step 3: AI Processing & Results
  isProcessing: boolean;
  processingStage: number; // 0 to 4
  processingError: string | null;
  draftProduct: Partial<Product>;
  pricingData: PricingSuggestResponse | null;

  // Actions
  startAiPipeline: (onComplete: () => void) => Promise<void>;
  updateDraftProduct: (updates: Partial<Product>) => void;
  saveToCatalog: () => Promise<Product>;
  resetCreationFlow: () => void;
}

const ProductCreationContext = createContext<ProductCreationContextType | null>(null);

export const ProductCreationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [photoUrl, setPhotoUrl] = useState<string | null>(null);
  const [enhancedPhotoUrl, setEnhancedPhotoUrl] = useState<string | null>(null);
  const [isEnhancing, setIsEnhancing] = useState<boolean>(false);

  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<string>('');

  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [processingStage, setProcessingStage] = useState<number>(0);
  const [processingError, setProcessingError] = useState<string | null>(null);

  const [draftProduct, setDraftProduct] = useState<Partial<Product>>({
    productName: '',
    category: '',
    material: '',
    description: '',
    keywords: [],
    suggestedPrice: 429,
  });

  const [pricingData, setPricingData] = useState<PricingSuggestResponse | null>(null);

  const setPhoto = (url: string) => {
    setPhotoUrl(url);
    // Reset enhanced when new photo is picked
    setEnhancedPhotoUrl(null);
  };

  const enhancePhoto = async () => {
    if (!photoUrl) return;
    setIsEnhancing(true);
    try {
      const res = await enhanceProductImage(photoUrl);
      setEnhancedPhotoUrl(res.enhancedImageUrl);
    } catch (err: any) {
      console.error('Enhancement error:', err);
    } finally {
      setIsEnhancing(false);
    }
  };

  const setAudioRecording = (blob: Blob, url: string) => {
    setAudioBlob(blob);
    setAudioUrl(url);
  };

  const clearAudio = () => {
    setAudioBlob(null);
    if (audioUrl) {
      URL.revokeObjectURL(audioUrl);
      setAudioUrl(null);
    }
    setTranscription('');
  };

  const updateDraftProduct = (updates: Partial<Product>) => {
    setDraftProduct((prev) => ({ ...prev, ...updates }));
  };

  const startAiPipeline = async (onComplete: () => void) => {
    setIsProcessing(true);
    setProcessingError(null);
    setProcessingStage(1);

    try {
      // Stage 1: Transcribe voice (if audio exists)
      let voiceText = transcription;
      if (audioBlob && !voiceText) {
        try {
          const transRes = await transcribeVoiceAudio(audioBlob);
          voiceText = transRes.transcription;
          setTranscription(voiceText);
        } catch (e) {
          console.warn('Voice transcription fallback', e);
          voiceText = 'Handcrafted traditional artisan product with local natural materials.';
        }
      } else if (!voiceText) {
        voiceText = 'Handcrafted eco-friendly artisan craft product.';
      }

      // Stage 2: Preparing product information
      setProcessingStage(2);
      const catalogRes = await generateCatalogDetails({
        transcription: voiceText,
        notes: draftProduct.description,
      });

      // Stage 3: Improving photo
      setProcessingStage(3);
      let finalImg = enhancedPhotoUrl || photoUrl;
      if (!enhancedPhotoUrl && photoUrl) {
        try {
          const enhanceRes = await enhanceProductImage(photoUrl);
          finalImg = enhanceRes.enhancedImageUrl;
          setEnhancedPhotoUrl(finalImg);
        } catch (e) {
          console.warn('Photo enhancement non-critical error', e);
        }
      }

      // Stage 4: Calculating suggested price
      setProcessingStage(4);
      const pricingRes = await suggestProductPricing({
        productName: catalogRes.productName,
        category: catalogRes.category,
        material: catalogRes.material,
        description: catalogRes.description,
      });

      setPricingData(pricingRes);

      // Merge into draft product
      setDraftProduct({
        productName: catalogRes.productName,
        category: catalogRes.category,
        material: catalogRes.material,
        description: catalogRes.description,
        keywords: catalogRes.keywords,
        imageUrl: photoUrl || 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
        enhancedImageUrl: finalImg || photoUrl || undefined,
        suggestedPrice: pricingRes.suggestedPrice,
        priceMin: pricingRes.priceMin,
        priceMax: pricingRes.priceMax,
        priceBreakdown: pricingRes.priceBreakdown,
        priceRationale: pricingRes.priceRationale,
      });

      // Small pause so artisan sees final checkmark
      setTimeout(() => {
        setIsProcessing(false);
        onComplete();
      }, 700);
    } catch (err: any) {
      console.error('AI pipeline error:', err);
      setIsProcessing(false);
      setProcessingError(
        err.message || 'We could not complete AI cataloging. Please verify your connection or try again.'
      );
    }
  };

  const saveToCatalog = async (): Promise<Product> => {
    if (!draftProduct.productName) {
      throw new Error('Please provide a product name before saving.');
    }

    const payload: Omit<Product, 'id'> = {
      productName: draftProduct.productName || 'Artisan Handcraft',
      category: draftProduct.category || 'Handicrafts',
      material: draftProduct.material || 'Natural Materials',
      description: draftProduct.description || 'Authentic artisan crafted item.',
      keywords: draftProduct.keywords || ['Handmade', 'Artisan'],
      imageUrl: draftProduct.imageUrl || photoUrl || 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=800&q=80',
      enhancedImageUrl: draftProduct.enhancedImageUrl || enhancedPhotoUrl || undefined,
      suggestedPrice: draftProduct.suggestedPrice || 429,
      priceMin: draftProduct.priceMin || 399,
      priceMax: draftProduct.priceMax || 449,
      priceBreakdown: draftProduct.priceBreakdown || pricingData?.priceBreakdown || {
        material: 120,
        labour: 220,
        packaging: 40,
        marketAdjustment: 49,
      },
      priceRationale: draftProduct.priceRationale || pricingData?.priceRationale,
    };

    const saved = await createProduct(payload);
    return saved;
  };

  const resetCreationFlow = () => {
    setPhotoUrl(null);
    setEnhancedPhotoUrl(null);
    setIsEnhancing(false);
    clearAudio();
    setIsProcessing(false);
    setProcessingStage(0);
    setProcessingError(null);
    setPricingData(null);
    setDraftProduct({
      productName: '',
      category: '',
      material: '',
      description: '',
      keywords: [],
      suggestedPrice: 429,
    });
  };

  return (
    <ProductCreationContext.Provider
      value={{
        photoUrl,
        enhancedPhotoUrl,
        isEnhancing,
        setPhoto,
        enhancePhoto,
        audioBlob,
        audioUrl,
        transcription,
        setAudioRecording,
        clearAudio,
        isProcessing,
        processingStage,
        processingError,
        draftProduct,
        pricingData,
        startAiPipeline,
        updateDraftProduct,
        saveToCatalog,
        resetCreationFlow,
      }}
    >
      {children}
    </ProductCreationContext.Provider>
  );
};

export function useProductCreation() {
  const context = useContext(ProductCreationContext);
  if (!context) {
    throw new Error('useProductCreation must be used within ProductCreationProvider');
  }
  return context;
}
