/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Heart, ShoppingBag, Leaf, MapPin, Feather, Sparkles, BookOpen, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { FREE_SHIPPING_THRESHOLD } from '../data/mockData';
import { ConditionKey, CONDITION_THEMES, resolveConditionKey } from '../utils/conditionTheme';

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: (productId: string) => void;
  onSelectProduct: (product: Product) => void;
  onQuickAddToCart: (product: Product) => void;
  onOpenPassport?: (product: Product) => void;
  activeConditionFilter?: ConditionKey | 'all';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isFavorite,
  onToggleFavorite,
  onSelectProduct,
  onQuickAddToCart,
  onOpenPassport,
  activeConditionFilter,
}) => {
  const isFreeShipping = product.price >= FREE_SHIPPING_THRESHOLD;
  const conditionKey = product.conditionType || resolveConditionKey(product.condition);
  const theme = CONDITION_THEMES[conditionKey];
  const isHighlighted = activeConditionFilter === conditionKey;

  // Dynamic frame color based on condition as explicitly requested
  const frameBorderClass = isHighlighted
    ? `${theme.borderClass} ring-3 ${theme.borderClass.replace('border-', 'ring-')}/40 shadow-md`
    : `${theme.borderClass} border-2 hover:shadow-md hover:ring-2 hover:${theme.borderClass.replace('border-', 'ring-')}/25`;

  return (
    <article
      id={`product-card-${product.id}`}
      className={`bg-white rounded-2xl ${frameBorderClass} transition-all duration-300 overflow-hidden flex flex-col group relative`}
    >
      {/* Product Image Stage */}
      <div
        className="relative aspect-square w-full bg-[#FAF7F2] overflow-hidden cursor-pointer"
        onClick={() => onSelectProduct(product)}
      >
        <img
          src={product.images[0]}
          alt={product.title}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Top-Left: Condition Color Pill (Compact on mobile) */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 items-start z-10 max-w-[calc(100%-42px)]">
          <span
            className={`text-[9px] sm:text-[10px] font-bold tracking-tight px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full ${theme.badgeBgClass} ${theme.badgeTextClass} border ${theme.badgeBorderClass} shadow-xs flex items-center gap-1 sm:gap-1.5 backdrop-blur-xs truncate max-w-full`}
          >
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full shrink-0 animate-pulse" style={{ backgroundColor: theme.hexColor }} />
            <span className="truncate">{theme.label}</span>
          </span>

          {/* Story Era Seal */}
          {product.story && (
            <span className="text-[9px] sm:text-[10px] font-medium tracking-tight px-1.5 py-0.5 sm:px-2 rounded-full bg-[#1C1917]/80 backdrop-blur-xs text-[#F5EDE1] border border-white/20 flex items-center gap-1 shadow-xs truncate max-w-full">
              <Feather className="w-2.5 h-2.5 text-[#E69C24] shrink-0" />
              <span className="truncate">{product.story.eraOrYear}</span>
            </span>
          )}
        </div>

        {/* Top-Right: Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(product.id);
          }}
          className={`absolute top-2 right-2 p-1.5 sm:p-2 rounded-full backdrop-blur-md transition-all shadow-xs z-20 cursor-pointer ${
            isFavorite
              ? 'bg-white text-rose-500'
              : 'bg-white/90 text-stone-600 hover:bg-white hover:text-stone-900'
          }`}
          aria-label={isFavorite ? 'Favorilerden Çıkar' : 'Favorilere Ekle'}
        >
          <Heart className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isFavorite ? 'fill-rose-500 stroke-rose-500' : 'stroke-[2]'}`} />
        </button>

        {/* Bottom Bar on Image: Eco Savings & Size */}
        <div className="absolute bottom-1.5 left-1.5 right-1.5 flex items-center justify-between text-[9px] sm:text-[10px] bg-white/95 backdrop-blur-md text-stone-800 px-2 py-0.5 sm:py-1 rounded-lg border border-stone-200/80 shadow-2xs">
          <span className="flex items-center gap-1 text-emerald-700 font-semibold truncate">
            <Leaf className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-emerald-600 shrink-0" />
            <span>{product.ecoSavings.co2Kg} kg CO₂</span>
          </span>
          {product.size && (
            <span className="text-[9px] sm:text-[10px] font-bold text-stone-700 bg-stone-100 px-1 py-0.2 rounded border border-stone-200 shrink-0 ml-1">
              {product.size}
            </span>
          )}
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-2.5 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Brand & Origin City */}
          <div className="flex items-center justify-between text-[11px] sm:text-xs text-stone-500 mb-1">
            <span className="font-bold text-[#8C3F23] tracking-wide uppercase text-[9px] sm:text-[10px] truncate max-w-[65%]">
              {product.brand}
            </span>
            <span className="text-[9px] sm:text-[10px] text-stone-400 flex items-center gap-0.5 truncate max-w-[35%]">
              <MapPin className="w-2.5 h-2.5 shrink-0" />
              <span className="truncate">{product.story ? product.story.originCity.split('→')[0].trim() : product.seller.location.split(',')[0]}</span>
            </span>
          </div>

          {/* Title */}
          <h3
            onClick={() => onSelectProduct(product)}
            className="text-[#1C1917] font-medium text-xs sm:text-sm line-clamp-2 hover:text-[#9E4424] cursor-pointer transition-colors leading-snug font-serif"
          >
            {product.title}
          </h3>

          {/* Condition Accuracy Badge & Offer note */}
          <div className="mt-1 flex items-center gap-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200/80">
              <ShieldCheck className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
              <span>%{product.seller.conditionAccuracyRate || 99} Kondisyon Doğruluğu</span>
            </span>
            <span className="text-[9px] font-semibold text-amber-900 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
              💬 Teklife Açık
            </span>
            {product.conditionChecklist?.hasFlaws && (
              <span className="text-[9px] font-medium text-amber-800 bg-amber-50 px-1 py-0.5 rounded border border-amber-200">
                Kusur İlanda Belirtildi
              </span>
            )}
          </div>

          {/* Evocative Memory Quote */}
          {product.story && (
            <p className="mt-1.5 text-[10px] sm:text-[11px] text-stone-600 italic line-clamp-1 sm:line-clamp-2 leading-relaxed bg-[#FAF8F5] p-1.5 sm:p-2 rounded-lg border border-[#EDE7DD]">
              "{product.story.memoryQuote}"
            </p>
          )}

          {/* Signature Feature Button: Hafıza Pasaportunu Gör */}
          {onOpenPassport && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpenPassport(product);
              }}
              className="mt-2 w-full inline-flex items-center justify-center gap-1 py-1 px-1.5 rounded-lg text-[10px] font-semibold text-[#8C3F23] bg-[#FAF3EB] hover:bg-[#F3E5D3] border border-[#EBD4BF] transition-colors cursor-pointer group truncate"
            >
              <BookOpen className="w-3 h-3 text-[#9E4424] group-hover:scale-110 transition-transform shrink-0" />
              <span className="truncate">Hafıza Pasaportu ({product.passportCode || `EV-${product.id.slice(0, 4)}`})</span>
            </button>
          )}
        </div>

        {/* Price & Add to Cart */}
        <div className="pt-2 sm:pt-3 border-t border-[#F0EBE1] flex items-center justify-between gap-1.5 mt-2">
          <div className="min-w-0 flex-1">
            <div className="flex items-baseline gap-1 flex-wrap">
              <span className="text-sm sm:text-base font-extrabold text-[#1C1917] whitespace-nowrap">
                {product.price.toLocaleString('tr-TR')} TL
              </span>
              {product.originalPrice && (
                <span className="text-[10px] text-stone-400 line-through whitespace-nowrap">
                  {product.originalPrice.toLocaleString('tr-TR')} TL
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              {isFreeShipping && (
                <span className="text-[9px] text-emerald-700 font-semibold truncate">
                  Ücretsiz Kargo
                </span>
              )}
              <span className="text-[9px] text-stone-500 font-medium truncate">
                • Stok: {product.stock || 1} Adet
              </span>
            </div>
          </div>

          <button
            onClick={() => onQuickAddToCart(product)}
            className="p-2 sm:p-2.5 rounded-xl bg-[#2A241F] hover:bg-[#9E4424] active:scale-95 text-white transition-all shadow-2xs shrink-0 cursor-pointer"
            title="Sepete Ekle"
            aria-label="Sepete Ekle"
          >
            <ShoppingBag className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </article>
  );
};
