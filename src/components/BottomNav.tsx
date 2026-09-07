import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, PlusCircle, Grid } from 'lucide-react';

export const BottomNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/dashboard' || location.pathname === '/';
  const isAdd = location.pathname.startsWith('/add-product');
  const isCatalog = location.pathname === '/catalog' || location.pathname.startsWith('/products/');

  return (
    <nav
      id="bottom-navigation-bar"
      className="fixed bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-md border-t border-stone-200 px-4 py-2 shadow-lg"
    >
      <div className="max-w-md mx-auto grid grid-cols-3 gap-1">
        {/* Dashboard */}
        <button
          type="button"
          id="nav-dashboard-btn"
          onClick={() => navigate('/dashboard')}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-colors cursor-pointer ${
            isHome ? 'text-amber-800 font-bold bg-amber-50/70' : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Home className="w-5 h-5 mb-0.5" />
          <span className="text-xs">Home</span>
        </button>

        {/* Add Product (Prominent Primary) */}
        <button
          type="button"
          id="nav-add-btn"
          onClick={() => navigate('/add-product')}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-colors cursor-pointer ${
            isAdd ? 'text-orange-700 font-bold bg-orange-50' : 'text-orange-600 hover:text-orange-700'
          }`}
        >
          <PlusCircle className="w-6 h-6 mb-0.5 fill-orange-100 text-orange-600" />
          <span className="text-xs font-bold">+ Add Item</span>
        </button>

        {/* My Catalog */}
        <button
          type="button"
          id="nav-catalog-btn"
          onClick={() => navigate('/catalog')}
          className={`flex flex-col items-center justify-center py-1.5 px-2 rounded-xl transition-colors cursor-pointer ${
            isCatalog && !isAdd
              ? 'text-amber-800 font-bold bg-amber-50/70'
              : 'text-stone-500 hover:text-stone-800'
          }`}
        >
          <Grid className="w-5 h-5 mb-0.5" />
          <span className="text-xs">My Catalog</span>
        </button>
      </div>
    </nav>
  );
};
