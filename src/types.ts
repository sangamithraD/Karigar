export interface PriceBreakdown {
  material: number;
  labour: number;
  packaging: number;
  marketAdjustment: number;
}

export interface Product {
  id?: string;
  productName: string;
  category: string;
  material: string;
  description: string;
  keywords: string[];
  imageUrl?: string;
  enhancedImageUrl?: string;
  suggestedPrice?: number;
  priceMin?: number;
  priceMax?: number;
  priceBreakdown?: PriceBreakdown;
  priceRationale?: string;
  createdAt?: string;
}

export interface VoiceTranscribeResponse {
  transcription: string;
  languageDetected?: string;
  audioDurationSeconds?: number;
}

export interface ImageEnhanceResponse {
  originalImageUrl: string;
  enhancedImageUrl: string;
  enhancementDetails?: {
    backgroundCleaned: boolean;
    lightingAdjusted: boolean;
    colorsEnhanced: boolean;
  };
}

export interface CatalogGenerateResponse {
  productName: string;
  category: string;
  material: string;
  description: string;
  keywords: string[];
}

export interface PricingSuggestResponse {
  suggestedPrice: number;
  priceMin: number;
  priceMax: number;
  priceBreakdown: PriceBreakdown;
  priceRationale: string;
}

export interface ApiStatus {
  isMockMode: boolean;
  isBackendConnected: boolean;
  backendUrl: string;
  lastChecked?: string;
}
