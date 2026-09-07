import React, { useState } from 'react';
import { CheckCircle2, Globe, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';
import { CONNECTED_MARKETPLACES, marketplaceService } from '../services/marketplaceService';
import { MarketplaceListing } from '../types';

interface MarketplacePublishCardProps {
  initialListing: Omit<MarketplaceListing, 'id' | 'status' | 'publishedAt'>;
  onPublishComplete?: (listing: MarketplaceListing) => void;
}

export const MarketplacePublishCard: React.FC<MarketplacePublishCardProps> = ({
  initialListing,
  onPublishComplete,
}) => {
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    'ondc',
    'craftsvilla',
  ]);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishedListing, setPublishedListing] = useState<MarketplaceListing | null>(
    marketplaceService.getListingByItemId(initialListing.itemId) || null
  );

  const toggleChannel = (channelId: string) => {
    if (selectedChannels.includes(channelId)) {
      setSelectedChannels(selectedChannels.filter((c) => c !== channelId));
    } else {
      setSelectedChannels([...selectedChannels, channelId]);
    }
  };

  const handlePublish = async () => {
    if (selectedChannels.length === 0) {
      alert('Please select at least one marketplace platform.');
      return;
    }

    setIsPublishing(true);
    try {
      const res = await marketplaceService.publishListing({
        ...initialListing,
        selectedMarketplaces: selectedChannels,
      });
      setPublishedListing(res);
      if (onPublishComplete) {
        onPublishComplete(res);
      }
    } catch (e) {
      console.error('Publish error:', e);
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border-2 border-stone-200/90 shadow-xs space-y-5">
      {/* Listing Overview */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
            {initialListing.type === 'product' ? 'Finished Product Listing' : 'Raw Material Listing'}
          </span>
          {publishedListing?.status === 'published' && (
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              Published Active
            </span>
          )}
        </div>

        <div className="flex gap-3">
          {initialListing.imageUrl && (
            <img
              src={initialListing.imageUrl}
              alt={initialListing.title}
              className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
            />
          )}
          <div className="min-w-0 flex-1">
            <h3 className="font-extrabold text-base text-stone-900 truncate">
              {initialListing.title}
            </h3>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-base font-black text-amber-900">
                ₹{initialListing.price.toLocaleString('en-IN')}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Qty: {initialListing.quantity} {initialListing.unit || 'units'}
              </span>
            </div>
            <p className="text-[11px] text-stone-500 line-clamp-2 mt-0.5">
              {initialListing.description}
            </p>
          </div>
        </div>
      </div>

      {/* Marketplace Channel Selector */}
      <div className="pt-3 border-t border-stone-100 space-y-2.5">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-700">
            Marketplace Ready • Select Platforms
          </h4>
          <span className="text-[11px] text-stone-400 font-medium">
            {selectedChannels.length} selected
          </span>
        </div>

        <div className="space-y-2">
          {CONNECTED_MARKETPLACES.filter((m) =>
            m.supportedTypes.includes(initialListing.type)
          ).map((mp) => {
            const isChecked = selectedChannels.includes(mp.id);
            return (
              <label
                key={mp.id}
                className={`p-3 rounded-2xl border transition-colors flex items-start justify-between cursor-pointer ${
                  isChecked
                    ? 'border-amber-700 bg-amber-50/50'
                    : 'border-stone-200 bg-white hover:bg-stone-50'
                }`}
              >
                <div className="flex items-start gap-3 min-w-0 pr-2">
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleChannel(mp.id)}
                    className="mt-1 w-4 h-4 accent-amber-700 cursor-pointer"
                  />
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs text-stone-900">{mp.name}</span>
                      <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-600">
                        {mp.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500 leading-snug mt-0.5">
                      {mp.description}
                    </p>
                  </div>
                </div>
                <Globe className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              </label>
            );
          })}
        </div>
      </div>

      {/* Transparency Note */}
      <div className="bg-stone-50 rounded-xl p-2.5 flex items-center gap-2 text-stone-600 text-[11px]">
        <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0" />
        <span>
          Customer transactions happen on connected platforms. Payments credit directly to your bank account.
        </span>
      </div>

      {/* Publish Action Button */}
      <div className="pt-1">
        <button
          type="button"
          onClick={handlePublish}
          disabled={isPublishing}
          className="w-full min-h-[48px] rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
        >
          {isPublishing ? (
            <span>Publishing to Gateways...</span>
          ) : publishedListing?.status === 'published' ? (
            <>
              <CheckCircle2 className="w-4 h-4" />
              <span>Update Published Listing</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Publish Listing to {selectedChannels.length} Platforms</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
