/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Shirt, Radio, Home, Check, RotateCcw, Filter, DollarSign, Tag, Maximize2 } from 'lucide-react';
import { ProductCategory } from '../types';
import { ConditionKey, CONDITION_THEMES } from '../utils/conditionTheme';

interface CategoriesModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedCategory: ProductCategory | 'all';
  onSelectCategory: (cat: ProductCategory | 'all') => void;
  selectedSize?: string | 'all';
  onSelectSize?: (size: string | 'all') => void;
  selectedBrand?: string | 'all';
  onSelectBrand?: (brand: string | 'all') => void;
  priceRange?: 'all' | '0-500' | '500-1500' | '1500-3000' | '3000+';
  onSelectPriceRange?: (range: 'all' | '0-500' | '500-1500' | '1500-3000' | '3000+') => void;
  selectedCondition?: ConditionKey | 'all';
  onSelectCondition?: (cond: ConditionKey | 'all') => void;
  onResetAll?: () => void;
  matchingCount?: number;
}

export const CategoriesModal: React.FC<CategoriesModalProps> = ({
  isOpen,
  onClose,
  selectedCategory,
  onSelectCategory,
  selectedSize = 'all',
  onSelectSize,
  selectedBrand = 'all',
  onSelectBrand,
  priceRange = 'all',
  onSelectPriceRange,
  selectedCondition = 'all',
  onSelectCondition,
  onResetAll,
  matchingCount,
}) => {
  if (!isOpen) return null;

  const [activeFilterTab, setActiveFilterTab] = useState<'category' | 'size' | 'brand' | 'price' | 'condition'>('category');

  const categories = [
    {
      id: 'all' as const,
      title: 'Tüm Kategoriler',
      desc: 'Tüm giyim, teknoloji ve ev koleksiyonları',
      icon: Filter,
    },
    {
      id: 'kadin' as const,
      title: 'Kadın Giyim',
      desc: 'Vintage elbiseler, trikolar, paltolar ve kabanlar',
      icon: Shirt,
    },
    {
      id: 'erkek' as const,
      title: 'Erkek Giyim',
      desc: 'Deri bomber ceketler, vintage denimler ve gömlekler',
      icon: Shirt,
    },
    {
      id: 'cocuk' as const,
      title: 'Çocuk & Bebek',
      desc: 'Salopet tulumlar, ahşap oyuncaklar ve patenler',
      icon: Shirt,
    },
    {
      id: 'ayakkabi' as const,
      title: 'Ayakkabı',
      desc: 'Dr. Martens botlar, Converse sneaker ve makosenler',
      icon: Tag,
    },
    {
      id: 'canta_aksesuar' as const,
      title: 'Çanta & Aksesuar',
      desc: 'Hakiki deri çantalar, ipek fularlar ve kol saatleri',
      icon: Maximize2,
    },
    {
      id: 'elektronik' as const,
      title: 'Teknoloji & Analog Hafıza',
      desc: '35mm fotoğraf makineleri, pikaplar, kulaklıklar ve e-kitap',
      icon: Radio,
    },
    {
      id: 'ev_yasam' as const,
      title: 'Ev, Yaşam & Antika Eşyalar',
      desc: 'El dokuma kilimler, pirinç lambaderler ve masif sehpalar',
      icon: Home,
    },
  ];

  const standardSizes = [
    'all',
    'XS',
    'S',
    'M',
    'L',
    'XL',
    'W32/L32',
    '38 Numara',
    'Masaüstü / Standart',
  ];

  const standardBrands = [
    'all',
    "Levi's",
    'Schott NYC Vintage',
    'Burberry',
    'Vakko',
    'Dr. Martens',
    'Sony',
    'Yashica Japan',
    'Dual Germany',
    'Apple',
    'Amazon Kindle',
    'Anadolu Zanaat',
    'Mid-Century Design',
  ];

  const priceRanges: Array<{ id: 'all' | '0-500' | '500-1500' | '1500-3000' | '3000+'; label: string; desc: string }> = [
    { id: 'all', label: 'Tüm Fiyatlar', desc: 'Bütçe sınırı yok' },
    { id: '0-500', label: '0 - 500 TL', desc: 'Uygun fiyatlı ikinci el & aksesuarlar' },
    { id: '500-1500', label: '500 - 1.500 TL', desc: 'Popüler vintage giyim & ev eşyaları' },
    { id: '1500-3000', label: '1.500 - 3.000 TL', desc: 'Analog makineler, deri ceketler & kilimler' },
    { id: '3000+', label: '3.000 TL ve Üzeri', desc: 'Nadir koleksiyonluk pikaplar, paltolar & teknoloji' },
  ];

  const conditionsList: Array<{ id: ConditionKey | 'all'; label: string; dot: string; desc: string }> = [
    { id: 'all', label: 'Tüm Kondisyonlar', dot: '✨', desc: 'Tüm ürün durumları' },
    { id: 'yeni_gibi', label: 'Yeni Gibi (Kusursuz)', dot: '🟢', desc: 'Sıfır ayarında veya etiketsiz' },
    { id: 'az_kullanilmis', label: 'Az Kullanılmış (Çok İyi)', dot: '🔵', desc: 'Çok temiz, formu korunmuş' },
    { id: 'cok_kullanilmis', label: 'Çok Kullanılmış (Karakterli)', dot: '🟠', desc: 'Yaşanmışlık izi & doğal patina' },
    { id: 'vintage', label: 'Vintage (Koleksiyonluk)', dot: '🟤', desc: 'Dönem hatırası & antika değer' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1917]/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E4D8C4] overflow-hidden max-h-[94vh] sm:max-h-[90vh] animate-in fade-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200 flex flex-col">
        {/* Mobile Pull Indicator */}
        <div className="w-10 h-1 bg-stone-300 rounded-full mx-auto mt-2 sm:hidden shrink-0" />
        
        {/* Header */}
        <div className="bg-white border-b border-[#E8E2D8] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FAF3EB] text-[#8C3F23] border border-[#EBD5C0]">
              <Filter className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#1C1917]">
                Kategoriler & Standart Filtreler
              </h3>
              <p className="text-xs text-stone-500">
                Kategori, beden, marka, fiyat ve kondisyon filtreleri
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs Navigation */}
        <div className="bg-[#F6EFE6] border-b border-[#E8DFD3] px-4 flex items-center gap-2 overflow-x-auto no-scrollbar py-2">
          <button
            onClick={() => setActiveFilterTab('category')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeFilterTab === 'category'
                ? 'bg-white text-[#8C3F23] shadow-xs border border-[#DFD3C3]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            📁 Kategori
          </button>
          <button
            onClick={() => setActiveFilterTab('size')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeFilterTab === 'size'
                ? 'bg-white text-[#8C3F23] shadow-xs border border-[#DFD3C3]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            📏 Beden / Boy {selectedSize !== 'all' && `(${selectedSize})`}
          </button>
          <button
            onClick={() => setActiveFilterTab('brand')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeFilterTab === 'brand'
                ? 'bg-white text-[#8C3F23] shadow-xs border border-[#DFD3C3]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🏷️ Marka {selectedBrand !== 'all' && `(${selectedBrand})`}
          </button>
          <button
            onClick={() => setActiveFilterTab('price')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeFilterTab === 'price'
                ? 'bg-white text-[#8C3F23] shadow-xs border border-[#DFD3C3]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            💰 Fiyat {priceRange !== 'all' && `(Aktif)`}
          </button>
          <button
            onClick={() => setActiveFilterTab('condition')}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap ${
              activeFilterTab === 'condition'
                ? 'bg-white text-[#8C3F23] shadow-xs border border-[#DFD3C3]'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            🎨 Kondisyon {selectedCondition !== 'all' && `(${selectedCondition})`}
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="p-5 overflow-y-auto flex-1 font-sans">
          {/* 1. Category Tab */}
          {activeFilterTab === 'category' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Kategori Seçimi
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {categories.map((c) => {
                  const Icon = c.icon;
                  const isSelected = selectedCategory === c.id;
                  return (
                    <div
                      key={c.id}
                      onClick={() => onSelectCategory(c.id)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start justify-between ${
                        isSelected
                          ? 'bg-white border-[#9E4424] ring-2 ring-[#9E4424]/20 shadow-xs'
                          : 'bg-white border-[#E4DDCF] hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`p-2 rounded-xl ${
                            isSelected ? 'bg-[#9E4424] text-white' : 'bg-stone-100 text-stone-700'
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs sm:text-sm text-stone-900">{c.title}</h4>
                          <p className="text-[11px] text-stone-500 mt-0.5">{c.desc}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#9E4424] text-white flex items-center justify-center shrink-0">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 2. Size Tab */}
          {activeFilterTab === 'size' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                  Beden & Boy Seçimi
                </span>
                <span className="text-xs text-stone-500">Giysi, Jean & Ayakkabı</span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {standardSizes.map((s) => {
                  const isSelected = selectedSize === s;
                  return (
                    <button
                      key={s}
                      onClick={() => onSelectSize && onSelectSize(s)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-white border-[#9E4424] ring-2 ring-[#9E4424]/25 text-[#9E4424]'
                          : 'bg-white border-[#E2DBD0] text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      <span>{s === 'all' ? 'Tüm Bedenler' : s}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#9E4424]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Brand Tab */}
          {activeFilterTab === 'brand' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Marka Seçimi
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {standardBrands.map((b) => {
                  const isSelected = selectedBrand === b;
                  return (
                    <button
                      key={b}
                      onClick={() => onSelectBrand && onSelectBrand(b)}
                      className={`p-3 rounded-xl border text-left text-xs font-semibold transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-white border-[#9E4424] ring-2 ring-[#9E4424]/25 text-[#9E4424]'
                          : 'bg-white border-[#E2DBD0] text-stone-700 hover:border-stone-400'
                      }`}
                    >
                      <span className="truncate">{b === 'all' ? 'Tüm Markalar' : b}</span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-[#9E4424] shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* 4. Price Tab */}
          {activeFilterTab === 'price' && (
            <div className="space-y-3">
              <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                Fiyat Aralığı
              </span>
              <div className="space-y-2.5">
                {priceRanges.map((pr) => {
                  const isSelected = priceRange === pr.id;
                  return (
                    <div
                      key={pr.id}
                      onClick={() => onSelectPriceRange && onSelectPriceRange(pr.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-white border-[#9E4424] ring-2 ring-[#9E4424]/20 shadow-xs'
                          : 'bg-white border-[#E4DDCF] hover:border-stone-400'
                      }`}
                    >
                      <div>
                        <h5 className="font-bold text-xs sm:text-sm text-stone-900">{pr.label}</h5>
                        <p className="text-[11px] text-stone-500">{pr.desc}</p>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#9E4424] text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 5. Condition Tab */}
          {activeFilterTab === 'condition' && (
            <div className="space-y-3">
              <div>
                <span className="text-xs font-bold text-stone-500 uppercase tracking-wider block">
                  Kondisyon & Çerçeve Rengi
                </span>
                <p className="text-[11px] text-stone-500 mt-0.5">
                  Seçeceğiniz kondisyona göre ana sayfadaki ürün kartları ilgili renk çerçevesiyle parıldar.
                </p>
              </div>

              <div className="space-y-2.5">
                {conditionsList.map((cond) => {
                  const isSelected = selectedCondition === cond.id;
                  return (
                    <div
                      key={cond.id}
                      onClick={() => onSelectCondition && onSelectCondition(cond.id)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                        isSelected
                          ? 'bg-white border-[#9E4424] ring-2 ring-[#9E4424]/20 shadow-xs'
                          : 'bg-white border-[#E4DDCF] hover:border-stone-400'
                      }`}
                    >
                      <div className="flex items-center gap-2.5">
                        <span className="text-lg">{cond.dot}</span>
                        <div>
                          <h5 className="font-bold text-xs sm:text-sm text-stone-900">{cond.label}</h5>
                          <p className="text-[11px] text-stone-500">{cond.desc}</p>
                        </div>
                      </div>
                      {isSelected && (
                        <div className="w-5 h-5 rounded-full bg-[#9E4424] text-white flex items-center justify-center">
                          <Check className="w-3 h-3" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 sm:p-4 bg-white border-t border-[#E8E2D8] flex items-center justify-between pb-safe">
          <button
            onClick={() => {
              if (onResetAll) onResetAll();
            }}
            className="text-xs font-semibold text-stone-600 hover:text-stone-900 flex items-center gap-1.5 px-3 py-2 rounded-xl hover:bg-stone-100 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Filtreleri Temizle</span>
          </button>

          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-[#9E4424] hover:bg-[#85361A] text-white text-xs font-bold rounded-xl transition-all shadow-xs flex items-center gap-2"
          >
            <span>Filtreleri Uygula</span>
            {matchingCount !== undefined && (
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-[11px]">
                {matchingCount} Ürün
              </span>
            )}
          </button>
        </div>

      </div>
    </div>
  );
};
