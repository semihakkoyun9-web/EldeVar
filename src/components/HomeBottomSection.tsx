/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldCheck, Truck, Tag, ArrowRight, Sparkles, ChevronRight, Heart } from 'lucide-react';
import { ProductCategory } from '../types';
import { EldeVarSeal } from './EldeVarLogo';

interface HomeBottomSectionProps {
  onOpenSellerModal: () => void;
  onNavigateCategory: (category: ProductCategory, keyword?: string) => void;
  onSelectBrand: (brand: string) => void;
}

export const HomeBottomSection: React.FC<HomeBottomSectionProps> = ({
  onOpenSellerModal,
  onNavigateCategory,
  onSelectBrand,
}) => {
  const popularCategoryPills: Array<{ label: string; category: ProductCategory; keyword?: string }> = [
    { label: 'Kadın: Elbise', category: 'kadin', keyword: 'Elbise' },
    { label: 'Kadın: Mont & Kaban', category: 'kadin', keyword: 'Kaban' },
    { label: 'Kadın: Triko & Kazak', category: 'kadin', keyword: 'Kazak' },
    { label: 'Kadın: Çanta & Fular', category: 'canta_aksesuar', keyword: 'Çanta' },
    { label: 'Kadın: Ayakkabı & Bot', category: 'ayakkabi', keyword: 'Bot' },
    { label: 'Erkek: Deri Ceket', category: 'erkek', keyword: 'Deri Ceket' },
    { label: 'Erkek: Jean & Denim', category: 'erkek', keyword: 'Jean' },
    { label: 'Erkek: Gömlek', category: 'erkek', keyword: 'Gömlek' },
    { label: 'Erkek: Sneaker & Bot', category: 'ayakkabi', keyword: 'Sneaker' },
    { label: 'Çocuk: Tulum & Giyim', category: 'cocuk', keyword: 'Tulum' },
    { label: 'Çocuk: Paten & Spor', category: 'cocuk', keyword: 'Paten' },
    { label: 'Elektronik: Analog Fotoğraf', category: 'elektronik', keyword: 'Analog' },
    { label: 'Elektronik: Kulaklık & Ses', category: 'elektronik', keyword: 'Kulaklık' },
    { label: 'Ev & Yaşam: El Dokuma Kilim', category: 'ev_yasam', keyword: 'Kilim' },
    { label: 'Ev & Yaşam: Ahşap Pikap', category: 'ev_yasam', keyword: 'Pikap' },
    { label: 'Ev & Yaşam: Pirinç Lamba', category: 'ev_yasam', keyword: 'Lamba' },
  ];

  const popularBrandPills = [
    'Zara',
    'Nike',
    'Adidas',
    "Levi's",
    'Burberry',
    'Vakko',
    'Dr. Martens',
    'Sony',
    'Apple',
    'Mango',
    'H&M',
    'Puma',
    'New Balance',
    'LC Waikiki',
    'Koton',
    'Bershka',
    'Stradivarius',
    'Pull & Bear',
    'Ralph Lauren',
    'Massimo Dutti',
    'Converse',
  ];

  return (
    <div className="w-full mt-12 overflow-hidden">
      {/* 1. ÜST KISIM: KAZANÇ BANNERI, KATEGORİ & MARKA HAPLARI, 3 GÜVEN KARTI */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 mb-14">
        {/* A. GÖRSELDEKİ BÜYÜK KAZANÇ BANNER'I */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C4336] via-[#16382C] to-[#0D241D] text-white p-6 sm:p-10 shadow-md border border-emerald-900/40">
          {/* Dekoratif Işık Halkaları */}
          <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute right-1/4 -bottom-20 w-80 h-80 rounded-full bg-[#9E4424]/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>KAZANÇ ELDE ET</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-white leading-tight">
              Kullanmadıklarını kazanca ve yeni hikâyelere dönüştür
            </h2>

            <p className="text-sm sm:text-base text-stone-200/90 leading-relaxed font-sans max-w-2xl">
              Dolabındaki giysiler ve evindeki nostaljik eşyalar için ücretsiz ilan ver. 
              EldeVar havuz hesap koruması, indirimli kargo anlaşmaları ve güvenli alıcı kitlesiyle zahmetsizce sat.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row sm:items-center gap-3">
              <button
                onClick={onOpenSellerModal}
                className="px-6 py-3 rounded-full bg-white hover:bg-stone-100 text-stone-900 font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 w-full sm:w-auto"
              >
                <span>Ücretsiz İlan Ver</span>
                <ArrowRight className="w-4 h-4 text-[#9E4424]" />
              </button>

              <button
                onClick={onOpenSellerModal}
                className="px-4 py-2 text-stone-300 hover:text-white text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Kolay satışın püf noktaları</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* B. EN POPÜLER KATEGORİLER (Pill Butonları) */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 tracking-tight">
              En popüler kategoriler
            </h3>
            <span className="text-xs text-stone-500 hidden sm:inline">Hızlıca filtrelere göz at</span>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {popularCategoryPills.map((pill, idx) => (
              <button
                key={idx}
                onClick={() => onNavigateCategory(pill.category, pill.keyword)}
                className="px-3.5 py-2 rounded-full bg-white hover:bg-stone-50 text-stone-800 text-xs sm:text-[13px] font-medium border border-[#E5DDD1] hover:border-[#9E4424] transition-all hover:text-[#9E4424] shadow-2xs cursor-pointer active:scale-95"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </section>

        {/* C. EN ÇOK SATAN MARKALAR (Pill Butonları) */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 tracking-tight">
              En çok satan markalar
            </h3>
            <span className="text-xs text-stone-500 hidden sm:inline">Tüm markaları keşfet</span>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-2.5">
            {popularBrandPills.map((brand, idx) => (
              <button
                key={idx}
                onClick={() => onSelectBrand(brand)}
                className="px-3.5 py-2 rounded-full bg-white hover:bg-stone-50 text-stone-700 text-xs sm:text-[13px] font-medium border border-[#E5DDD1] hover:border-[#9E4424] transition-all hover:text-[#9E4424] shadow-2xs cursor-pointer active:scale-95"
              >
                {brand}
              </button>
            ))}
          </div>
        </section>

        {/* D. GÖRSELDEKİ 3 GÜVENİLİRLİK KARTI */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
          {/* Kart 1: Güvenli Ödeme */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-2xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-100 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-stone-900 font-serif">Güvenli Ödeme</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Havuz hesap güvencesiyle paran satıcıya sadece sen siparişini teslim alıp onayladıktan sonra aktarılır.
              </p>
            </div>
          </div>

          {/* Kart 2: Anlaşmalı Kargo */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-2xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-50 text-[#9E4424] border border-amber-100 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-stone-900 font-serif">Anlaşmalı Kargo</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Türkiye'nin her yerine özel indirimli kargo fiyatları. Satıcılar için kapıdan teslim alma avantajı.
              </p>
            </div>
          </div>

          {/* Kart 3: Uygun Fiyat */}
          <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-2xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 shrink-0">
              <Tag className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-stone-900 font-serif">Uygun Fiyat & Değer</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Mağaza fiyatlarının çok altında, özenle saklanmış ikinci el ve koleksiyonluk parçalarla bütçeni koru.
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* 2. GÖRSELDEKİ DETAYLI FOOTER (Tam Genişlikli Zemin, Ortalanmış max-w-7xl İçerik) */}
      <footer className="w-full border-t border-[#E8E2D8] bg-[#FAF5EE]/90 pt-10 pb-28 sm:pb-12 text-stone-600 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">
            {/* Logo & Manifesto */}
            <div className="col-span-2 space-y-3">
              <div className="flex items-center gap-2">
                <EldeVarSeal size={32} />
                <span className="text-2xl font-serif font-black tracking-tight text-[#1C1917]">
                  <span className="text-[#9E4424]">E</span>lde<span className="text-[#9E4424]">V</span>ar
                </span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed max-w-sm">
                "Eski hikâyeler yeni sahibiyle canlanıyor." Tüketim çağında eşyaların hatırasını ve ömrünü uzatan yeni nesil ikinci el platformu.
              </p>
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span className="text-[11px] font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
                  🌱 Karbon Tasarrufu Odaklı
                </span>
                <span className="text-[11px] font-semibold text-stone-700 bg-stone-100 px-2.5 py-1 rounded-full border border-stone-200">
                  🔒 %100 Güvenli Havuz
                </span>
              </div>
            </div>

            {/* Kolon 1: Popüler Kategoriler */}
            <div className="space-y-2.5">
              <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Kategoriler</h5>
              <ul className="space-y-1.5 text-stone-600 text-xs">
                <li><button onClick={() => onNavigateCategory('kadin')} className="hover:text-[#9E4424] cursor-pointer">Kadın Giyim</button></li>
                <li><button onClick={() => onNavigateCategory('erkek')} className="hover:text-[#9E4424] cursor-pointer">Erkek Giyim</button></li>
                <li><button onClick={() => onNavigateCategory('cocuk')} className="hover:text-[#9E4424] cursor-pointer">Çocuk & Bebek</button></li>
                <li><button onClick={() => onNavigateCategory('ayakkabi')} className="hover:text-[#9E4424] cursor-pointer">Ayakkabı & Sneaker</button></li>
                <li><button onClick={() => onNavigateCategory('canta_aksesuar')} className="hover:text-[#9E4424] cursor-pointer">Çanta & Aksesuar</button></li>
                <li><button onClick={() => onNavigateCategory('elektronik')} className="hover:text-[#9E4424] cursor-pointer">Elektronik & Analog</button></li>
                <li><button onClick={() => onNavigateCategory('ev_yasam')} className="hover:text-[#9E4424] cursor-pointer">Ev & Koleksiyon</button></li>
              </ul>
            </div>

            {/* Kolon 2: Markalar */}
            <div className="space-y-2.5">
              <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Markalar</h5>
              <ul className="space-y-1.5 text-stone-600 text-xs">
                <li><button onClick={() => onSelectBrand('Zara')} className="hover:text-[#9E4424] cursor-pointer">Zara</button></li>
                <li><button onClick={() => onSelectBrand('Nike')} className="hover:text-[#9E4424] cursor-pointer">Nike</button></li>
                <li><button onClick={() => onSelectBrand("Levi's")} className="hover:text-[#9E4424] cursor-pointer">Levi's</button></li>
                <li><button onClick={() => onSelectBrand('Vakko')} className="hover:text-[#9E4424] cursor-pointer">Vakko</button></li>
                <li><button onClick={() => onSelectBrand('Dr. Martens')} className="hover:text-[#9E4424] cursor-pointer">Dr. Martens</button></li>
                <li><button onClick={() => onSelectBrand('Sony')} className="hover:text-[#9E4424] cursor-pointer">Sony</button></li>
              </ul>
            </div>

            {/* Kolon 3: Yardım & Güvenlik */}
            <div className="space-y-2.5">
              <h5 className="font-bold text-stone-900 text-xs uppercase tracking-wider">Yardım & Destek</h5>
              <ul className="space-y-1.5 text-stone-600 text-xs">
                <li><a href="#how" className="hover:text-[#9E4424]">Nasıl Satış Yapılır?</a></li>
                <li><a href="#safe" className="hover:text-[#9E4424]">Alıcı Koruma Sistemi</a></li>
                <li><a href="#shipping" className="hover:text-[#9E4424]">Kargo ve İade Koşulları</a></li>
                <li><a href="#passport" className="hover:text-[#9E4424]">Eşya Hafıza Pasaportu</a></li>
                <li><a href="#terms" className="hover:text-[#9E4424]">Kullanıcı Sözleşmesi</a></li>
                <li><a href="#contact" className="hover:text-[#9E4424]">Müşteri Hizmetleri</a></li>
              </ul>
            </div>
          </div>

          {/* Alt Telif ve Yasal Bilgi */}
          <div className="pt-6 border-t border-[#E8E2D8] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500 text-center sm:text-left">
            <p>© 2026 EldeVar Teknoloji A.Ş. Tüm hakları saklıdır.</p>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <span className="hover:underline cursor-pointer">Gizlilik Politikası</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Kullanım Koşulları</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">KVKK Aydınlatma Metni</span>
              <span>•</span>
              <span className="hover:underline cursor-pointer">Çerez Tercihleri</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
