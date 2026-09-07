import React, { useState } from 'react';
import { IndianRupee, HelpCircle, ChevronDown, ChevronUp, ShieldCheck, TrendingUp, Layers } from 'lucide-react';
import { PriceBreakdown } from '../types';

interface PriceCardProps {
  suggestedPrice: number;
  priceMin?: number;
  priceMax?: number;
  breakdown?: PriceBreakdown;
  rationale?: string;
  onPriceChange?: (newPrice: number) => void;
  editable?: boolean;
}

export const PriceCard: React.FC<PriceCardProps> = ({
  suggestedPrice,
  priceMin = Math.round(suggestedPrice * 0.9),
  priceMax = Math.round(suggestedPrice * 1.1),
  breakdown = {
    material: Math.round(suggestedPrice * 0.28),
    labour: Math.round(suggestedPrice * 0.52),
    packaging: Math.round(suggestedPrice * 0.09),
    marketAdjustment: Math.round(suggestedPrice * 0.11),
  },
  rationale = 'Calculated based on skilled artisan working hours, raw materials cost, eco packaging, and verified fair-trade market demand for handloom/handicraft goods.',
  onPriceChange,
  editable = true,
}) => {
  const [showRationale, setShowRationale] = useState(false);
  const [currentPrice, setCurrentPrice] = useState(suggestedPrice);

  const totalCalculated =
    breakdown.material + breakdown.labour + breakdown.packaging + breakdown.marketAdjustment;

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = Number(e.target.value);
    setCurrentPrice(val);
    onPriceChange?.(val);
  };

  return (
    <div
      id="price-recommendation-card"
      className="w-full bg-white rounded-2xl border-2 border-stone-200 overflow-hidden shadow-xs"
    >
      {/* Header Banner */}
      <div className="bg-stone-900 text-white p-5">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase tracking-wider font-bold text-amber-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            AI Fair-Trade Pricing
          </span>
          <span className="text-xs text-stone-300 font-medium">
            Market Range: ₹{priceMin} – ₹{priceMax}
          </span>
        </div>

        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-4xl font-black tracking-tight text-white flex items-center">
            ₹{currentPrice.toLocaleString('en-IN')}
          </span>
          <span className="text-stone-400 text-sm font-medium">
            (Recommended: ₹{suggestedPrice})
          </span>
        </div>

        {editable && (
          <div className="mt-4 pt-3 border-t border-stone-800">
            <div className="flex justify-between text-xs text-stone-300 mb-1 font-medium">
              <span>Adjust Your Price:</span>
              <span className="font-bold text-amber-400">₹{currentPrice}</span>
            </div>
            <input
              type="range"
              min={Math.round(priceMin * 0.85)}
              max={Math.round(priceMax * 1.2)}
              step={10}
              value={currentPrice}
              onChange={handleSliderChange}
              className="w-full accent-amber-500 cursor-pointer h-2 bg-stone-700 rounded-lg"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1">
              <span>₹{Math.round(priceMin * 0.85)}</span>
              <span>₹{Math.round(priceMax * 1.2)}</span>
            </div>
          </div>
        )}
      </div>

      {/* Cost Breakdown */}
      <div className="p-5">
        <h4 className="text-sm font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5 mb-3">
          <Layers className="w-4 h-4 text-stone-500" />
          Transparent Cost Breakdown
        </h4>

        <div className="space-y-2.5">
          {/* Material */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-600 font-medium flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-600" />
              Raw Material Cost
            </span>
            <span className="font-bold text-stone-900">₹{breakdown.material}</span>
          </div>

          {/* Labour */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-600 font-medium flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              Artisan Skilled Labour
            </span>
            <span className="font-bold text-stone-900">₹{breakdown.labour}</span>
          </div>

          {/* Packaging */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-600 font-medium flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
              Protective Packaging
            </span>
            <span className="font-bold text-stone-900">₹{breakdown.packaging}</span>
          </div>

          {/* Market Adjustment */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-stone-600 font-medium flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-purple-600" />
              Market Demand Adjustment
            </span>
            <span className="font-bold text-stone-900">₹{breakdown.marketAdjustment}</span>
          </div>
        </div>

        {/* Visual Progress Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden flex mt-4 bg-stone-100">
          <div
            style={{ width: `${(breakdown.material / totalCalculated) * 100}%` }}
            className="bg-amber-600 h-full"
            title="Material"
          />
          <div
            style={{ width: `${(breakdown.labour / totalCalculated) * 100}%` }}
            className="bg-emerald-600 h-full"
            title="Labour"
          />
          <div
            style={{ width: `${(breakdown.packaging / totalCalculated) * 100}%` }}
            className="bg-blue-600 h-full"
            title="Packaging"
          />
          <div
            style={{ width: `${(breakdown.marketAdjustment / totalCalculated) * 100}%` }}
            className="bg-purple-600 h-full"
            title="Market Adjustment"
          />
        </div>

        {/* Why this price toggle */}
        <div className="mt-5 pt-3 border-t border-stone-100">
          <button
            type="button"
            onClick={() => setShowRationale(!showRationale)}
            className="w-full flex items-center justify-between text-stone-700 hover:text-stone-900 text-sm font-semibold transition-colors cursor-pointer"
          >
            <span className="flex items-center gap-1.5 text-amber-900">
              <HelpCircle className="w-4 h-4 text-amber-700" />
              Why this price?
            </span>
            {showRationale ? (
              <ChevronUp className="w-4 h-4 text-stone-400" />
            ) : (
              <ChevronDown className="w-4 h-4 text-stone-400" />
            )}
          </button>

          {showRationale && (
            <div className="mt-2.5 p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 leading-relaxed">
              <p>{rationale}</p>
              <div className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-emerald-800">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                Ensures fair hourly wage and protects from predatory middlemen margins.
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
