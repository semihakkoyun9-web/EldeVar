/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShieldCheck, Truck, Tag, ArrowRight, Sparkles, ChevronRight, Heart, Mail, CheckCircle2, Send, Instagram, Twitter, Linkedin, HelpCircle, MapPin, Store } from 'lucide-react';
import { ProductCategory } from '../types';
import { EldeVarSeal } from './EldeVarLogo';

interface HomeBottomSectionProps {
  onOpenSellerModal: () => void;
  onNavigateCategory: (category: ProductCategory, keyword?: string) => void;
  onSelectBrand: (brand: string) => void;
  onOpenContact?: () => void;
  onOpenFaq?: () => void;
  onOpenLegal?: () => void;
  onOpenAdminPasswordModal?: () => void;
}

export const HomeBottomSection: React.FC<HomeBottomSectionProps> = ({
  onOpenSellerModal,
  onNavigateCategory,
  onSelectBrand,
  onOpenContact,
  onOpenFaq,
  onOpenLegal,
  onOpenAdminPasswordModal,
}) => {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [adminFooterClicks, setAdminFooterClicks] = useState(0);

  const handleFooterSecretClick = () => {
    setAdminFooterClicks((prev) => {
      const next = prev + 1;
      if (next >= 7) {
        onOpenAdminPasswordModal?.();
        return 0;
      }
      return next;
    });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setIsSubscribed(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 3000);
  };

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
        {/* A. BÜYÜK KAZANÇ BANNER'I */}
        <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1C4336] via-[#16382C] to-[#0D241D] text-white p-6 sm:p-10 shadow-md border border-emerald-900/40">
          <div className="absolute -right-16 -top-16 w-72 h-72 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
          <div className="absolute right-1/4 -bottom-20 w-80 h-80 rounded-full bg-[#9E4424]/20 blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
              <span>KAZANÇ ELDE ET & SÜRDÜRÜLEBİLİRLİK</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-white leading-tight">
              Kullanmadıklarını kazanca ve yeni hikâyelere dönüştür
            </h2>

            <p className="text-sm sm:text-base text-stone-200/90 leading-relaxed font-sans max-w-2xl">
              Dolabındaki giysiler ve evindeki nostaljik eşyalar için ücretsiz ilan ver. 
              EldeVar havuz hesap koruması, anlaşmalı indirimli kargo ve Dokan pazaryeri kolaylığıyla zahmetsizce sat.
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
                onClick={() => onOpenLegal?.('dokan')}
                className="px-4 py-2 text-stone-300 hover:text-white text-xs sm:text-sm font-medium transition-colors flex items-center justify-center gap-1 cursor-pointer"
              >
                <span>Dokan çok satıcılı sistem nasıl işler?</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </section>

        {/* B. EN POPÜLER KATEGORİLER */}
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
                className="px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl bg-white border border-[#E8E2D8] hover:border-[#9E4424] text-xs font-medium text-stone-700 hover:text-[#9E4424] transition-all shadow-2xs hover:shadow-xs active:scale-95 cursor-pointer"
              >
                {pill.label}
              </button>
            ))}
          </div>
        </section>

        {/* C. EN ÇOK ARANAN MARKALAR */}
        <section className="space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-serif font-bold text-stone-900 tracking-tight">
              Popüler markalar
            </h3>
            <span className="text-xs text-stone-500 hidden sm:inline">Sevilen markalara göre filtrele</span>
          </div>

          <div className="flex flex-wrap gap-1.5 sm:gap-2">
            {popularBrandPills.map((brand, idx) => (
              <button
                key={idx}
                onClick={() => onSelectBrand(brand)}
                className="px-3 py-1 rounded-full bg-stone-100 hover:bg-[#FAF3EB] text-stone-700 hover:text-[#9E4424] border border-stone-200 hover:border-[#EBD4BF] text-xs transition-colors cursor-pointer"
              >
                {brand}
              </button>
            ))}
          </div>
        </section>

        {/* D. GÜVEN VE DEĞER KARTLARI */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pt-4">
          <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-2xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-stone-900 font-serif">Alıcı & Satıcı Güvencesi</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Ödemeniz güvenli havuz hesabında saklanır; kargoyu teslim alıp onaylayana kadar satıcıya aktarılmaz.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-2xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-amber-50 text-amber-800 border border-amber-200 shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-stone-900 font-serif">750 TL Üzeri Ücretsiz Kargo</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Yurtiçi ve Aras kargo entegrasyonuyla tüm Türkiye'ye indirimli ve hızlı teslimat güvencesi.
              </p>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white border border-[#E8E2D8] shadow-2xs flex items-start gap-3.5">
            <div className="p-2.5 rounded-xl bg-stone-100 text-stone-800 border border-stone-200 shrink-0">
              <Tag className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-bold text-stone-900 font-serif">Uygun Fiyat & Eşya Hafızası</h4>
              <p className="text-xs text-stone-600 leading-relaxed font-sans">
                Mağaza fiyatlarının çok altında, özenle saklanmış ikinci el ve koleksiyonluk parçalarla bütçeni koru.
              </p>
            </div>
          </div>
        </section>

        {/* E. E-BÜLTEN KAYIT KUTUSU (Kural 11: E-reklam ve E-iletişim Zorunluluğu) */}
        <section className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#FAF3EB] via-white to-[#F5EADB] border border-[#EADAC5] shadow-xs">
          <div className="max-w-3xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-1.5 text-center md:text-left">
              <div className="inline-flex items-center gap-1 text-[11px] font-bold text-[#9E4424] uppercase tracking-wider">
                <Mail className="w-3.5 h-3.5" />
                <span>E-BÜLTEN KAYIT FORMU</span>
              </div>
              <h3 className="font-serif font-bold text-lg sm:text-xl text-[#1C1917]">
                Yeni hikâyelerden & indirimlerden ilk siz haberdar olun
              </h3>
              <p className="text-xs text-stone-600 font-sans leading-relaxed">
                Haftalık bültenimize abone olun, ilk alışverişinizde geçerli <strong>%10 Hoş Geldin Kuponu</strong> kazanın.
              </p>
            </div>

            <div className="w-full md:w-auto shrink-0">
              {isSubscribed ? (
                <div className="p-3 bg-emerald-100/90 text-emerald-900 rounded-2xl border border-emerald-300 text-xs font-semibold flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>Aboneliğiniz alındı! %10 indirim kuponunuz posta kutunuza iletildi.</span>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex items-center gap-2">
                  <input
                    type="email"
                    required
                    placeholder="E-posta adresiniz..."
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    className="w-full sm:w-64 text-xs p-3 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424] shadow-2xs"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-xs shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-1.5 shrink-0"
                  >
                    <span>Abone Ol</span>
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* 2. FOOTER (Tam Genişlikli Zemin, Ortalanmış max-w-7xl İçerik) */}
      <footer className="w-full border-t border-[#E8E2D8] bg-[#FAF5EE]/90 pt-12 pb-28 sm:pb-12 text-stone-600 text-xs font-sans">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-8 mb-10">
            {/* Logo, Manifesto & Sosyal Medya */}
            <div className="col-span-2 space-y-3.5">
              <div className="flex items-center gap-2">
                <EldeVarSeal size={32} />
                <span className="text-2xl font-serif font-black tracking-tight text-[#1C1917]">
                  EldeVarmı?
                </span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed max-w-sm">
                "Eski hikâyeler yeni sahibiyle canlanıyor." Tüketim çağında eşyaların hatırasını ve ömrünü uzatan yeni nesil C2C ikinci el pazaryeri.
              </p>

              {/* Sosyal Medya İkonları (Kural 11: Sosyal Medya Bağlantıları) */}
              <div className="pt-1">
                <span className="text-[11px] font-bold text-stone-800 block mb-2">Bizi Sosyal Medyada Takip Edin:</span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.instagram.com/semih.akkoyunn/"
                    target="_blank"
                    rel="noreferrer"
                    className="py-1.5 px-3 rounded-xl bg-white border border-[#E4DDCF] hover:border-[#9E4424] text-stone-600 hover:text-[#9E4424] transition-colors shadow-2xs flex items-center gap-1.5 group"
                    aria-label="Instagram - Semih Akkoyun"
                    title="Instagram @semih.akkoyunn"
                  >
                    <Instagram className="w-4 h-4 text-pink-600 group-hover:scale-110 transition-transform" />
                    <span className="text-[11px] font-semibold text-stone-700 group-hover:text-[#9E4424]">@semih.akkoyunn</span>
                  </a>
                  <a
                    href="https://x.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-white border border-[#E4DDCF] hover:border-[#9E4424] text-stone-600 hover:text-[#9E4424] transition-colors shadow-2xs"
                    aria-label="X (Twitter)"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 rounded-xl bg-white border border-[#E4DDCF] hover:border-[#9E4424] text-stone-600 hover:text-[#9E4424] transition-colors shadow-2xs"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                </div>
              </div>

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

            {/* Kolon 3: Kurumsal & Yardım (Kural 8: İletişim & SSS) */}
            <div className="space-y-2.5">
              <h5 
                onClick={handleFooterSecretClick}
                className="font-bold text-stone-900 text-xs uppercase tracking-wider cursor-pointer select-none"
                title="Kurumsal"
              >
                Kurumsal & Yardım
              </h5>
              <ul className="space-y-2 text-stone-600 text-xs">
                <li>
                  <button onClick={onOpenContact} className="hover:text-[#9E4424] flex items-center gap-1.5 cursor-pointer">
                    <MapPin className="w-3.5 h-3.5 text-[#9E4424]" />
                    <span>İletişim & Harita</span>
                  </button>
                </li>
                <li>
                  <button onClick={onOpenFaq} className="hover:text-[#9E4424] flex items-center gap-1.5 cursor-pointer">
                    <HelpCircle className="w-3.5 h-3.5 text-blue-600" />
                    <span>Sıkça Sorulan Sorular (S.S.S.)</span>
                  </button>
                </li>
                <li>
                  <button onClick={() => onOpenLegal?.('about')} className="hover:text-[#9E4424] cursor-pointer">
                    Hakkımızda & Hikâyemiz
                  </button>
                </li>
                <li>
                  <button onClick={() => onOpenLegal?.('dokan')} className="hover:text-[#9E4424] cursor-pointer">
                    Dokan Satıcı Modeli (%10 Komisyon)
                  </button>
                </li>
                <li>
                  <button onClick={() => onOpenLegal?.('returns')} className="hover:text-[#9E4424] cursor-pointer">
                    Kargo ve İade Koşulları
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Alt Telif ve Yasal Bilgi (Kural 7: Yasal Sayfalar) */}
          <div className="pt-6 border-t border-[#E8E2D8] flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-stone-500 text-center sm:text-left">
            <p>© 2026 EldeVarMı Teknoloji A.Ş. • eldevarmi.com</p>
            <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
              <button onClick={() => onOpenLegal?.('privacy')} className="hover:underline cursor-pointer">
                Gizlilik & KVKK
              </button>
              <span>•</span>
              <button onClick={() => onOpenLegal?.('cookies')} className="hover:underline cursor-pointer">
                Çerez Politikası
              </button>
              <span>•</span>
              <button onClick={() => onOpenLegal?.('sales')} className="hover:underline cursor-pointer">
                Mesafeli Satış Sözleşmesi
              </button>
              <span>•</span>
              <button onClick={() => onOpenLegal?.('returns')} className="hover:underline cursor-pointer">
                İade & Cayma Koşulları
              </button>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
