import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Grid, Mic, Package, Sparkles } from 'lucide-react';
import { useVoiceAssistant } from '../context/VoiceAssistantContext';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { openAssistant } = useVoiceAssistant();

  const isHome = location.pathname === '/dashboard' || location.pathname === '/';
  const isCatalog = location.pathname === '/catalog' || location.pathname.startsWith('/products/');
  const isMaterials = location.pathname.startsWith('/raw-materials');
  const isIdeas = location.pathname.startsWith('/ideas');

  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 px-2 py-1.5 shadow-lg"
    >
      <div className="max-w-md mx-auto grid grid-cols-5 gap-0.5 items-center">
        {/* Home */}
        <button
          type="button"
          id="nav-dashboard-btn"
          onClick={() => navigate('/dashboard')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors cursor-pointer ${
            isHome ? 'text-amber-800 font-bold bg-amber-50/70' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Home</span>
        </button>

        {/* Products Catalog */}
        <button
          type="button"
          id="nav-catalog-btn"
          onClick={() => navigate('/catalog')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors cursor-pointer ${
            isCatalog
              ? 'text-amber-800 font-bold bg-amber-50/70'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Products</span>
        </button>

        {/* Center Prominent Voice Assistant Button */}
        <div className="flex flex-col items-center justify-center">
          <button
            type="button"
            id="nav-voice-assistant-btn"
            onClick={openAssistant}
            className="w-12 h-12 -mt-4 rounded-full bg-amber-700 hover:bg-amber-800 text-white flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer border-2 border-white"
            title="Voice Assistant"
          >
            <Mic className="w-6 h-6" />
          </button>
          <span className="text-[9px] font-bold text-amber-800 mt-0.5">Voice AI</span>
        </div>

        {/* Raw Materials */}
        <button
          type="button"
          id="nav-materials-btn"
          onClick={() => navigate('/raw-materials')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors cursor-pointer ${
            isMaterials ? 'text-amber-800 font-bold bg-amber-50/70' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Materials</span>
        </button>

        {/* Ideas ("What Can I Make?") */}
        <button
          type="button"
          id="nav-ideas-btn"
          onClick={() => navigate('/ideas')}
          className={`flex flex-col items-center justify-center py-1 rounded-xl transition-colors cursor-pointer ${
            isIdeas ? 'text-amber-800 font-bold bg-amber-50/70' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Sparkles className="w-5 h-5 mb-0.5" />
          <span className="text-[10px]">Ideas</span>
        </button>
      </div>
    </nav>
  );
};
