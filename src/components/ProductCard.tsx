import React from 'react';
import { Sparkles, Tag, ChevronRight } from 'lucide-react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick?: () => void;
  featured?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onClick,
  featured = false,
}) => {
  const displayImage = product.enhancedImageUrl || product.imageUrl || 'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=600&q=80';
  const price = product.suggestedPrice || product.priceMin || 0;

  return (
    <div
      id={`product-card-${product.id || 'draft'}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={`group bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer text-left flex flex-col active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-amber-500 ${
        featured ? 'ring-2 ring-amber-500/30' : ''
      }`}
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={displayImage}
          alt={product.productName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
          referrerPolicy="no-referrer"
        />

        {/* Category Pill */}
        <div className="absolute top-2.5 left-2.5 bg-stone-900/75 backdrop-blur-xs text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center gap-1.5 shadow-xs">
          <Tag className="w-3 h-3 text-amber-400 shrink-0" />
          <span className="truncate max-w-[130px]">{product.category}</span>
        </div>

        {/* Enhanced badge if present */}
        {product.enhancedImageUrl && (
          <div className="absolute top-2.5 right-2.5 bg-amber-600 text-white text-[11px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 shadow-xs">
            <Sparkles className="w-3 h-3" />
            <span>AI Ready</span>
          </div>
        )}
      </div>

      {/* Details Container */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-stone-900 text-base leading-snug line-clamp-1 group-hover:text-amber-800 transition-colors">
            {product.productName}
          </h3>
          <p className="text-xs text-stone-500 mt-1 line-clamp-1">
            {product.material}
          </p>
        </div>

        <div className="mt-3 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase tracking-wider text-stone-400 font-bold block">
              Selling Price
            </span>
            <span className="text-lg font-extrabold text-stone-900 tracking-tight">
              ₹{price.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-stone-100 group-hover:bg-amber-100 group-hover:text-amber-800 text-stone-600 flex items-center justify-center transition-colors">
            <ChevronRight className="w-4 h-4" />
          </div>
        </div>
      </div>
    </div>
  );
};
