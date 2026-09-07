import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Globe, CheckCircle2, ShoppingBag, Package, Sparkles, ArrowRight } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { MarketplacePublishCard } from '../components/MarketplacePublishCard';
import { fetchAllProducts } from '../api/productApi';
import { rawMaterialService } from '../services/rawMaterialService';
import { marketplaceService, CONNECTED_MARKETPLACES } from '../services/marketplaceService';
import { Product, RawMaterial, MarketplaceListing } from '../types';

export const MarketplacePublishPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const targetProductId = searchParams.get('productId');

  const [activeTab, setActiveTab] = useState<'products' | 'raw_materials' | 'published'>(
    targetProductId ? 'products' : 'published'
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [publishedListings, setPublishedListings] = useState<MarketplaceListing[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const prods = await fetchAllProducts();
      setProducts(prods);

      if (targetProductId) {
        const found = prods.find((p) => p.id === targetProductId);
        if (found) {
          setSelectedProduct(found);
          setActiveTab('products');
        }
      } else if (prods.length > 0 && !selectedProduct) {
        setSelectedProduct(prods[0]);
      }
    } catch (e) {
      console.warn('Error loading products', e);
    }

    const mats = rawMaterialService.getRawMaterials();
    setMaterials(mats);

    const published = marketplaceService.getPublishedListings();
    setPublishedListings(published);
  };

  const handlePublishComplete = (listing: MarketplaceListing) => {
    const updated = marketplaceService.getPublishedListings();
    setPublishedListings(updated);
    setActiveTab('published');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col pb-24 max-w-md mx-auto">
      <Header
        title="Marketplace Publisher"
        showBack
        onBack={() => navigate('/dashboard')}
      />

      <main className="p-4 space-y-4">
        {/* Intro */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
            Multi-Channel Distribution
          </span>
          <h2 className="text-xl font-black text-stone-900 tracking-tight leading-snug">
            Publish Across National Marketplaces
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Broadcast your handcrafted products or surplus raw materials to ONDC, GeM, Amazon Karigar, and verified buyer networks in one click.
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-3 gap-1 bg-stone-200/80 p-1 rounded-2xl text-xs font-bold">
          <button
            type="button"
            onClick={() => setActiveTab('published')}
            className={`py-2 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'published'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Published ({publishedListings.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('products')}
            className={`py-2 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'products'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Products ({products.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('raw_materials')}
            className={`py-2 rounded-xl transition-colors cursor-pointer ${
              activeTab === 'raw_materials'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Materials ({materials.length})
          </button>
        </div>

        {/* Tab 1: Published Active Listings */}
        {activeTab === 'published' && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Active Marketplace Feeds
              </h3>
              <span className="text-xs text-stone-400">Sync: Automatic</span>
            </div>

            {publishedListings.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 space-y-3">
                <Globe className="w-10 h-10 text-stone-300 mx-auto" />
                <h4 className="font-bold text-stone-900 text-sm">No Published Listings Yet</h4>
                <p className="text-xs text-stone-500">
                  Select any product from your catalog or surplus raw materials to publish to national networks.
                </p>
                <button
                  type="button"
                  onClick={() => setActiveTab('products')}
                  className="py-2.5 px-4 rounded-xl bg-amber-700 text-white font-bold text-xs"
                >
                  Publish a Product
                </button>
              </div>
            ) : (
              publishedListings.map((listing) => (
                <div
                  key={listing.id}
                  className="bg-white rounded-3xl p-4 border-2 border-stone-200 shadow-xs space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Published Active
                    </span>
                    <span className="text-[11px] text-stone-400 font-medium">
                      {listing.publishedAt
                        ? new Date(listing.publishedAt).toLocaleDateString()
                        : 'Recent'}
                    </span>
                  </div>

                  <div className="flex gap-3">
                    {listing.imageUrl && (
                      <img
                        src={listing.imageUrl}
                        alt={listing.title}
                        className="w-16 h-16 rounded-2xl object-cover border border-stone-200 shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-stone-900 truncate">
                        {listing.title}
                      </h4>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="text-base font-black text-amber-900">
                          ₹{listing.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-xs text-stone-500">
                          Qty: {listing.quantity} {listing.unit || 'units'}
                        </span>
                      </div>
                      <span className="text-[11px] text-stone-500 block truncate mt-0.5">
                        {listing.category}
                      </span>
                    </div>
                  </div>

                  {/* Connected channels */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {listing.selectedMarketplaces.map((ch) => (
                        <span
                          key={ch}
                          className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-stone-100 text-stone-700"
                        >
                          {ch.toUpperCase()}
                        </span>
                      ))}
                    </div>

                    <span className="text-xs font-bold text-amber-800">
                      Live on Channels
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Publish Product */}
        {activeTab === 'products' && (
          <div className="space-y-4">
            {products.length === 0 ? (
              <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 space-y-3">
                <ShoppingBag className="w-10 h-10 text-stone-300 mx-auto" />
                <h4 className="font-bold text-stone-900 text-sm">No Products In Catalog</h4>
                <p className="text-xs text-stone-500">
                  Create your first product using photo and voice capture.
                </p>
                <button
                  type="button"
                  onClick={() => navigate('/add-product')}
                  className="py-2.5 px-4 rounded-xl bg-amber-700 text-white font-bold text-xs"
                >
                  + Add Product
                </button>
              </div>
            ) : (
              <>
                {/* Select which product to publish */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-stone-700 uppercase tracking-wider block">
                    Select Product to Publish:
                  </label>
                  <select
                    value={selectedProduct?.id || ''}
                    onChange={(e) => {
                      const found = products.find((p) => p.id === e.target.value);
                      if (found) setSelectedProduct(found);
                    }}
                    className="w-full text-xs font-semibold p-3 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-amber-700"
                  >
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.productName} (₹{p.suggestedPrice})
                      </option>
                    ))}
                  </select>
                </div>

                {selectedProduct && (
                  <MarketplacePublishCard
                    key={selectedProduct.id}
                    initialListing={{
                      type: 'product',
                      itemId: selectedProduct.id || 'prod-custom',
                      title: selectedProduct.productName,
                      description: selectedProduct.description,
                      price: selectedProduct.suggestedPrice || 450,
                      quantity: 1,
                      category: selectedProduct.category,
                      imageUrl:
                        selectedProduct.enhancedImageUrl || selectedProduct.imageUrl,
                      keywords: selectedProduct.keywords,
                      selectedMarketplaces: ['ondc', 'amazon_karigar', 'craftsvilla'],
                    }}
                    onPublishComplete={handlePublishComplete}
                  />
                )}
              </>
            )}
          </div>
        )}

        {/* Tab 3: Publish Raw Materials */}
        {activeTab === 'raw_materials' && (
          <div className="space-y-4">
            <div className="bg-amber-50 rounded-2xl p-3 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
              <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <span>
                Earn income by selling surplus unworked bamboo, clay, or yarn directly to craft clusters and regional buyers on ONDC & GeM.
              </span>
            </div>

            {materials.map((mat) => (
              <MarketplacePublishCard
                key={mat.id}
                initialListing={{
                  type: 'raw_material',
                  itemId: mat.id,
                  title: `${mat.name} (Surplus Material)`,
                  description:
                    mat.notes ||
                    `Locally harvested ${mat.name} available in bulk from artisan community stock.`,
                  price: mat.quantity * 45, // calculated rough estimate per kg
                  quantity: mat.quantity,
                  unit: mat.unit,
                  category: mat.category,
                  imageUrl: mat.imageUrl,
                  keywords: [mat.name, 'Raw Material', 'Artisan Supply'],
                  selectedMarketplaces: ['ondc', 'gem'],
                }}
                onPublishComplete={handlePublishComplete}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};
