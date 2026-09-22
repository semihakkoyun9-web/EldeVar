/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Heart, ShoppingBag, ShieldCheck, Leaf, Truck, MapPin, CheckCircle, MessageSquare, Layers, Feather, Sparkles, BookOpen } from 'lucide-react';
import { Product, ProductVariation } from '../types';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '../data/mockData';
import { resolveConditionKey, CONDITION_THEMES } from '../utils/conditionTheme';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onAddToCart: (product: Product, variation?: ProductVariation) => void;
  onBuyNow: (product: Product, variation?: ProductVariation) => void;
  onOpenPassport?: (product: Product) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  isFavorite,
  onToggleFavorite,
  onAddToCart,
  onBuyNow,
  onOpenPassport,
}) => {
  if (!product) return null;

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedVariation, setSelectedVariation] = useState<ProductVariation | undefined>(
    product.variations && product.variations.length > 0 ? product.variations[0] : undefined
  );
  const [questionSent, setQuestionSent] = useState(false);
  const [questionText, setQuestionText] = useState('');
  const [showQuestionBox, setShowQuestionBox] = useState(false);

  const currentPrice = selectedVariation ? selectedVariation.price : product.price;
  const isFreeShipping = currentPrice >= FREE_SHIPPING_THRESHOLD;
  const conditionKey = product.conditionType || resolveConditionKey(product.condition);
  const conditionTheme = CONDITION_THEMES[conditionKey];

  const handleSendQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!questionText.trim()) return;
    setQuestionSent(true);
    setTimeout(() => {
      setQuestionSent(false);
      setShowQuestionBox(false);
      setQuestionText('');
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1917]/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] w-full max-w-4xl rounded-2xl shadow-2xl border border-[#E8E2D8] overflow-hidden my-auto max-h-[92vh] flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 p-2 rounded-full bg-white/90 hover:bg-white text-stone-700 shadow-md backdrop-blur-md transition-colors"
          aria-label="Kapat"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Scrollable Body */}
        <div className="overflow-y-auto p-4 sm:p-7 grid grid-cols-1 md:grid-cols-2 gap-7">
          {/* Left: Image Gallery & Eco Savings */}
          <div>
            <div className={`relative aspect-square w-full rounded-2xl overflow-hidden bg-white border-2 ${conditionTheme.borderClass} shadow-xs`}>
              <img
                src={product.images[activeImageIndex] || product.images[0]}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => onToggleFavorite(product.id)}
                className={`absolute top-3 left-3 p-2.5 rounded-full backdrop-blur-md shadow-md transition-all ${
                  isFavorite ? 'bg-white text-rose-500' : 'bg-white/85 text-stone-700 hover:bg-white'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500 stroke-rose-500' : ''}`} />
              </button>

              {/* Provenance Badge */}
              {product.story && (
                <div className="absolute bottom-3 left-3">
                  <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-[#1C1917]/85 backdrop-blur-xs text-[#FAF5ED] border border-white/20 flex items-center gap-1.5 shadow-sm">
                    <Feather className="w-3 h-3 text-amber-400" />
                    <span>{product.story.travelBadge}</span>
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail switcher */}
            {product.images.length > 1 && (
              <div className="flex gap-2.5 mt-3 overflow-x-auto pb-1">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`w-16 h-16 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                      activeImageIndex === idx ? 'border-[#9E4424] ring-2 ring-[#9E4424]/20' : 'border-[#E4DDCF] opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}

            {/* Eco Impact Box */}
            <div className="mt-4 p-4 rounded-xl bg-[#EFF6EE] border border-[#CFE4CE] text-[#204422] text-xs">
              <div className="flex items-center gap-2 font-bold text-[#1C4620] mb-1.5">
                <Leaf className="w-4 h-4 text-emerald-600" />
                <span>Bu İkinci El Tercihinin Gezegene Katkısı:</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px] pt-1.5 border-t border-[#C3DDC2]">
                <div>
                  <span className="font-bold text-[#163819] block text-sm">{product.ecoSavings.co2Kg} kg</span>
                  <span className="text-[#325A34]">Karbon salınımı engellendi</span>
                </div>
                <div>
                  <span className="font-bold text-[#163819] block text-sm">{product.ecoSavings.waterLiters.toLocaleString('tr-TR')} Litre</span>
                  <span className="text-[#325A34]">Temiz su tasarruf edildi</span>
                </div>
              </div>
            </div>

            {/* Signature Feature Link: Hafıza Pasaportu */}
            {onOpenPassport && (
              <button
                onClick={() => onOpenPassport(product)}
                className="mt-3 w-full p-3.5 rounded-xl bg-[#FAF3EB] hover:bg-[#F4E6D5] border border-[#E8D4BF] text-[#8C3F23] font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-2xs"
              >
                <BookOpen className="w-4 h-4 text-[#9E4424]" />
                <span>📜 Eşya Hafıza Pasaportunu & Mum Mühürlü Zarfı Aç</span>
              </button>
            )}
          </div>

          {/* Right: Product, Memory Passport & Actions */}
          <div className="flex flex-col justify-between space-y-4">
            <div>
              {/* Category, Condition & Brand */}
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white text-stone-700 border border-[#E2DBD0]">
                  {product.categoryLabel}
                </span>
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${conditionTheme.badgeBgClass} ${conditionTheme.badgeTextClass} border ${conditionTheme.badgeBorderClass} flex items-center gap-1.5`}
                >
                  <span className="w-2 h-2 rounded-full" style={{ backgroundColor: conditionTheme.hexColor }} />
                  {conditionTheme.label}
                </span>
                {product.size && (
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                    Beden: {product.size}
                  </span>
                )}
                <span className="text-xs font-medium text-stone-500 ml-auto">
                  {product.brand}
                </span>
              </div>

              {/* Title */}
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1C1917] leading-snug">
                {product.title}
              </h2>

              {/* Price Row */}
              <div className="mt-3 flex items-baseline gap-3">
                <span className="text-2xl sm:text-3xl font-extrabold text-[#1C1917] font-sans">
                  {currentPrice.toLocaleString('tr-TR')} TL
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-stone-400 line-through">
                    {product.originalPrice.toLocaleString('tr-TR')} TL
                  </span>
                )}
                {isFreeShipping ? (
                  <span className="text-xs font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-md">
                    Ücretsiz Kargo
                  </span>
                ) : (
                  <span className="text-xs text-stone-500">
                    +{STANDARD_SHIPPING_FEE.toFixed(2)} TL Kargo
                  </span>
                )}
              </div>

              {/* Memory Passport Box */}
              {product.story && (
                <div className="mt-4 p-4 rounded-xl bg-white border border-[#E4DDCF] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between border-b border-[#F0EBE1] pb-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#9E4424]" />
                      <span className="font-serif font-bold text-xs uppercase tracking-wider text-[#1C1917]">
                        Eşyanın Hafıza Pasaportu
                      </span>
                    </div>
                    <span className="text-[11px] font-medium text-stone-500 bg-[#FAF8F5] px-2 py-0.5 rounded-md border border-[#E8E2D8]">
                      {product.story.eraOrYear} • {product.story.originCity}
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 leading-relaxed font-sans">
                    {product.story.storyDetail}
                  </p>

                  <div className="p-2.5 rounded-lg bg-[#FAF5EE] border-l-3 border-[#9E4424] text-xs text-stone-700 italic">
                    <span className="font-bold text-[#9E4424] not-italic block text-[11px] mb-0.5">
                      Satıcının Hatıra Notu:
                    </span>
                    "{product.story.sellerFarewell}"
                  </div>
                </div>
              )}

              {/* Variable Product Options */}
              {product.isVariable && product.variations && (
                <div className="mt-4 p-3.5 rounded-xl bg-white border border-[#E4DDCF]">
                  <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5 mb-2">
                    <Layers className="w-3.5 h-3.5 text-[#9E4424]" />
                    <span>Mevcut Varyasyon Seçimi:</span>
                  </label>
                  <div className="grid grid-cols-1 gap-1.5">
                    {product.variations.map((v) => {
                      const isSelected = selectedVariation?.id === v.id;
                      return (
                        <button
                          key={v.id}
                          onClick={() => setSelectedVariation(v)}
                          className={`p-2.5 rounded-lg text-left text-xs border transition-all flex items-center justify-between ${
                            isSelected
                              ? 'border-[#9E4424] bg-[#FAF5EE] font-bold text-[#1C1917] ring-1 ring-[#9E4424]'
                              : 'border-[#E4DDCF] bg-white text-stone-700 hover:border-stone-300'
                          }`}
                        >
                          <div>
                            <span className="block">{v.size}</span>
                            <span className="text-[10px] text-stone-500 font-normal">Kondisyon: {v.condition}</span>
                          </div>
                          <span className="font-bold text-stone-900">{v.price.toLocaleString('tr-TR')} TL</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Seller Description */}
              <div className="mt-4">
                <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-1">
                  Kondisyon & Detay Açıklaması
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed bg-white p-3 rounded-xl border border-[#E4DDCF]">
                  {product.description}
                </p>
              </div>

              {/* Seller Card */}
              <div className="mt-4 p-3 rounded-xl border border-[#E4DDCF] bg-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={product.seller.avatar}
                      alt={product.seller.name}
                      referrerPolicy="no-referrer"
                      className="w-10 h-10 rounded-full object-cover border border-[#E2DBD0]"
                    />
                    <div>
                      <div className="flex items-center gap-1">
                        <span className="font-bold text-stone-900 text-xs">{product.seller.name}</span>
                        <span title="Doğrulanmış Satıcı" className="inline-flex">
                          <CheckCircle className="w-3.5 h-3.5 text-blue-500" />
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-stone-500">
                        <span className="text-amber-600 font-bold">★ {product.seller.rating}</span>
                        <span>•</span>
                        <span>{product.seller.salesCount} Başarılı Teslimat</span>
                        <span>•</span>
                        <span className="flex items-center gap-0.5">
                          <MapPin className="w-2.5 h-2.5" />
                          {product.seller.location}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowQuestionBox(!showQuestionBox)}
                    className="p-2 text-stone-600 hover:text-stone-900 hover:bg-[#FAF8F5] rounded-lg text-xs font-medium flex items-center gap-1 transition-colors"
                  >
                    <MessageSquare className="w-4 h-4 text-[#9E4424]" />
                    <span className="hidden sm:inline">Soru Sor</span>
                  </button>
                </div>

                {/* Soru Sor Drawer */}
                {showQuestionBox && (
                  <form onSubmit={handleSendQuestion} className="mt-2.5 pt-2.5 border-t border-stone-100">
                    {questionSent ? (
                      <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-xs flex items-center gap-1.5">
                        <CheckCircle className="w-4 h-4 text-emerald-600" />
                        Sorunuz satıcıya iletildi.
                      </div>
                    ) : (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={questionText}
                          onChange={(e) => setQuestionText(e.target.value)}
                          placeholder="Bu eşya hakkında satıcıya sor..."
                          className="flex-1 bg-[#FAF8F5] border border-stone-200 rounded-lg px-2.5 py-1.5 text-xs text-stone-800 focus:outline-none focus:border-[#9E4424]"
                        />
                        <button
                          type="submit"
                          className="px-3 py-1.5 bg-[#9E4424] text-white text-xs font-semibold rounded-lg hover:bg-[#85361A]"
                        >
                          Gönder
                        </button>
                      </div>
                    )}
                  </form>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="mt-4 pt-4 border-t border-[#E8E2D8] flex items-center gap-3">
              <button
                onClick={() => onAddToCart(product, selectedVariation)}
                className="flex-1 py-3 px-4 rounded-xl border-2 border-[#9E4424] text-[#9E4424] hover:bg-[#FAF5EE] active:scale-98 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Sepete Ekle</span>
              </button>

              <button
                onClick={() => onBuyNow(product, selectedVariation)}
                className="flex-1 py-3 px-4 rounded-xl bg-[#9E4424] hover:bg-[#85361A] active:scale-98 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-md"
              >
                <span>Hemen Al & Sahip Çık</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
