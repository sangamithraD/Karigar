export interface PriceBreakdown {
  material: number;
  labour: number;
  packaging: number;
  marketAdjustment: number;
}

export interface CraftStory {
  shortStory: string;
  craftHeritage: string;
  handmadeDetails: string;
  artisanNote?: string;
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
  craftStory?: CraftStory;
  marketplacePublished?: boolean;
  createdAt?: string;
}

export interface RawMaterial {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  imageUrl?: string;
  notes?: string;
  createdAt?: string;
}

export interface ProductIdea {
  id: string;
  name: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  materials: string[];
  estimatedEffort: string;
  estimatedPrice: number;
  priceRange?: string;
  imageUrl?: string;
}

export interface TutorialVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  youtubeUrl: string;
  language: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  materialCategory: string;
  craftType?: string;
  productIdeaName?: string;
}

export interface MarketplaceListing {
  id: string;
  type: 'product' | 'raw_material';
  itemId: string;
  title: string;
  description: string;
  price: number;
  quantity: number;
  unit?: string;
  category: string;
  imageUrl?: string;
  keywords?: string[];
  selectedMarketplaces: string[];
  status: 'draft' | 'ready' | 'published' | 'failed';
  publishedAt?: string;
}

export type VoiceIntentType =
  | 'ADD_PRODUCT'
  | 'ADD_RAW_MATERIAL'
  | 'VIEW_PRODUCTS'
  | 'VIEW_RAW_MATERIALS'
  | 'GENERATE_PRODUCT_IDEAS'
  | 'FIND_TUTORIAL'
  | 'UPDATE_PRICE'
  | 'CREATE_LISTING'
  | 'PUBLISH_PRODUCT'
  | 'VIEW_PUBLISHED_PRODUCTS'
  | 'SHOW_DASHBOARD';

export interface VoiceCommandResult {
  intent: VoiceIntentType | 'UNKNOWN';
  parameters: Record<string, any>;
  transcript: string;
  feedbackMessage: string;
  actionExecuted: boolean;
  requiresConfirmation?: boolean;
}

export interface AIInsight {
  id: string;
  type: 'inventory' | 'opportunity' | 'quality' | 'pricing';
  title: string;
  description: string;
  actionLabel?: string;
  actionRoute?: string;
  badge?: string;
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
