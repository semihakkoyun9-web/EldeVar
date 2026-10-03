import React, { useState, useRef } from 'react';
import { 
  X, Upload, Plus, Trash2, Check, ShieldCheck, Feather, 
  MapPin, Eye, Edit3, ArrowRight, Store, Calculator, Image as ImageIcon, Link as LinkIcon, AlertCircle
} from 'lucide-react';
import { Product, ProductCategory, ProductCondition, AuthUser } from '../types';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '../data/mockData';
import { CONDITION_THEMES, resolveConditionKey } from '../utils/conditionTheme';

interface SellerAddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerEmail: string;
  onUpdateSellerEmail: (email: string) => void;
  onAddProduct: (product: Product) => void;
  currentUser?: AuthUser | null;
}

const POPULAR_BRANDS = [
  'Zara', "Levi's", 'Nike', 'Burberry', 'Sony', 'Vakko', 'Dr. Martens', 'Schott NYC', 'Massimo Dutti', 'Özel Parça'
];

const STANDARD_SIZE_PILLS = [
  'XS', 'S', 'M', 'L', 'XL', 'W32/L32', '38', '40', '42', 'Tek Ebat'
];

export const SellerAddProductModal: React.FC<SellerAddProductModalProps> = ({
  isOpen,
  onClose,
  sellerEmail,
  onAddProduct,
  currentUser,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Tab View: 'edit' or 'preview'
  const [activeTab, setActiveTab] = useState<'edit' | 'preview'>('edit');

  // Form State - Completely clean without mock/preset defaults
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('kadin');
  const [brand, setBrand] = useState('');
  const [condition, setCondition] = useState<ProductCondition>('Çok İyi (Az Kullanılmış)');
  const [size, setSize] = useState('');
  const [stock, setStock] = useState<number>(1);
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');

  // Real photos state
  const [photos, setPhotos] = useState<string[]>([]);
  const [urlInput, setUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Memory Passport State (Optional storytelling)
  const [hasPassport, setHasPassport] = useState(false);
  const [eraOrYear, setEraOrYear] = useState('');
  const [originCity, setOriginCity] = useState('');
  const [memoryQuote, setMemoryQuote] = useState('');
  const [sellerFarewell, setSellerFarewell] = useState('');

  // Objective Condition Verification Checklist (Madde 2)
  const [hasTag, setHasTag] = useState(false);
  const [hasFlaws, setHasFlaws] = useState(false);
  const [flawDetails, setFlawDetails] = useState('');
  const [isCleanAndOdorFree, setIsCleanAndOdorFree] = useState(true);
  const [isRepaired, setIsRepaired] = useState(false);
  const [conditionConfirmed, setConditionConfirmed] = useState(true);

  // Publishing State
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  if (!isOpen) return null;

  // Real File Upload Handler (FileReader -> base64)
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setFormError(null);
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotos((prev) => {
            if (prev.length >= 8) return prev;
            return [...prev, event.target!.result as string];
          });
        }
      };
      reader.readAsDataURL(file);
    });

    if (e.target) e.target.value = '';
  };

  const handleAddPhotoByUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    if (!trimmed.startsWith('http://') && !trimmed.startsWith('https://')) {
      setFormError('Lütfen geçerli bir resim web bağlantısı (http veya https) girin.');
      return;
    }
    setFormError(null);
    setPhotos((prev) => [...prev, trimmed]);
    setUrlInput('');
    setShowUrlField(false);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSetCoverPhoto = (index: number) => {
    setPhotos((prev) => {
      const selected = prev[index];
      const rest = prev.filter((_, i) => i !== index);
      return [selected, ...rest];
    });
  };

  // Financial Calculations (Dokan %10 Platform Komisyonu)
  const numPrice = Number(price) || 0;
  const commissionRate = 0.10; // %10 Dokan Komisyonu
  const commissionAmount = Math.round(numPrice * commissionRate);
  const isFreeShippingForBuyer = numPrice >= FREE_SHIPPING_THRESHOLD;
  const netEarnings = Math.max(0, numPrice - commissionAmount);

  // Condition Theme
  const conditionKey = resolveConditionKey(condition);
  const activeConditionTheme = CONDITION_THEMES[conditionKey];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (photos.length === 0) {
      setFormError('Lütfen ürününüz için en az 1 adet fotoğraf yükleyin.');
      return;
    }

    if (!title.trim()) {
      setFormError('Lütfen bir ilan başlığı girin.');
      return;
    }

    if (!numPrice || numPrice <= 0) {
      setFormError('Lütfen geçerli bir satış fiyatı girin.');
      return;
    }

    if (!description.trim()) {
      setFormError('Lütfen ürünün kondisyonu ve detayları hakkında açıklama yazın.');
      return;
    }

    if (hasFlaws && !flawDetails.trim()) {
      setFormError('Lütfen ürününüzdeki kusuru (leke, yırtık vb.) kısaca açıklayın.');
      return;
    }

    if (!conditionConfirmed) {
      setFormError('Lütfen 48 Saat Havuz Hesap Güvencesini kabul ettiğinizi onaylayın.');
      return;
    }

    setIsPublishing(true);

    const catLabels: Record<ProductCategory, string> = {
      giyim: 'Giyim & Vintage',
      kadin: 'Kadın Giyim',
      erkek: 'Erkek Giyim',
      cocuk: 'Çocuk & Bebek',
      ayakkabi: 'Ayakkabı',
      canta_aksesuar: 'Çanta & Aksesuar',
      elektronik: 'Teknoloji & Analog',
      ev_yasam: 'Ev & Yaşam & Antika',
    };

    const cleanYear = eraOrYear.trim() || '2024';
    const cleanBrand = (brand.trim() || 'ELDE').split(' ')[0].toUpperCase();
    const passportCode = `EV-${cleanYear.replace(/\D/g, '') || '24'}-${cleanBrand}`;

    const newProd: Product = {
      id: `prod-user-${Date.now()}`,
      title: title.trim(),
      category,
      categoryLabel: catLabels[category] || 'İkinci El',
      price: numPrice,
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      stock: stock || 1,
      condition,
      conditionType: conditionKey,
      size: size.trim() || undefined,
      passportCode: hasPassport ? passportCode : undefined,
      brand: brand.trim() || 'Belirtilmemiş',
      description: description.trim(),
      images: [...photos],
      conditionChecklist: {
        hasTag,
        hasFlaws,
        flawDetails: hasFlaws ? flawDetails.trim() : undefined,
        isCleanAndOdorFree,
        isRepaired,
      },
      seller: {
        id: currentUser?.id || `seller-semih-store`,
        name: currentUser?.name || 'Semih Akkoyun',
        email: currentUser?.email || sellerEmail,
        avatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        rating: currentUser?.rating || 5.0,
        salesCount: currentUser?.successfulSales || 16,
        location: currentUser?.city || `${originCity.trim() ? originCity.split(',')[0] : 'Eskişehir'}, Türkiye`,
        conditionAccuracyRate: 99,
      },
      story: hasPassport ? {
        eraOrYear: eraOrYear.trim() || 'Vintage',
        originCity: originCity.trim() || 'Türkiye',
        memoryQuote: memoryQuote.trim() || 'Özenle saklanmış hatıra parçası.',
        storyDetail: description.trim(),
        sellerFarewell: sellerFarewell.trim() || 'Yeni sahibine mutluluk getirmesi dileğiyle.',
        travelBadge: `📜 ${eraOrYear.trim() || 'Vintage'} Hatırası`,
      } : undefined,
      ecoSavings: {
        co2Kg: Number((numPrice * 0.018).toFixed(1)) || 12.0,
        waterLiters: Math.round(numPrice * 4.2) || 2800,
      },
      shippingFee: isFreeShippingForBuyer ? 0 : STANDARD_SHIPPING_FEE,
      views: 1,
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    setTimeout(() => {
      onAddProduct(newProd);
      setIsPublishing(false);
      setIsPublished(true);
      setTimeout(() => {
        setIsPublished(false);
        onClose();
      }, 1400);
    }, 500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1917]/75 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] w-full max-w-3xl rounded-3xl shadow-2xl border border-[#E8E2D8] overflow-hidden my-auto max-h-[94vh] flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* TOP BAR */}
        <div className="bg-[#1C1917] text-white px-5 sm:px-7 py-3.5 flex items-center justify-between border-b border-[#2C2622] shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#9E4424] text-white shadow-xs">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-sm sm:text-base tracking-tight text-white">
                  Yeni İlan Ver
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Dokan Satıcı Paneli
                </span>
              </div>
              <p className="text-[11px] text-stone-300 font-sans">
                Mağaza: <strong className="text-white">Semih Akkoyun</strong> • Dokan %10 Pazar Yeri Komisyonu
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* View Switcher: Düzenle / Önizleme */}
            <div className="hidden sm:flex items-center bg-stone-800/80 p-0.5 rounded-xl border border-stone-700 text-xs">
              <button
                type="button"
                onClick={() => setActiveTab('edit')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'edit'
                    ? 'bg-[#9E4424] text-white font-bold shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Form</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1.5 rounded-lg font-medium flex items-center gap-1.5 transition-all ${
                  activeTab === 'preview'
                    ? 'bg-[#9E4424] text-white font-bold shadow-xs'
                    : 'text-stone-300 hover:text-white'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>Önizleme</span>
              </button>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-white hover:bg-stone-800 rounded-full transition-colors cursor-pointer"
              aria-label="Kapat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* BODY AREA */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-7">
          
          {/* Published Success Overlay */}
          {isPublished && (
            <div className="p-8 text-center bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-900 space-y-2 animate-in zoom-in-95">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2">
                <Check className="w-8 h-8 stroke-[3]" />
              </div>
              <h4 className="font-serif font-bold text-lg">İlanınız Başarıyla Yayında!</h4>
              <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                Eşyanız vitrine ve mağazanıza eklendi. Alıcılar güvenli ödeme ile satın alabilir.
              </p>
            </div>
          )}

          {/* Form Error Alert */}
          {formError && (
            <div className="mb-4 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {activeTab === 'preview' ? (
            /* REAL PREVIEW CARD */
            <div className="space-y-4 py-2">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900">Vitrin Kartı Önizlemesi</h4>
                  <p className="text-xs text-stone-500">Alıcıların anasayfada ve mağazanızda göreceği canlı görünüm</p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('edit')}
                  className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-xs transition-colors"
                >
                  ← Forma Dön
                </button>
              </div>

              {photos.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-stone-300 p-6 space-y-2">
                  <ImageIcon className="w-10 h-10 text-stone-300 mx-auto" />
                  <p className="text-sm font-semibold text-stone-700">Henüz fotoğraf yüklenmedi</p>
                  <p className="text-xs text-stone-400">Önizlemeyi görebilmek için önce forma dönüp en az 1 fotoğraf yükleyin.</p>
                </div>
              ) : (
                <div className="max-w-sm mx-auto bg-white rounded-2xl border-2 border-stone-200 overflow-hidden shadow-lg">
                  <div className="relative aspect-square w-full bg-stone-100 overflow-hidden">
                    <img src={photos[0]} alt={title || 'Ürün'} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 flex flex-col gap-1 items-start">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${activeConditionTheme.badgeBgClass} ${activeConditionTheme.badgeTextClass} border ${activeConditionTheme.badgeBorderClass}`}>
                        {condition}
                      </span>
                      <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-950/85 backdrop-blur-xs text-emerald-300 border border-emerald-500/30 flex items-center gap-1 shadow-xs">
                        <ShieldCheck className="w-2.5 h-2.5 text-emerald-400" />
                        <span>%99 Doğruluk Skoru</span>
                      </span>
                    </div>
                    <div className="absolute bottom-2 left-2 right-2 bg-white/95 backdrop-blur-xs p-1.5 rounded-lg flex items-center justify-between text-[10px] border border-stone-200">
                      <span className="font-semibold text-emerald-800">🌱 Karbon Tasarruflu</span>
                      <span className="font-bold text-stone-800">Stok: {stock} Adet</span>
                    </div>
                  </div>

                  <div className="p-4 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span className="font-bold text-[#8C3F23] uppercase">{brand || 'Markasız'}</span>
                      <span className="flex items-center gap-0.5"><MapPin className="w-3 h-3" /> {originCity || 'Eskişehir'}</span>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-stone-900 line-clamp-1">{title || 'İlan Başlığı'}</h4>

                    {hasPassport && memoryQuote && (
                      <p className="text-[11px] text-stone-600 italic bg-[#FAF8F5] p-2 rounded-lg border border-[#EDE7DD]">
                        "{memoryQuote}"
                      </p>
                    )}

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <div>
                        <span className="text-base font-extrabold text-stone-950 font-sans">
                          {numPrice > 0 ? `${numPrice.toLocaleString('tr-TR')} TL` : 'Fiyat Belirtilmedi'}
                        </span>
                        {originalPrice && (
                          <span className="text-xs text-stone-400 line-through ml-2">
                            {Number(originalPrice).toLocaleString('tr-TR')} TL
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] text-emerald-800 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                        {isFreeShippingForBuyer ? 'Ücretsiz Kargo' : '+49.90 TL Kargo'}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* REAL LISTING FORM */
            <form onSubmit={handleSubmit} className="space-y-6">

              {/* 1. FOTOĞRAF YÜKLEME ALANI */}
              <section className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-[#FAF3EB] text-[#9E4424] font-bold flex items-center justify-center text-xs">
                      1
                    </div>
                    <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                      Fotoğraf Yükle (En az 1 adet) *
                    </h4>
                  </div>
                  <span className="text-xs font-semibold text-stone-500">
                    {photos.length} / 8 Fotoğraf
                  </span>
                </div>

                {/* Photo Dropzone & List */}
                <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-4 gap-3 pt-1">
                  {photos.map((photoUrl, idx) => (
                    <div
                      key={idx}
                      className="group relative aspect-square rounded-2xl overflow-hidden border-2 border-stone-200 bg-stone-100 shadow-xs transition-all hover:border-[#9E4424]"
                    >
                      <img src={photoUrl} alt={`Fotoğraf ${idx + 1}`} className="w-full h-full object-cover" />
                      
                      {idx === 0 && (
                        <div className="absolute top-1.5 left-1.5 bg-[#9E4424] text-white text-[9px] font-bold px-2 py-0.5 rounded-md shadow-xs">
                          Kapak Görseli
                        </div>
                      )}

                      {/* Hover Actions */}
                      <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-1">
                        {idx !== 0 && (
                          <button
                            type="button"
                            onClick={() => handleSetCoverPhoto(idx)}
                            className="p-1.5 px-2 rounded-lg bg-white/95 hover:bg-white text-stone-800 text-[10px] font-bold shadow-xs cursor-pointer"
                            title="Kapak Yap"
                          >
                            Kapak Yap
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(idx)}
                          className="p-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white shadow-xs cursor-pointer"
                          title="Sil"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  {/* Upload Button */}
                  {photos.length < 8 && (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-2xl border-2 border-dashed border-stone-300 hover:border-[#9E4424] bg-[#FAF8F5] hover:bg-white transition-all flex flex-col items-center justify-center gap-1.5 text-stone-600 hover:text-[#9E4424] cursor-pointer group p-3 text-center"
                    >
                      <div className="p-2.5 rounded-full bg-stone-100 group-hover:bg-[#FAF3EB] text-[#9E4424] transition-colors">
                        <Upload className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold">Cihazdan Seç</span>
                      <span className="text-[10px] text-stone-400">JPG, PNG, WEBP</span>
                    </button>
                  )}
                </div>

                {/* Hidden File Input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />

                {/* Alternatif URL ile görsel ekleme seçeneği */}
                <div className="pt-1">
                  {!showUrlField ? (
                    <button
                      type="button"
                      onClick={() => setShowUrlField(true)}
                      className="text-xs text-[#9E4424] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      <LinkIcon className="w-3.5 h-3.5" />
                      <span>Veya resim web linki (URL) ekleyin</span>
                    </button>
                  ) : (
                    <div className="flex gap-2 items-center bg-[#FAF8F5] p-2 rounded-xl border border-stone-200">
                      <input
                        type="url"
                        value={urlInput}
                        onChange={(e) => setUrlInput(e.target.value)}
                        placeholder="https://example.com/resim.jpg"
                        className="flex-1 text-xs p-2 bg-white border border-stone-300 rounded-lg focus:outline-none focus:border-[#9E4424]"
                      />
                      <button
                        type="button"
                        onClick={handleAddPhotoByUrl}
                        className="px-3 py-2 bg-[#9E4424] text-white text-xs font-bold rounded-lg hover:bg-[#85361A] transition-colors cursor-pointer"
                      >
                        Ekle
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowUrlField(false)}
                        className="p-2 text-stone-400 hover:text-stone-700 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </section>

              {/* 2. TEMEL BİLGİLER */}
              <section className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#FAF3EB] text-[#9E4424] font-bold flex items-center justify-center text-xs">
                    2
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                    İlan Bilgileri
                  </h4>
                </div>

                {/* Title */}
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">
                    İlan Başlığı *
                  </label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Örn: 90'lar Orijinal Levi's 501 Kot Pantolon"
                    className="w-full text-xs sm:text-sm p-3 bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424] focus:bg-white font-sans"
                  />
                </div>

                {/* Category & Brand */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-800 block mb-1">
                      Kategori *
                    </label>
                    <select
                      value={category}
                      onChange={(e) => setCategory(e.target.value as ProductCategory)}
                      className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424] text-stone-900"
                    >
                      <option value="kadin">Kadın Giyim</option>
                      <option value="erkek">Erkek Giyim</option>
                      <option value="canta_aksesuar">Çanta & Aksesuar</option>
                      <option value="ayakkabi">Ayakkabı</option>
                      <option value="elektronik">Teknoloji & Analog</option>
                      <option value="ev_yasam">Ev & Yaşam & Antika</option>
                      <option value="cocuk">Çocuk & Bebek</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-800 block mb-1">
                      Marka
                    </label>
                    <input
                      type="text"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      placeholder="Örn: Zara, Levi's, Burberry..."
                      className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424] text-stone-900"
                    />
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {POPULAR_BRANDS.slice(0, 5).map((b) => (
                        <button
                          key={b}
                          type="button"
                          onClick={() => setBrand(b)}
                          className={`text-[10px] px-2 py-0.5 rounded-md border transition-all cursor-pointer ${
                            brand === b
                              ? 'bg-[#9E4424] text-white border-[#9E4424]'
                              : 'bg-stone-50 hover:bg-stone-100 text-stone-600 border-stone-200'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Size & Stock */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-800 block mb-1">
                      Beden / Ebat (Opsiyonel)
                    </label>
                    <input
                      type="text"
                      value={size}
                      onChange={(e) => setSize(e.target.value)}
                      placeholder="S, M, L, W32/L32, 38..."
                      className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424]"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-800 block mb-1">
                      Stok Adedi *
                    </label>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setStock(Math.max(1, stock - 1))}
                        className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-base flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <input
                        type="number"
                        min={1}
                        value={stock}
                        onChange={(e) => setStock(Math.max(1, Number(e.target.value)))}
                        className="w-16 text-center font-bold text-xs p-2 bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424]"
                      />
                      <button
                        type="button"
                        onClick={() => setStock(stock + 1)}
                        className="w-9 h-9 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-base flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                      <span className="text-[11px] text-stone-500 ml-1">
                        {stock === 1 ? 'Tekil İkinci El' : `${stock} Adet`}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Kondisyon Durumu */}
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-2">
                    Eşya Kondisyonu *
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
                    {[
                      { val: 'Kusursuz (Yeni Gibi)' as ProductCondition, label: 'Kusursuz', desc: 'Etiketli veya 1-2 kez giyilmiş', color: 'border-emerald-500 bg-emerald-50/60 text-emerald-900' },
                      { val: 'Çok İyi (Az Kullanılmış)' as ProductCondition, label: 'Çok İyi', desc: 'Tertemiz, deformasyonsuz', color: 'border-blue-500 bg-blue-50/60 text-blue-900' },
                      { val: 'İyi (Yaşanmışlık İzi Var)' as ProductCondition, label: 'İyi / Patinalı', desc: 'Hafif kullanım izi var', color: 'border-amber-500 bg-amber-50/60 text-amber-900' },
                      { val: 'Vintage / Koleksiyonluk' as ProductCondition, label: 'Vintage Koleksiyonluk', desc: 'Dönemine has vintage değer', color: 'border-purple-500 bg-purple-50/60 text-purple-900' },
                    ].map((c) => {
                      const isSelected = condition === c.val;
                      return (
                        <div
                          key={c.val}
                          onClick={() => setCondition(c.val)}
                          className={`p-3 rounded-xl border-2 cursor-pointer transition-all flex flex-col justify-between ${
                            isSelected
                              ? `${c.color} ring-2 ring-stone-900/10 shadow-xs font-semibold`
                              : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-bold">{c.label}</span>
                            {isSelected && <Check className="w-3.5 h-3.5" />}
                          </div>
                          <span className="text-[10px] text-stone-500 leading-tight">{c.desc}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* KONDİSYON DOĞRULAMA & KUSUR KONTROL LİSTESİ (ÇÖZÜM 2 & 4) */}
                <div className="bg-[#FAF8F5] border border-amber-200/90 rounded-2xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-amber-500/15 text-amber-700 flex items-center justify-center">
                        <ShieldCheck className="w-4 h-4" />
                      </div>
                      <div>
                        <h5 className="text-xs font-bold text-stone-900">
                          Kondisyon Doğrulama & Kusur Kontrol Listesi
                        </h5>
                        <p className="text-[10px] text-stone-500">
                          Alıcı güveni ve yüksek Satıcı Kondisyon Skoru (%99+) için objektif soruları yanıtlayın.
                        </p>
                      </div>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      Doğrulanmış İlan
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                    {/* 1. Orijinal Etiket */}
                    <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-stone-200 cursor-pointer hover:border-stone-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={hasTag}
                        onChange={(e) => setHasTag(e.target.checked)}
                        className="w-4 h-4 text-[#9E4424] rounded border-stone-300 focus:ring-[#9E4424]"
                      />
                      <span className="text-[11px] font-medium text-stone-700">
                        Orijinal marka / beden etiketi mevcut
                      </span>
                    </label>

                    {/* 2. Temizlik & Koku */}
                    <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-stone-200 cursor-pointer hover:border-stone-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={isCleanAndOdorFree}
                        onChange={(e) => setIsCleanAndOdorFree(e.target.checked)}
                        className="w-4 h-4 text-[#9E4424] rounded border-stone-300 focus:ring-[#9E4424]"
                      />
                      <span className="text-[11px] font-medium text-stone-700">
                        Kokusuz ve temizlenmiş (yıkanmış/havalanmış)
                      </span>
                    </label>

                    {/* 3. Tadilat / Onarım */}
                    <label className="flex items-center gap-2.5 p-2.5 rounded-xl bg-white border border-stone-200 cursor-pointer hover:border-stone-300 transition-colors">
                      <input
                        type="checkbox"
                        checked={isRepaired}
                        onChange={(e) => setIsRepaired(e.target.checked)}
                        className="w-4 h-4 text-[#9E4424] rounded border-stone-300 focus:ring-[#9E4424]"
                      />
                      <span className="text-[11px] font-medium text-stone-700">
                        Daha önce terzi tadilatı / onarım yapıldı
                      </span>
                    </label>

                    {/* 4. Kusur / Leke / Delik */}
                    <label className={`flex items-center gap-2.5 p-2.5 rounded-xl border cursor-pointer transition-colors ${
                      hasFlaws ? 'bg-amber-50/80 border-amber-300' : 'bg-white border-stone-200 hover:border-stone-300'
                    }`}>
                      <input
                        type="checkbox"
                        checked={hasFlaws}
                        onChange={(e) => setHasFlaws(e.target.checked)}
                        className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500"
                      />
                      <span className="text-[11px] font-medium text-stone-700">
                        Üründe ufak bir kusur, leke veya deformasyon var
                      </span>
                    </label>
                  </div>

                  {/* Kusur Varsa Detay Yazma Alanı */}
                  {hasFlaws && (
                    <div className="bg-amber-50/80 p-3 rounded-xl border border-amber-300/90 animate-in fade-in duration-200 space-y-1">
                      <label className="text-[11px] font-bold text-amber-900 flex items-center gap-1.5">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                        Kusurun Yeri ve Durumu (Zorunlu Detay) *
                      </label>
                      <input
                        type="text"
                        required={hasFlaws}
                        value={flawDetails}
                        onChange={(e) => setFlawDetails(e.target.value)}
                        placeholder="Örn: Sol kol ucunda 2 mm hafif solma var, fotoğraflarda gösterildi."
                        className="w-full text-xs p-2.5 bg-white border border-amber-300 rounded-lg focus:outline-none focus:border-amber-600 text-stone-800"
                      />
                      <p className="text-[10px] text-amber-700">
                        💡 Kusuru dürüstçe açıklamak ve fotoğrafını yüklemek iade riskini sıfırlar ve satıcı itibarınızı korur.
                      </p>
                    </div>
                  )}

                  {/* 48 Saat Havuz Hesap Uyarısı */}
                  <div className="flex items-start gap-2 pt-1 text-[11px] text-stone-600 bg-white/80 p-2.5 rounded-xl border border-stone-200/80">
                    <input
                      type="checkbox"
                      id="conditionConfirmed"
                      checked={conditionConfirmed}
                      onChange={(e) => setConditionConfirmed(e.target.checked)}
                      className="mt-0.5 w-4 h-4 text-[#9E4424] rounded border-stone-300 focus:ring-[#9E4424]"
                    />
                    <label htmlFor="conditionConfirmed" className="cursor-pointer leading-tight select-none">
                      <strong className="text-stone-800">48 Saat Havuz Hesap Güvencesini Kabul Ediyorum:</strong> Ürün alıcıya ulaştığında ilan beyanı ile uyuşmazsa alıcı koşulsuz iade hakkına sahiptir. Doğru beyanlar Satıcı Kondisyon Skorumu (%99+) artırır.
                    </label>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">
                    Ürün Açıklaması *
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Kumaşı, rengi, ölçüleri, varsa kullanım izlerini samimiyetle açıklayın..."
                    className="w-full text-xs p-3 bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424] focus:bg-white leading-relaxed"
                  />
                </div>
              </section>

              {/* 3. FİYATLANDIRMA & DOKAN KOMİSYONU */}
              <section className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-xs space-y-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-[#FAF3EB] text-[#9E4424] font-bold flex items-center justify-center text-xs">
                    3
                  </div>
                  <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                    Fiyatlandırma & Satıcı Net Kazancı
                  </h4>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-stone-800 block mb-1">
                      Satış Fiyatı (TL) *
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        required
                        min={10}
                        value={price}
                        onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Örn: 450"
                        className="w-full text-sm font-bold p-3 pl-8 bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424] focus:bg-white"
                      />
                      <span className="absolute left-3 top-3.5 text-stone-400 font-bold">₺</span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-stone-800 block mb-1">
                      Orijinal Mağaza Fiyatı (Opsiyonel)
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        min={10}
                        value={originalPrice}
                        onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Örn: 1200"
                        className="w-full text-sm p-3 pl-8 bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424] focus:bg-white text-stone-600"
                      />
                      <span className="absolute left-3 top-3.5 text-stone-400 font-bold">₺</span>
                    </div>
                  </div>
                </div>

                {/* Net Earnings Calculation */}
                {numPrice > 0 && (
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-xs space-y-2">
                    <div className="flex items-center justify-between pb-2 border-b border-emerald-200/80">
                      <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                        <Calculator className="w-4 h-4 text-emerald-700" />
                        Hesabınıza Geçecek Net Tutar:
                      </span>
                      <span className="text-base sm:text-lg font-black text-emerald-800 font-sans">
                        {netEarnings.toLocaleString('tr-TR')} TL
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] text-stone-600 pt-1">
                      <div>
                        <span className="block text-stone-400">Ürün Fiyatı:</span>
                        <strong className="text-stone-900">{numPrice.toLocaleString('tr-TR')} TL</strong>
                      </div>
                      <div>
                        <span className="block text-stone-400">Dokan Lite Komisyonu (%10):</span>
                        <strong className="text-rose-700">-{commissionAmount.toLocaleString('tr-TR')} TL</strong>
                      </div>
                      <div>
                        <span className="block text-stone-400">Kargo Koşulu:</span>
                        <strong className="text-emerald-800">
                          {isFreeShippingForBuyer ? '750 TL Üzeri Ücretsiz Kargo' : 'Alıcı Öder (+49.90 TL)'}
                        </strong>
                      </div>
                    </div>
                  </div>
                )}
              </section>

              {/* 4. HAFIZA PASAPORTU (İSTEĞE BAĞLI / OPSİYONEL) */}
              <section className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-xs space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Feather className="w-4 h-4 text-[#9E4424]" />
                    <h4 className="font-serif font-bold text-sm text-[#1C1917]">
                      Eşyaya Hafıza Pasaportu Ekle (Opsiyonel)
                    </h4>
                  </div>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <span className="text-xs text-stone-500 font-medium">Hafıza Ekle</span>
                    <input
                      type="checkbox"
                      checked={hasPassport}
                      onChange={(e) => setHasPassport(e.target.checked)}
                      className="w-4 h-4 accent-[#9E4424] rounded cursor-pointer"
                    />
                  </label>
                </div>

                <p className="text-xs text-stone-500">
                  Eşyanızın nereden geldiğini veya hatırasını paylaşarak alıcılarla bağ kurabilir ve ilanınızı vitrinde öne çıkarabilirsiniz.
                </p>

                {hasPassport && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-stone-100 animate-in fade-in">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                        Dönem / Yıl
                      </label>
                      <input
                        type="text"
                        value={eraOrYear}
                        onChange={(e) => setEraOrYear(e.target.value)}
                        placeholder="Örn: 1998, 90'lar, 2010"
                        className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                        Menşei / Satın Alındığı Şehir
                      </label>
                      <input
                        type="text"
                        value={originCity}
                        onChange={(e) => setOriginCity(e.target.value)}
                        placeholder="Örn: Eskişehir, Kadıköy, İzmir"
                        className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424]"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                        Kısa Hatıra Notu
                      </label>
                      <input
                        type="text"
                        value={memoryQuote}
                        onChange={(e) => setMemoryQuote(e.target.value)}
                        placeholder="Örn: İlk maaşımla almıştım, çok özenle saklandı..."
                        className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424]"
                      />
                    </div>
                  </div>
                )}
              </section>

              {/* ACTION BUTTONS */}
              <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                <button
                  type="button"
                  onClick={() => setActiveTab('preview')}
                  className="w-full sm:w-auto px-5 py-3.5 rounded-xl border border-stone-300 hover:border-stone-400 bg-white text-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                >
                  <Eye className="w-4 h-4 text-stone-500" />
                  <span>Önizleme Yap</span>
                </button>

                <button
                  type="submit"
                  disabled={isPublishing}
                  className="w-full sm:flex-1 py-3.5 px-6 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-98 disabled:opacity-50 flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isPublishing ? (
                    <span>İlanınız Yayınlanıyor...</span>
                  ) : (
                    <>
                      <span>İlanı Vitrine Çıkar</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

            </form>
          )}
        </div>
      </div>
    </div>
  );
};
