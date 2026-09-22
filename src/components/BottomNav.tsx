import React from 'react';
import { Home, Compass, Heart, ShoppingBag, Search } from 'lucide-react';

export type TabType = 'home' | 'categories' | 'wanted' | 'favorites' | 'cart' | 'menu';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
  favoritesCount: number;
  cartCount: number;
  onOpenSellerModal: () => void;
  className?: string;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onTabChange,
  favoritesCount,
  cartCount,
  onOpenSellerModal,
  className = '',
}) => {
  return (
    <nav className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E8E2D8] text-stone-600 shadow-lg pb-safe ${className}`}>
      <div className="max-w-md mx-auto px-2 h-16 flex items-center justify-between relative">
        {/* 1. Ana Sayfa */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'home' ? 'text-[#9E4424] font-semibold' : 'text-stone-400 hover:text-stone-700'
          }`}
          aria-label="Ana Sayfa"
        >
          <Home className={`w-5 h-5 mb-0.5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight">Ana Sayfa</span>
        </button>

        {/* 2. Kategoriler */}
        <button
          onClick={() => onTabChange('categories')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'categories' ? 'text-[#9E4424] font-semibold' : 'text-stone-400 hover:text-stone-700'
          }`}
          aria-label="Kategoriler"
        >
          <Compass className={`w-5 h-5 mb-0.5 ${activeTab === 'categories' ? 'stroke-[2.5] text-[#9E4424]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight">Kategoriler</span>
        </button>

        {/* 3. Bunu Arıyorum */}
        <button
          onClick={() => onTabChange('wanted')}
          className={`flex flex-col items-center justify-center flex-1 py-1 transition-colors ${
            activeTab === 'wanted' ? 'text-[#9E4424] font-bold' : 'text-stone-400 hover:text-stone-700'
          }`}
          aria-label="Bunu Arıyorum"
        >
          <Search className={`w-5 h-5 mb-0.5 ${activeTab === 'wanted' ? 'stroke-[2.5] text-[#9E4424]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight whitespace-nowrap">Bunu Arıyorum</span>
        </button>

        {/* 4. Favorilerim */}
        <button
          onClick={() => onTabChange('favorites')}
          className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-colors ${
            activeTab === 'favorites' ? 'text-[#9E4424] font-semibold' : 'text-stone-400 hover:text-stone-700'
          }`}
          aria-label="Favorilerim"
        >
          <div className="relative">
            <Heart className={`w-5 h-5 mb-0.5 ${activeTab === 'favorites' ? 'fill-[#9E4424] stroke-[#9E4424]' : 'stroke-[1.8]'}`} />
            {favoritesCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#9E4424] text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {favoritesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Favoriler</span>
        </button>

        {/* 5. Sepetim */}
        <button
          onClick={() => onTabChange('cart')}
          className={`flex flex-col items-center justify-center flex-1 py-1 relative transition-colors ${
            activeTab === 'cart' ? 'text-[#9E4424] font-semibold' : 'text-stone-400 hover:text-stone-700'
          }`}
          aria-label="Sepetim"
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 mb-0.5 ${activeTab === 'cart' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#9E4424] text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight">Sepetim</span>
        </button>
      </div>
    </nav>
  );
};
