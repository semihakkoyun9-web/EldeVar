import React from 'react';
import { Heart, ShoppingBag } from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from './ProductCard';

interface FavoritesViewProps {
  favoriteProducts: Product[];
  onToggleFavorite: (id: string) => void;
  onSelectProduct: (p: Product) => void;
  onQuickAddToCart: (p: Product) => void;
  onContinueShopping: () => void;
}

export const FavoritesView: React.FC<FavoritesViewProps> = ({
  favoriteProducts,
  onToggleFavorite,
  onSelectProduct,
  onQuickAddToCart,
  onContinueShopping,
}) => {
  if (favoriteProducts.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 bg-rose-50 text-rose-400 rounded-full flex items-center justify-center mx-auto mb-4">
          <Heart className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">Henüz Favoriniz Yok</h2>
        <p className="text-xs text-stone-500 mb-6 max-w-sm mx-auto">
          Beğendiğiniz vintage ve ikinci el eşyaların kalp simgesine basarak bu listeye ekleyebilirsiniz.
        </p>
        <button
          onClick={onContinueShopping}
          className="px-6 py-2.5 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-medium text-xs transition-all shadow-sm"
        >
          Hikâyeleri Keşfet
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-6 pb-28">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold text-stone-900 flex items-center gap-2">
            <span>Favorilerim</span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 text-rose-800">
              {favoriteProducts.length} Ürün
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Takip ettiğiniz ikinci el parçalar ve satıcılar
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
        {favoriteProducts.map((prod) => (
          <ProductCard
            key={prod.id}
            product={prod}
            isFavorite={true}
            onToggleFavorite={onToggleFavorite}
            onSelectProduct={onSelectProduct}
            onQuickAddToCart={onQuickAddToCart}
          />
        ))}
      </div>
    </div>
  );
};
