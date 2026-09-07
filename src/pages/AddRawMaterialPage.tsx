import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, Check, ArrowLeft, Package, Sparkles } from 'lucide-react';
import { Header } from '../components/Header';
import { rawMaterialService } from '../services/rawMaterialService';

export const AddRawMaterialPage: React.FC = () => {
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number>(10);
  const [unit, setUnit] = useState('kg');
  const [category, setCategory] = useState('Natural Fiber & Wood');
  const [notes, setNotes] = useState('');
  const [imageUrl, setImageUrl] = useState(
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=600&q=80'
  );

  const categories = [
    'Natural Fiber & Wood',
    'Pottery & Clay',
    'Textiles & Loom',
    'Metal & Stone',
    'Natural Dyes & Pigments',
  ];

  const units = ['kg', 'grams', 'meters', 'bundles', 'pieces'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      alert('Please enter a material name');
      return;
    }

    rawMaterialService.saveRawMaterial({
      name: name.trim(),
      quantity: Number(quantity) || 1,
      unit,
      category,
      imageUrl,
      notes,
    });

    navigate('/raw-materials');
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col pb-12 max-w-md mx-auto">
      <Header
        title="Add Raw Material"
        showBack
        onBack={() => navigate('/raw-materials')}
      />

      <main className="p-4 space-y-4">
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs space-y-4">
          <div>
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
              Inventory Entry
            </span>
            <h2 className="text-lg font-black text-stone-900 tracking-tight">
              Record Raw Material
            </h2>
            <p className="text-xs text-stone-600">
              Save available surplus craft supplies so Karigan can suggest product ideas.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Material Name */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Material Name *
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bamboo poles, Terracotta clay, Cotton yarn"
                className="w-full text-sm font-semibold p-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 focus:outline-none focus:border-amber-700 focus:bg-white"
              />
            </div>

            {/* Quantity and Unit */}
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full text-sm font-semibold p-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 focus:outline-none focus:border-amber-700 focus:bg-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Unit *
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  className="w-full text-sm font-semibold p-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 focus:outline-none focus:border-amber-700 focus:bg-white"
                >
                  {units.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full text-sm font-semibold p-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 focus:outline-none focus:border-amber-700 focus:bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                Notes / Condition (Optional)
              </label>
              <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Dry season bamboo, ready for splitting"
                className="w-full text-xs font-medium p-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 focus:outline-none focus:border-amber-700 focus:bg-white"
              />
            </div>

            {/* Submit */}
            <div className="pt-2">
              <button
                type="submit"
                className="w-full min-h-[48px] rounded-2xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Save to Raw Material Hub</span>
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};
