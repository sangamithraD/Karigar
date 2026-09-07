import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Search, PlayCircle, BookOpen, Filter, ExternalLink } from 'lucide-react';
import { Header } from '../components/Header';
import { BottomNav } from '../components/BottomNav';
import { TutorialCard } from '../components/TutorialCard';
import { tutorialService } from '../services/tutorialService';
import { TutorialVideo } from '../types';

export const CraftLearningPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || searchParams.get('idea') || '';

  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [selectedMaterial, setSelectedMaterial] = useState<string>('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All');
  const [tutorials, setTutorials] = useState<TutorialVideo[]>([]);

  useEffect(() => {
    loadTutorials();
  }, [searchQuery, selectedMaterial, selectedDifficulty]);

  const loadTutorials = () => {
    const list = tutorialService.getTutorials({
      materialCategory: selectedMaterial,
      difficulty: selectedDifficulty,
      searchQuery: searchQuery,
      productIdea: initialQuery,
    });
    setTutorials(list);
  };

  const materialFilters = ['All', 'Natural Fiber & Wood', 'Pottery & Clay', 'Textiles & Loom'];
  const difficultyFilters = ['All', 'Beginner', 'Intermediate', 'Advanced'];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col pb-24 max-w-md mx-auto">
      <Header
        title="Craft Learning Hub"
        showBack
        onBack={() => navigate('/dashboard')}
      />

      <main className="p-4 space-y-4">
        {/* Banner */}
        <div className="bg-white rounded-3xl p-5 border-2 border-stone-200 shadow-xs space-y-2">
          <span className="text-xs font-bold text-amber-800 uppercase tracking-wider block">
            Skills & Craftsmanship
          </span>
          <h2 className="text-xl font-black text-stone-900 tracking-tight leading-snug">
            Curated Artisan Tutorials
          </h2>
          <p className="text-xs text-stone-600 leading-relaxed">
            Free masterclass tutorials to refine traditional techniques, master new raw materials, and elevate product quality.
          </p>

          {/* Search Bar */}
          <div className="pt-2 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-5.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tutorials (e.g. bamboo basket, pottery)..."
              className="w-full text-xs font-semibold pl-10 pr-3 py-3 rounded-xl border border-stone-300 bg-stone-50 text-stone-900 focus:outline-none focus:border-amber-700 focus:bg-white"
            />
          </div>
        </div>

        {/* Filter Pills */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {materialFilters.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedMaterial(cat)}
                className={`px-3 py-1.5 rounded-full font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedMaterial === cat
                    ? 'bg-stone-900 text-white shadow-xs'
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
            {difficultyFilters.map((diff) => (
              <button
                key={diff}
                type="button"
                onClick={() => setSelectedDifficulty(diff)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                  selectedDifficulty === diff
                    ? 'bg-amber-700 text-white'
                    : 'bg-stone-200/80 text-stone-700 hover:bg-stone-300'
                }`}
              >
                {diff} Level
              </button>
            ))}
          </div>
        </div>

        {/* Tutorials List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-600">
              Tutorial Guides ({tutorials.length})
            </h3>
            <span className="text-[11px] text-stone-500">Opens YouTube directly</span>
          </div>

          {tutorials.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 text-center border border-stone-200 space-y-2">
              <PlayCircle className="w-10 h-10 text-stone-300 mx-auto" />
              <h3 className="font-bold text-stone-900 text-sm">No Tutorials Found</h3>
              <p className="text-xs text-stone-500">
                Try clearing search filters or searching for another craft term.
              </p>
            </div>
          ) : (
            tutorials.map((tut) => <TutorialCard key={tut.id} tutorial={tut} />)
          )}
        </div>
      </main>

      <BottomNav />
    </div>
  );
};
