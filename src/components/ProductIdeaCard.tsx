import React from 'react';
import { Sparkles, Clock, IndianRupee, PlayCircle, PlusCircle, CheckCircle2 } from 'lucide-react';
import { ProductIdea } from '../types';

interface ProductIdeaCardProps {
  idea: ProductIdea;
  onLearnHow: (idea: ProductIdea) => void;
  onCreateProduct: (idea: ProductIdea) => void;
}

export const ProductIdeaCard: React.FC<ProductIdeaCardProps> = ({
  idea,
  onLearnHow,
  onCreateProduct,
}) => {
  const getDifficultyBadge = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Intermediate':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Advanced':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl p-5 border-2 border-stone-200/90 shadow-xs space-y-4">
      <div className="flex gap-3.5">
        <div className="w-24 h-24 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
          <img
            src={
              idea.imageUrl ||
              'https://images.unsplash.com/photo-1590736969955-71cc94801759?auto=format&fit=crop&w=400&q=80'
            }
            alt={idea.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-1">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getDifficultyBadge(
                idea.difficulty
              )}`}
            >
              {idea.difficulty}
            </span>
          </div>

          <h3 className="font-extrabold text-base text-stone-900 leading-snug">
            {idea.name}
          </h3>

          <p className="text-xs text-stone-600 mt-1 line-clamp-2 leading-relaxed">
            {idea.description}
          </p>
        </div>
      </div>

      {/* Specifications Strip */}
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/70">
          <div className="flex items-center gap-1 text-stone-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">
            <Clock className="w-3 h-3 text-stone-400" />
            <span>Estimated Effort</span>
          </div>
          <span className="font-bold text-stone-900">{idea.estimatedEffort}</span>
        </div>

        <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-200/70">
          <div className="flex items-center gap-1 text-stone-500 text-[10px] font-bold uppercase tracking-wider mb-0.5">
            <IndianRupee className="w-3 h-3 text-stone-400" />
            <span>Fair Selling Price</span>
          </div>
          <span className="font-black text-amber-800">
            {idea.priceRange || `₹${idea.estimatedPrice}`}
          </span>
        </div>
      </div>

      {/* Materials Required Tag Strip */}
      <div className="flex items-center gap-1.5 flex-wrap">
        <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
          Materials:
        </span>
        {idea.materials.map((mat, i) => (
          <span
            key={i}
            className="text-[11px] font-semibold bg-stone-100 text-stone-700 px-2.5 py-0.5 rounded-full"
          >
            {mat}
          </span>
        ))}
      </div>

      {/* Action Buttons: Learn How & Create Product */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          type="button"
          onClick={() => onLearnHow(idea)}
          className="py-2.5 px-3 rounded-xl border-2 border-stone-300 hover:bg-stone-50 text-stone-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
        >
          <PlayCircle className="w-4 h-4 text-stone-600" />
          <span>Learn How</span>
        </button>

        <button
          type="button"
          onClick={() => onCreateProduct(idea)}
          className="py-2.5 px-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create Product</span>
        </button>
      </div>
    </div>
  );
};
