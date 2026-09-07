import React, { useState } from 'react';
import { BookOpen, Sparkles, Mic, Check } from 'lucide-react';
import { CraftStory } from '../types';
import { craftStoryService } from '../services/craftStoryService';

interface CraftStoryCardProps {
  craftStory?: CraftStory;
  productName?: string;
  material?: string;
  onSave?: (story: CraftStory) => void;
  editable?: boolean;
}

export const CraftStoryCard: React.FC<CraftStoryCardProps> = ({
  craftStory,
  productName,
  material,
  onSave,
  editable = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputNotes, setInputNotes] = useState(craftStory?.artisanNote || '');
  const [currentStory, setCurrentStory] = useState<CraftStory>(
    craftStory || craftStoryService.generateStoryFromInput('', productName, material)
  );
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateStory = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const generated = craftStoryService.generateStoryFromInput(inputNotes, productName, material);
      setCurrentStory(generated);
      if (onSave) {
        onSave(generated);
      }
      setIsGenerating(false);
      setIsEditing(false);
    }, 400);
  };

  return (
    <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200/90 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-700" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
            Artisan Craft Story
          </h4>
        </div>

        {editable && !isEditing && (
          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="text-xs font-semibold text-amber-800 hover:text-amber-900 cursor-pointer"
          >
            Customise Story
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="space-y-2.5 pt-1">
          <label className="text-xs text-stone-600 block">
            Tell the story of how you made this product (materials, hours, traditional technique):
          </label>
          <textarea
            rows={3}
            value={inputNotes}
            onChange={(e) => setInputNotes(e.target.value)}
            placeholder="e.g. This basket is handmade using locally harvested bamboo. It takes three hours of careful hand splitting and weaving."
            className="w-full text-xs font-medium p-2.5 rounded-xl border border-stone-300 bg-white text-stone-900 focus:outline-none focus:border-amber-700"
          />
          <div className="flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold text-stone-600 hover:bg-stone-100"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleGenerateStory}
              disabled={isGenerating}
              className="px-3 py-1.5 rounded-lg bg-amber-700 hover:bg-amber-800 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{isGenerating ? 'Synthesizing...' : 'Format with AI'}</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5 text-xs text-stone-700">
          <div>
            <span className="font-bold text-stone-900 block mb-0.5">The Maker's Story</span>
            <p className="italic text-stone-600 leading-relaxed bg-white p-2.5 rounded-xl border border-stone-200">
              {currentStory.shortStory}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1">
            <div className="bg-white p-2.5 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 text-[11px] block mb-0.5">Heritage</span>
              <p className="text-stone-600 leading-snug line-clamp-3">
                {currentStory.craftHeritage}
              </p>
            </div>
            <div className="bg-white p-2.5 rounded-xl border border-stone-200">
              <span className="font-bold text-stone-900 text-[11px] block mb-0.5">Handmade Craft</span>
              <p className="text-stone-600 leading-snug line-clamp-3">
                {currentStory.handmadeDetails}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
