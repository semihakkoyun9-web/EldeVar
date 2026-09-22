import React from 'react';
import { Home, Compass, Plus, ShoppingBag, User } from 'lucide-react';

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
  cartCount,
  onOpenSellerModal,
  className = '',
}) => {
  return (
    <nav
      className={`fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-lg border-t border-[#E8E2D8] text-stone-600 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-safe ${className}`}
    >
      <div className="max-w-md mx-auto px-1.5 h-16 flex items-center justify-around relative">
        {/* 1. Ana Sayfa */}
        <button
          onClick={() => onTabChange('home')}
          className={`flex flex-col items-center justify-center py-1 flex-1 transition-all active:scale-95 cursor-pointer ${
            activeTab === 'home' ? 'text-[#9E4424] font-bold' : 'text-stone-400 hover:text-stone-700'
          }`}
          aria-label="Ana Sayfa"
        >
          <Home className={`w-5 h-5 mb-0.5 ${activeTab === 'home' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight leading-none">Ana Sayfa</span>
        </button>

        {/* 2. Keşfet & Vitrin */}
        <button
          onClick={() => onTabChange('categories')}
          className={`flex flex-col items-center justify-center py-1 flex-1 transition-all active:scale-95 cursor-pointer ${
            activeTab === 'categories' ? 'text-[#9E4424] font-bold' : 'text-stone-400 hover:text-stone-700'
          }`}
          aria-label="Kategoriler ve Vitrin"
        >
          <Compass className={`w-5 h-5 mb-0.5 ${activeTab === 'categories' ? 'stroke-[2.5] text-[#9E4424]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight leading-none">Keşfet</span>
        </button>

        {/* 3. CENTER ELEVATED ACTION: + SAT (İlan Ver) */}
        <button
          onClick={onOpenSellerModal}
          className="flex flex-col items-center justify-center -mt-5 flex-1 group transition-all active:scale-90 cursor-pointer"
          aria-label="Eşya Sat & İlan Ver"
          title="Ücretsiz İlan Ver"
        >
          <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-[#873418] via-[#9E4424] to-[#C25835] text-white flex items-center justify-center shadow-lg shadow-[#9E4424]/30 ring-3 ring-white group-hover:shadow-xl transition-all">
            <Plus className="w-6 h-6 stroke-[2.8]" />
          </div>
          <span className="text-[10px] font-extrabold text-[#9E4424] mt-0.5 leading-none">
            Sat
          </span>
        </button>


        {/* 5. Sepetim */}
        <button
          onClick={() => onTabChange('cart')}
          className={`flex flex-col items-center justify-center py-1 flex-1 relative transition-all active:scale-95 cursor-pointer ${
            activeTab === 'cart' ? 'text-[#9E4424] font-bold' : 'text-stone-400 hover:text-stone-700'
          }`}
          aria-label="Sepetim"
        >
          <div className="relative">
            <ShoppingBag className={`w-5 h-5 mb-0.5 ${activeTab === 'cart' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-[#9E4424] text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] tracking-tight leading-none">Sepetim</span>
        </button>

        {/* 6. Hesabım & Dolabım */}
        <button
          onClick={() => onTabChange('menu')}
          className={`flex flex-col items-center justify-center py-1 flex-1 transition-all active:scale-95 cursor-pointer ${
            activeTab === 'menu' ? 'text-[#9E4424] font-bold' : 'text-stone-400 hover:text-stone-700'
          }`}
          aria-label="Hesabım ve Dolabım"
        >
          <User className={`w-5 h-5 mb-0.5 ${activeTab === 'menu' ? 'stroke-[2.5]' : 'stroke-[1.8]'}`} />
          <span className="text-[10px] tracking-tight leading-none">Hesabım</span>
        </button>
      </div>
    </nav>
  );
};
