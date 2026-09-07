import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ProductCreationProvider } from './context/ProductCreationContext';
import { VoiceAssistantProvider } from './context/VoiceAssistantContext';

// Existing Pages
import { WelcomePage } from './pages/WelcomePage';
import { DashboardPage } from './pages/DashboardPage';
import { AddProductWorkflowPage } from './pages/AddProductWorkflowPage';
import { ProductPhotoPage } from './pages/ProductPhotoPage';
import { VoiceDescriptionPage } from './pages/VoiceDescriptionPage';
import { AiProcessingPage } from './pages/AiProcessingPage';
import { AiGeneratedListingPage } from './pages/AiGeneratedListingPage';
import { EditProductPage } from './pages/EditProductPage';
import { PriceRecommendationPage } from './pages/PriceRecommendationPage';
import { ProductCatalogPage } from './pages/ProductCatalogPage';
import { ProductDetailsPage } from './pages/ProductDetailsPage';
import { ShareListingPage } from './pages/ShareListingPage';

// New Karigan Feature Pages
import { RawMaterialsPage } from './pages/RawMaterialsPage';
import { AddRawMaterialPage } from './pages/AddRawMaterialPage';
import { WhatCanIMakePage } from './pages/WhatCanIMakePage';
import { CraftLearningPage } from './pages/CraftLearningPage';
import { MarketplacePublishPage } from './pages/MarketplacePublishPage';

export default function App() {
  return (
    <ProductCreationProvider>
      <BrowserRouter>
        <VoiceAssistantProvider>
          <Routes>
            {/* 1. Welcome */}
            <Route path="/" element={<WelcomePage />} />

            {/* 2. Dashboard */}
            <Route path="/dashboard" element={<DashboardPage />} />

            {/* 3. Add Product */}
            <Route path="/add-product" element={<AddProductWorkflowPage />} />

            {/* 4. Product Photo */}
            <Route path="/add-product/photo" element={<ProductPhotoPage />} />

            {/* 5. Voice Description */}
            <Route path="/add-product/voice" element={<VoiceDescriptionPage />} />

            {/* 6. AI Processing */}
            <Route path="/add-product/processing" element={<AiProcessingPage />} />

            {/* 7. AI Generated Listing */}
            <Route path="/add-product/generated" element={<AiGeneratedListingPage />} />

            {/* 8. Edit Product (during draft creation) */}
            <Route path="/add-product/edit" element={<EditProductPage />} />

            {/* 9. Price Recommendation */}
            <Route path="/add-product/pricing" element={<PriceRecommendationPage />} />

            {/* 10. Product Catalog */}
            <Route path="/catalog" element={<ProductCatalogPage />} />

            {/* 11. Product Details */}
            <Route path="/products/:id" element={<ProductDetailsPage />} />

            {/* Edit Product (from catalog) */}
            <Route path="/products/:id/edit" element={<EditProductPage />} />

            {/* 12. Share Listing */}
            <Route path="/products/:id/share" element={<ShareListingPage />} />

            {/* 13. Raw Material Hub */}
            <Route path="/raw-materials" element={<RawMaterialsPage />} />
            <Route path="/raw-materials/add" element={<AddRawMaterialPage />} />

            {/* 14. "What Can I Make?" Ideation */}
            <Route path="/ideas" element={<WhatCanIMakePage />} />

            {/* 15. Craft Learning Hub */}
            <Route path="/learning" element={<CraftLearningPage />} />

            {/* 16. Multi-Channel Marketplace Publishing */}
            <Route path="/marketplace" element={<MarketplacePublishPage />} />

            {/* Fallback to Dashboard */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </VoiceAssistantProvider>
      </BrowserRouter>
    </ProductCreationProvider>
  );
}
