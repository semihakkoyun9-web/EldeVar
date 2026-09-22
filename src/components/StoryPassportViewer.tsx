/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { Feather, MapPin, Calendar, Leaf, Check, X, ArrowRight, Heart } from 'lucide-react';
import { resolveConditionKey, CONDITION_THEMES } from '../utils/conditionTheme';

interface StoryPassportViewerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
}

export const StoryPassportViewer: React.FC<StoryPassportViewerProps> = ({
  product,
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [isEnvelopeOpen, setIsEnvelopeOpen] = useState(false);

  if (!isOpen || !product) return null;

  const conditionKey = product.conditionType || resolveConditionKey(product.condition);
  const conditionTheme = CONDITION_THEMES[conditionKey];

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1917]/75 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] w-full max-w-2xl rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#E4D8C4] overflow-hidden max-h-[94vh] sm:max-h-[90vh] flex flex-col relative animate-in fade-in slide-in-from-bottom-8 sm:zoom-in-95 duration-200">
        {/* Mobile Pull Indicator */}
        <div className="w-10 h-1 bg-stone-500/40 rounded-full mx-auto mt-2 sm:hidden shrink-0" />
        
        {/* Header Ribbon: Passport Header */}
        <div className="bg-gradient-to-r from-[#2A241F] via-[#382F28] to-[#2A241F] text-[#F5EDE1] px-4 sm:px-5 py-3.5 sm:py-4 flex items-center justify-between border-b border-[#4A3F35] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#9E4424] text-white flex items-center justify-center font-serif font-bold text-lg shadow-sm border border-[#C2623F]">
              EV
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-widest text-[#E69C24]">
                  Eşya Hafıza Pasaportu
                </span>
                <span className="text-[11px] bg-white/15 px-2 py-0.5 rounded-full font-mono text-stone-200">
                  {product.passportCode || `EV-${product.id.toUpperCase()}`}
                </span>
              </div>
              <h3 className="font-serif font-bold text-sm sm:text-base text-white truncate max-w-sm sm:max-w-md">
                {product.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Passport Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto font-sans">
          
          {/* Top Row: Visual & Core Provenance Stamp */}
          <div className="flex flex-col sm:flex-row gap-4 items-start bg-white p-4 rounded-2xl border border-[#E8E0D2] shadow-2xs">
            <div className="w-full sm:w-32 h-32 rounded-xl overflow-hidden bg-[#FAF5EC] shrink-0 border border-[#E2DBD0] relative group">
              <img
                src={product.images[0]}
                alt={product.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1.5 left-1.5">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/75 text-white backdrop-blur-xs flex items-center gap-1">
                  <span className={conditionTheme.dotEmoji} />
                  {conditionTheme.label}
                </span>
              </div>
            </div>

            <div className="flex-1 space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FAF3EB] text-[#8C3F23] font-semibold border border-[#EBD6C3]">
                  <Calendar className="w-3 h-3 text-[#9E4424]" />
                  Dönem: {product.story?.eraOrYear || 'Klasik Dönem'}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-[#FAF3EB] text-[#8C3F23] font-semibold border border-[#EBD6C3]">
                  <MapPin className="w-3 h-3 text-[#9E4424]" />
                  Köken: {product.story?.originCity || product.seller.location}
                </span>
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-emerald-50 text-emerald-800 font-semibold border border-emerald-200">
                  <Leaf className="w-3 h-3 text-emerald-600" />
                  {product.ecoSavings.co2Kg} kg CO₂ Tasarrufu
                </span>
              </div>

              <blockquote className="text-xs italic text-stone-700 bg-[#FAF7F2] p-3 rounded-xl border-l-3 border-[#9E4424] font-serif">
                "{product.story?.memoryQuote || product.description}"
              </blockquote>

              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                {product.story?.storyDetail || product.description}
              </p>
            </div>
          </div>

          {/* Signature Kraft Envelope Section */}
          <div className="bg-[#EFE8DC] p-5 rounded-2xl border border-[#DECBB4] relative overflow-hidden shadow-xs">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">📜</span>
                <h4 className="font-serif font-bold text-sm text-[#382F28]">
                  Satıcının Mum Mühürlü Kraft Hatıra Zarfı
                </h4>
              </div>
              <span className="text-[11px] text-[#8C3F23] font-semibold bg-white/70 px-2.5 py-0.5 rounded-full border border-[#D5BEA4]">
                Kutuda Fiziksel Gelecek
              </span>
            </div>

            <p className="text-xs text-[#54483E] mb-3 leading-relaxed">
              Bu ürün kargolandığında satıcı {product.seller.name}, aşağıdaki el yazısı hatıra kartını özel mühürlü kraft zarfına koyarak kutunun içine bırakacaktır.
            </p>

            {/* Envelope Interactive Trigger */}
            {!isEnvelopeOpen ? (
              <button
                type="button"
                onClick={() => setIsEnvelopeOpen(true)}
                className="w-full bg-[#E5D7C2] hover:bg-[#DBCBB3] border-2 border-dashed border-[#B89F82] p-4 rounded-xl flex items-center justify-center gap-2 text-xs font-bold text-[#4D3E31] transition-all cursor-pointer shadow-2xs group"
              >
                <span className="w-7 h-7 rounded-full bg-[#9E4424] text-white flex items-center justify-center text-xs shadow-xs group-hover:scale-110 transition-transform">
                  ✉️
                </span>
                <span>Mührü Aç ve Satıcının Veda Mektubunu Oku</span>
              </button>
            ) : (
              <div className="bg-[#FFFDF9] p-5 rounded-xl border border-[#D0BAA0] shadow-sm space-y-3 animate-in fade-in duration-300">
                <div className="flex items-center justify-between border-b border-[#EBDCCB] pb-2 text-xs">
                  <div className="flex items-center gap-1.5 font-serif font-bold text-[#8C3F23]">
                    <Feather className="w-3.5 h-3.5" />
                    <span>Sevgili Yeni Sahip,</span>
                  </div>
                  <button
                    onClick={() => setIsEnvelopeOpen(false)}
                    className="text-[11px] text-stone-500 hover:text-stone-800 underline"
                  >
                    Zarfı Kapat
                  </button>
                </div>

                <div className="font-serif text-xs text-stone-800 leading-relaxed italic bg-[#FAF5EB] p-3.5 rounded-lg border border-[#F0E4D2]">
                  "{product.story?.sellerFarewell || 'Bu eşyanın benimle geçen yılları unutulmazdı. Yeni sahibinin hayatında da en güzel anlara şahitlik etmesini tüm kalbimle dilerim.'}"
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span>Satıcı: <strong>{product.seller.name}</strong> ({product.seller.location})</span>
                  <span className="text-emerald-700 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" /> EldeVar Güvencesiyle Mühürlendi
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 bg-white border-t border-[#E8E2D8] flex items-center justify-between">
          <div className="text-xs text-stone-600">
            Fiyat: <span className="font-bold text-stone-900 text-sm">{product.price.toLocaleString('tr-TR')} TL</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-stone-600 hover:bg-stone-100"
            >
              Kapat
            </button>
            {onSelectProduct && (
              <button
                onClick={() => {
                  onClose();
                  onSelectProduct(product);
                }}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[#9E4424] hover:bg-[#85361A] text-white flex items-center gap-1.5 shadow-xs"
              >
                <span>Ürün Detayına Git</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
