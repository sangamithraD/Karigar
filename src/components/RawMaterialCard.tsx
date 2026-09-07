import React from 'react';
import { Sparkles, Trash2, ArrowRight } from 'lucide-react';
import { RawMaterial } from '../types';

interface RawMaterialCardProps {
  material: RawMaterial;
  onGetIdeas: (material: RawMaterial) => void;
  onDelete?: (id: string) => void;
}

export const RawMaterialCard: React.FC<RawMaterialCardProps> = ({
  material,
  onGetIdeas,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-3xl p-4 border-2 border-stone-200/90 shadow-xs flex flex-col justify-between space-y-3">
      <div className="flex items-start gap-3.5">
        <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
          <img
            src={
              material.imageUrl ||
              'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=400&q=80'
            }
            alt={material.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200/70">
              {material.category}
            </span>
            {onDelete && (
              <button
                type="button"
                onClick={() => onDelete(material.id)}
                className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                title="Remove Material"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <h3 className="font-extrabold text-base text-stone-900 mt-1 truncate">
            {material.name}
          </h3>

          <div className="mt-1 flex items-baseline gap-1 text-stone-700">
            <span className="text-xs text-stone-500 font-medium">In Stock:</span>
            <span className="text-sm font-black text-stone-900">
              {material.quantity} {material.unit}
            </span>
          </div>

          {material.notes && (
            <p className="text-xs text-stone-500 mt-1 line-clamp-2 leading-snug">
              {material.notes}
            </p>
          )}
        </div>
      </div>

      <div className="pt-2 border-t border-stone-100 flex items-center justify-end">
        <button
          type="button"
          onClick={() => onGetIdeas(material)}
          className="w-full py-2.5 px-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-xs transition-colors cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Get Ideas (What can I make?)</span>
          <ArrowRight className="w-3.5 h-3.5 ml-0.5" />
        </button>
      </div>
    </div>
  );
};
