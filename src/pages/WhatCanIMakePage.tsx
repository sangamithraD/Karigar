import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Sparkles, Filter, Check, Layers, ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { ProductIdeaCard } from '../components/ProductIdeaCard';
import { ideaService } from '../services/ideaService';
import { rawMaterialService } from '../services/rawMaterialService';
import { useProductCreation } from '../context/ProductCreationContext';
import { ProductIdea, RawMaterial } from '../types';

export const WhatCanIMakePage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const materialParam = searchParams.get('material');

  const { updateDraftProduct, setPhoto } = useProductCreation();

  const [availableMaterials, setAvailableMaterials] = useState<RawMaterial[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [ideas, setIdeas] = useState<ProductIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const mats = rawMaterialService.getRawMaterials();
    setAvailableMaterials(mats);

    if (materialParam) {
      setSelectedMaterials([materialParam]);
      loadIdeas([materialParam]);
    } else if (mats.length > 0) {
      const initial = [mats[0].name];
      setSelectedMaterials(initial);
      loadIdeas(initial);
    } else {
      loadIdeas([]);
    }
  }, [materialParam]);

  const loadIdeas = async (mats: string[]) => {
    setIsLoading(true);
    try {
      const result = await ideaService.generateProductIdeas(mats);
      setIdeas(result);
    } catch (e) {
      console.error('Error generating ideas', e);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleMaterial = (matName: string) => {
    let next: string[];
    if (selectedMaterials.includes(matName)) {
      next = selectedMaterials.filter((m) => m !== matName);
    } else {
      next = [...selectedMaterials, matName];
    }
    setSelectedMaterials(next);
    loadIdeas(next);
  };

  const handleLearnHow = (idea: ProductIdea) => {
    navigate(`/learning?idea=${encodeURIComponent(idea.name)}`);
  };

  const handleCreateProduct = (idea: ProductIdea) => {
    // Pre-populate draft product with idea data and forward into Add Product workflow
    updateDraftProduct({
      productName: idea.name,
      category: 'Artisan Handicrafts',
      material: idea.materials.join(', '),
      description: idea.description,
      suggestedPrice: idea.estimatedPrice,
    });
    if (idea.imageUrl) {
      setPhoto(idea.imageUrl);
    }
    // Navigate straight to photo/voice capture
    navigate('/add-product/photo');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col pb-24 max-w-md mx-auto">
      <Header
        title="What Can I Make?"
        showBack
        onBack={() => navigate('/dashboard')}
      />

      <main className="p-4 space-y-4">
        {/* Intro */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs space-y-3">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-xs uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>AI Craft Ideation</span>
          </div>

          <h2 className="text-xl font-black text-stone-900 tracking-tight leading-snug">
            Turn Raw Materials into High-Value Crafts
          </h2>

          <p className="text-xs text-stone-600 leading-relaxed">
            Select one or more raw materials you currently have in your workshop. Karigan will suggest profitable handicraft ideas with effort and price estimates.
          </p>

          {/* Raw Material Selectors (Multi-select pill chips) */}
          <div className="pt-2 border-t border-stone-100 space-y-2">
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Select Available Materials ({selectedMaterials.length} chosen):
            </span>

            <div className="flex flex-wrap gap-1.5">
              {availableMaterials.map((mat) => {
                const isSelected = selectedMaterials.includes(mat.name);
                return (
                  <button
                    key={mat.id}
                    type="button"
                    onClick={() => toggleMaterial(mat.name)}
                    className={`text-xs font-bold py-2 px-3 rounded-xl border flex items-center gap-1.5 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-amber-700 text-white border-amber-800 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-300 hover:bg-stone-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5" />}
                    <span>{mat.name}</span>
                    <span className="text-[10px] opacity-80">
                      ({mat.quantity} {mat.unit})
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Ideas Count Header */}
        <div className="flex items-center justify-between px-1">
          <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Recommended Craft Ideas ({ideas.length})
          </h3>
          {isLoading && (
            <span className="text-xs text-amber-800 font-semibold animate-pulse">
              Synthesizing craft ideas...
            </span>
          )}
        </div>

        {/* Ideas List */}
        <div className="space-y-4">
          {ideas.map((idea) => (
            <ProductIdeaCard
              key={idea.id}
              idea={idea}
              onLearnHow={handleLearnHow}
              onCreateProduct={handleCreateProduct}
            />
          ))}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
