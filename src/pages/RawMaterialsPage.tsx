import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Sparkles, Package, Layers, ArrowLeft } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { RawMaterialCard } from '../components/RawMaterialCard';
import { rawMaterialService } from '../services/rawMaterialService';
import { RawMaterial } from '../types';

export const RawMaterialsPage: React.FC = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<RawMaterial[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  useEffect(() => {
    loadMaterials();
  }, []);

  const loadMaterials = () => {
    const list = rawMaterialService.getRawMaterials();
    setMaterials(list);
  };

  const handleGetIdeas = (material: RawMaterial) => {
    navigate(`/ideas?material=${encodeURIComponent(material.name)}`);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Remove this raw material from your inventory?')) {
      rawMaterialService.deleteRawMaterial(id);
      loadMaterials();
    }
  };

  const categories = ['All', 'Natural Fiber & Wood', 'Pottery & Clay', 'Textiles & Loom'];

  const filteredMaterials = materials.filter((m) => {
    if (selectedCategory === 'All') return true;
    return m.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col pb-24 max-w-md mx-auto">
      <Header
        title="Raw Material Hub"
        showBack
        onBack={() => navigate('/dashboard')}
      />

      <main className="p-4 space-y-4">
        {/* Banner */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
              Inventory & Resources
            </span>
            <span className="text-xs font-bold text-stone-500">
              {materials.length} Materials
            </span>
          </div>
          <h2 className="text-xl font-black text-stone-900 tracking-tight leading-snug">
            Stored Raw Materials
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Record available surplus materials. Our AI assistant recommends what high-value products you can make with them.
          </p>

          <div className="pt-2">
            <button
              type="button"
              id="add-raw-material-btn"
              onClick={() => navigate('/raw-materials/add')}
              className="w-full py-3 px-4 rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>+ Record New Raw Material</span>
            </button>
          </div>
        </div>

        {/* Category Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Quick Explore "What Can I Make?" CTA */}
        <div
          onClick={() => navigate('/ideas')}
          className="bg-stone-900 text-white rounded-2xl p-4 flex items-center justify-between cursor-pointer hover:bg-stone-800 transition-colors shadow-xs"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-stone-800 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-white">What Can I Make?</h3>
              <p className="text-[11px] text-stone-400">
                Explore product ideas from your raw material combinations
              </p>
            </div>
          </div>
          <span className="text-xs font-bold text-amber-400">Explore →</span>
        </div>

        {/* Materials List */}
        {filteredMaterials.length === 0 ? (
          <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 space-y-3">
            <Package className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="font-bold text-stone-900 text-base">No Raw Materials Listed</h3>
            <p className="text-xs text-stone-500">
              Add your bamboo, clay, or yarn inventory to get intelligent product recommendations.
            </p>
            <button
              type="button"
              onClick={() => navigate('/raw-materials/add')}
              className="py-2 px-4 rounded-xl bg-amber-700 text-white font-bold text-xs"
            >
              + Add First Material
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredMaterials.map((mat) => (
              <RawMaterialCard
                key={mat.id}
                material={mat}
                onGetIdeas={handleGetIdeas}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      <BottomNav />
    </div>
  );
};
