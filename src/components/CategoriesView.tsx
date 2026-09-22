/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Product, ProductCategory } from '../types';
import { ProductCard } from './ProductCard';
import { DesktopSidebar } from './DesktopSidebar';
import { StandardFilters } from './StandardFilterBar';
import { ConditionKey } from '../utils/conditionTheme';
import { SlidersHorizontal, Sparkles, ArrowUpDown, ChevronRight } from 'lucide-react';

interface CategoriesViewProps {
  products: Product[];
  filteredProducts: Product[];
  standardFilters: StandardFilters;
  onFilterChange: <K extends keyof StandardFilters>(key: K, value: StandardFilters[K]) => void;
  onResetFilters: () => void;
  selectedCondition: ConditionKey | 'all';
  onSelectCondition: (cond: ConditionKey | 'all') => void;
  conditionCounts: Record<ConditionKey | 'all', number>;
  categoryCounts: Record<ProductCategory | 'all', number>;
  availableBrands: string[];
  availableSizes: string[];
  favorites: string[];
  onToggleFavorite: (id: string) => void;
  onSelectProduct: (p: Product) => void;
  onQuickAddToCart: (p: Product) => void;
  onOpenPassport: (p: Product) => void;
  onOpenPassportSample: () => void;
  onOpenAdvancedModal: () => void;
  onNavigateHome: () => void;
  searchQuery?: string;
  onSearchChange?: (q: string) => void;
}

export const CategoriesView: React.FC<CategoriesViewProps> = ({
  filteredProducts,
  standardFilters,
  onFilterChange,
  onResetFilters,
  selectedCondition,
  onSelectCondition,
  conditionCounts,
  categoryCounts,
  availableBrands,
  availableSizes,
  favorites,
  onToggleFavorite,
  onSelectProduct,
  onQuickAddToCart,
  onOpenPassport,
  onOpenPassportSample,
  onOpenAdvancedModal,
  onNavigateHome,
  searchQuery = '',
  onSearchChange,
}) => {
  const getCategoryTitle = () => {
    switch (standardFilters.category) {
      case 'kadin':
        return 'Kadın Giyim & Moda';
      case 'erkek':
        return 'Erkek Giyim & Moda';
      case 'cocuk':
        return 'Çocuk & Bebek';
      case 'ayakkabi':
        return 'Ayakkabı & Sneaker';
      case 'canta_aksesuar':
        return 'Çanta & Aksesuar';
      case 'elektronik':
        return 'Elektronik & Nostalji';
      case 'ev_yasam':
        return 'Ev & Yaşam';
      default:
        return 'Tüm Kategoriler & Eşyalar';
    }
  };

  const categorySubtags: Record<string, string[]> = {
    all: ['Elbise', 'Deri Ceket', 'Kot Pantolon', 'Sneaker', 'Analog Fotoğraf', 'Pikap', 'Kilim'],
    kadin: ['Midi Elbise', 'Yün Palto', 'Triko Kazak', 'Etek', 'Gömlek', 'Trençkot'],
    erkek: ['Bomber Ceket', 'Levi\'s 501', 'Oxford Gömlek', 'Sweatshirt', 'Deri Kaban'],
    cocuk: ['Salopet Tulum', 'Retro Paten', 'Ahşap Oyuncak', 'Bebek Kıyafeti'],
    ayakkabi: ['Dr. Martens Bot', 'Converse Sneaker', 'Deri Loafer', 'Klasik Ayakkabı'],
    canta_aksesuar: ['Hakiki Deri Çanta', 'Vakko İpek Fular', 'Kol Saati', 'Güneş Gözlüğü'],
    elektronik: ['35mm Analog Makine', 'Pikap & Ses', 'Sony Kulaklık', 'Kindle E-Kitap', 'Apple Watch'],
    ev_yasam: ['El Dokuma Kilim', 'Dual Pikap', 'Pirinç Lamba', 'İskandinav Sehpa', 'Porselen'],
  };

  const activeSubtags = categorySubtags[standardFilters.category] || categorySubtags.all;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 pb-24 space-y-6">
      {/* Breadcrumb Navigation & Top Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[#E8E2D8]">
        <div className="flex items-center gap-2 text-xs text-stone-500 font-sans flex-wrap">
          {/* 1. Ana Sayfa Butonu */}
          <button
            onClick={onNavigateHome}
            className="hover:text-[#9E4424] hover:underline font-medium transition-colors cursor-pointer"
            title="Ana Sayfaya Dön"
          >
            Ana Sayfa
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />

          {/* 2. Kategoriler Butonu */}
          <button
            onClick={() => {
              onFilterChange('category', 'all');
              onResetFilters();
            }}
            className="hover:text-[#9E4424] hover:underline font-medium transition-colors cursor-pointer"
            title="Tüm Kategorileri Listele"
          >
            Kategoriler
          </button>

          <ChevronRight className="w-3.5 h-3.5 text-stone-400" />

          {/* 3. Aktif Kategori / Tüm Eşyalar Butonu */}
          <button
            onClick={() => onResetFilters()}
            className="font-bold text-[#9E4424] hover:underline transition-colors cursor-pointer"
            title="Kategori filtrelerini sıfırla"
          >
            {getCategoryTitle()}
          </button>
        </div>

        {/* Mobile Filter Trigger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={onOpenAdvancedModal}
            className="flex-1 py-2 px-3.5 bg-white border border-[#DFCBB6] text-stone-800 font-semibold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer active:scale-95"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#9E4424]" />
            <span>Filtreleri Düzenle</span>
          </button>
        </div>
      </div>

      {/* Main Two-Column Layout: Left Sidebar + Right Products Grid */}
      <div className="flex items-start gap-8">
        {/* SOL FİLTRE PANELİ (KULLANICININ İSTEDİĞİ SOLDA FİLTRE BÖLÜMÜ) */}
        <div className="hidden lg:block shrink-0">
          <DesktopSidebar
            filters={standardFilters}
            onChangeFilter={onFilterChange}
            onResetFilters={onResetFilters}
            selectedCondition={selectedCondition}
            onSelectCondition={onSelectCondition}
            conditionCounts={conditionCounts}
            categoryCounts={categoryCounts}
            availableBrands={availableBrands}
            availableSizes={availableSizes}
            onOpenPassportSample={onOpenPassportSample}
          />
        </div>

        {/* SAĞ ÜRÜN VE LİSTELEME ALANI */}
        <main className="flex-1 min-w-0 space-y-5">
          {/* Header Row: Title, Subtags, and Results Count */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl sm:text-2xl font-serif font-black text-stone-900 tracking-tight">
                  {getCategoryTitle()}
                </h1>
                <p className="text-xs text-stone-500 font-sans mt-0.5">
                  Önceki sahibinin hatırasıyla gelen, doğrulanmış ve döngüsel parçalar
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white border border-[#E2DBD0] text-stone-700 shadow-2xs">
                  {filteredProducts.length} Ürün Listelendi
                </span>
              </div>
            </div>

            {/* Quick subcategory tags */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
              <span className="text-[11px] font-semibold text-stone-500 shrink-0">Popüler Etiketler:</span>
              {activeSubtags.map((tag, idx) => {
                const isActive = searchQuery.toLowerCase() === tag.toLowerCase();
                return (
                  <button
                    key={idx}
                    onClick={() => {
                      if (onSearchChange) {
                        onSearchChange(isActive ? '' : tag);
                      }
                    }}
                    className={`px-3 py-1 rounded-full text-xs border transition-all whitespace-nowrap shadow-2xs cursor-pointer ${
                      isActive
                        ? 'bg-[#9E4424] text-white border-[#9E4424] font-bold shadow-xs'
                        : 'bg-white hover:bg-stone-50 text-stone-700 border-[#E5DDD1] hover:border-[#9E4424] hover:text-[#9E4424]'
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Ürünler Izgarası */}
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-[#E8E2D8] p-8 shadow-xs max-w-lg mx-auto">
              <div className="w-14 h-14 rounded-2xl bg-[#FAF4ED] text-[#9E4424] flex items-center justify-center mx-auto mb-3 border border-[#EBD6C3]">
                <Sparkles className="w-6 h-6" />
              </div>
              <h3 className="text-base font-serif font-bold text-stone-900 mb-1">
                Kriterlerinize Uygun Eşya Bulunamadı
              </h3>
              <p className="text-xs text-stone-600 mb-5 leading-relaxed font-sans max-w-sm mx-auto">
                Seçtiğiniz kategori veya filtre kombinasyonunda henüz listelenmiş eşya bulunmuyor. Filtreleri temizleyerek tüm eşyaları görüntüleyebilirsiniz.
              </p>
              <button
                onClick={onResetFilters}
                className="px-5 py-2.5 bg-[#9E4424] hover:bg-[#85361A] text-white rounded-xl text-xs font-bold shadow-xs transition-colors cursor-pointer"
              >
                Filtreleri Temizle
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-4 sm:gap-5">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isFavorite={favorites.includes(product.id)}
                  onToggleFavorite={onToggleFavorite}
                  onSelectProduct={onSelectProduct}
                  onQuickAddToCart={onQuickAddToCart}
                  activeConditionFilter={selectedCondition}
                  onOpenPassport={onOpenPassport}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
