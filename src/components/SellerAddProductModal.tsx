import React, { useState } from 'react';
import { X, Feather, Sparkles, Layers, Image as ImageIcon, CheckCircle, MapPin, BookOpen } from 'lucide-react';
import { Product, ProductCategory, ProductCondition, ProductVariation } from '../types';

interface SellerAddProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  sellerEmail: string;
  onUpdateSellerEmail: (email: string) => void;
  onAddProduct: (product: Product) => void;
}

const SAMPLE_SELLER_IMAGES = [
  { label: 'Vintage İpek Gömlek', url: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80' },
  { label: '90lar Kot Ceket', url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80' },
  { label: 'Retro Kasetçalar Walkman', url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800&auto=format&fit=crop&q=80' },
  { label: 'Vintage Polar Filtre Gözlük', url: 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&auto=format&fit=crop&q=80' },
  { label: 'Bakır Antika Kahve Değirmeni', url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=800&auto=format&fit=crop&q=80' },
  { label: 'Retro Daktilo Olivetti', url: 'https://images.unsplash.com/photo-1505330622279-bf7d7fc918f4?w=800&auto=format&fit=crop&q=80' },
];

export const SellerAddProductModal: React.FC<SellerAddProductModalProps> = ({
  isOpen,
  onClose,
  sellerEmail,
  onUpdateSellerEmail,
  onAddProduct,
}) => {
  if (!isOpen) return null;

  // Form State
  const [storeName, setStoreName] = useState('Semih Akkoyun Koleksiyonu');
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('kadin');
  const [brand, setBrand] = useState('Vintage & Özgün');
  const [condition, setCondition] = useState<ProductCondition>('Çok İyi (Az Kullanılmış)');
  const [size, setSize] = useState('M');
  const [price, setPrice] = useState<number | ''>('');
  const [originalPrice, setOriginalPrice] = useState<number | ''>('');
  const [selectedImageUrl, setSelectedImageUrl] = useState(SAMPLE_SELLER_IMAGES[0].url);
  const [customImageUrl, setCustomImageUrl] = useState('');
  const [description, setDescription] = useState('');
  const [eraOrYear, setEraOrYear] = useState('1990’lar');
  const [originCity, setOriginCity] = useState('Eskişehir');
  const [memoryQuote, setMemoryQuote] = useState('');
  const [sellerFarewell, setSellerFarewell] = useState('');
  const [isVariable, setIsVariable] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  // Variations list for variable product
  const [variations, setVariations] = useState<ProductVariation[]>([
    { id: 'v1', size: 'S / 36', condition: 'Kusursuz', price: 850, stock: 1, sku: 'EV-NEW-S' },
    { id: 'v2', size: 'M / 38', condition: 'Çok İyi', price: 790, stock: 1, sku: 'EV-NEW-M' },
    { id: 'v3', size: 'L / 40', condition: 'İyi', price: 750, stock: 1, sku: 'EV-NEW-L' },
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !price) return;

    const finalImage = customImageUrl.trim() || selectedImageUrl;
    const catLabels: Record<ProductCategory, string> = {
      giyim: 'Giyim & Vintage Moda',
      kadin: 'Kadın Giyim',
      erkek: 'Erkek Giyim',
      cocuk: 'Çocuk & Bebek',
      ayakkabi: 'Ayakkabı',
      canta_aksesuar: 'Çanta & Aksesuar',
      elektronik: 'Teknoloji & Analog',
      ev_yasam: 'Ev & Yaşam & Koleksiyon',
    };

    let condType: 'yeni_gibi' | 'az_kullanilmis' | 'cok_kullanilmis' | 'vintage' = 'az_kullanilmis';
    if (condition.includes('Kusursuz') || condition.includes('Yeni Gibi')) {
      condType = 'yeni_gibi';
    } else if (condition.includes('Çok İyi') || condition.includes('Az')) {
      condType = 'az_kullanilmis';
    } else if (condition.includes('İyi') || condition.includes('Yaşanmışlık')) {
      condType = 'cok_kullanilmis';
    } else if (condition.includes('Vintage')) {
      condType = 'vintage';
    }

    const randomYear = eraOrYear.replace(/\D/g, '') || '2024';
    const cleanBrand = (brand.trim() || 'ELDE').split(' ')[0].toUpperCase();
    const passportCode = `EV-${randomYear}-${cleanBrand}`;

    const newProd: Product = {
      id: `prod-user-${Date.now()}`,
      title,
      category,
      categoryLabel: catLabels[category],
      price: Number(price),
      originalPrice: originalPrice ? Number(originalPrice) : undefined,
      condition,
      conditionType: condType,
      size: size.trim() || 'Standart',
      passportCode,
      brand: brand.trim() || 'İkinci El',
      description: description.trim() || 'Özenle muhafaza edilmiş, yeni hikâyesini bekleyen parça.',
      images: [finalImage],
      seller: {
        id: `seller-${sellerEmail.replace(/[^a-zA-Z0-9]/g, '_')}`,
        name: storeName.trim() || 'Doğrulanmış Satıcı',
        email: sellerEmail,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        rating: 5.0,
        salesCount: 1,
        location: `${originCity}, Türkiye`,
      },
      story: {
        eraOrYear: eraOrYear.trim() || '1990’lar',
        originCity: originCity.trim() || 'İstanbul',
        memoryQuote: memoryQuote.trim() || 'Yıllarca özenle saklandı, şimdi yeni sahibine emanet ediliyor.',
        storyDetail: description.trim() || 'Bu özel eşya, geçmiş günlerin hatırasını taşıyor ve yeni bir hayat bulmak için EldeVar platformunda sergileniyor.',
        sellerFarewell: sellerFarewell.trim() || 'Umarım senin hayatında da en az benimle olduğu kadar güzel günlere şahitlik eder.',
        travelBadge: `📜 ${eraOrYear.trim()} ${originCity.trim()} Hatırası`,
      },
      isVariable,
      variations: isVariable ? variations : undefined,
      ecoSavings: {
        co2Kg: Number((Number(price) * 0.015).toFixed(1)) || 12.5,
        waterLiters: Math.round(Number(price) * 3.5) || 2800,
      },
      shippingFee: Number(price) >= 750 ? 0 : 49.90,
      views: 1,
      likes: 0,
      createdAt: new Date().toISOString(),
    };

    onAddProduct(newProd);
    setIsPublished(true);
    setTimeout(() => {
      setIsPublished(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1917]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] w-full max-w-2xl rounded-2xl shadow-2xl border border-[#E8E2D8] overflow-hidden my-auto max-h-[92vh] flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        {/* Modal Top Header */}
        <div className="bg-white px-5 py-4 flex items-center justify-between border-b border-[#E8E2D8]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FAF5EE] text-[#9E4424] border border-[#E7D9C6]">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-[#1C1917] leading-none">
                Eşya Sat & Hatırasını Yeni Sahibine Aktar
              </h3>
              <span className="text-[11px] text-stone-500 font-sans mt-0.5 block">
                EldeVar'da her eşya bir hikâye ile yolculuğuna devam eder.
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form Content */}
        <div className="p-5 sm:p-6 overflow-y-auto">
          {isPublished ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-9 h-9" />
              </div>
              <h3 className="text-xl font-serif font-bold text-stone-900">Eşyanız ve Hikâyesi Yayınlandı!</h3>
              <p className="text-xs text-stone-600 max-w-md mx-auto">
                İlanınız hafıza pasaportuyla birlikte EldeVar pazaryerine eklendi. Alıcı çıktığında kargo için bilgilendirileceksiniz.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Product Title */}
              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">
                  Eşyanın Başlığı *
                </label>
                <input
                  type="text"
                  required
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Örn: 1985 Koleksiyonluk Deri Pilot Montu"
                  className="w-full text-xs p-2.5 bg-white border border-[#E2DBD0] rounded-xl focus:outline-none focus:border-[#9E4424]"
                />
              </div>

              {/* Category, Brand, Condition */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Kategori</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as ProductCategory)}
                    className="w-full text-xs p-2.5 bg-white border border-[#E2DBD0] rounded-xl focus:outline-none focus:border-[#9E4424]"
                  >
                    <option value="kadin">Kadın Giyim</option>
                    <option value="erkek">Erkek Giyim</option>
                    <option value="cocuk">Çocuk & Bebek</option>
                    <option value="ayakkabi">Ayakkabı</option>
                    <option value="canta_aksesuar">Çanta & Aksesuar</option>
                    <option value="elektronik">Teknoloji & Analog</option>
                    <option value="ev_yasam">Ev & Yaşam</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Marka / Köken</label>
                  <input
                    type="text"
                    value={brand}
                    onChange={(e) => setBrand(e.target.value)}
                    placeholder="Levi's, Yashica, El Dokuma"
                    className="w-full text-xs p-2.5 bg-white border border-[#E2DBD0] rounded-xl focus:outline-none focus:border-[#9E4424]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Kondisyon</label>
                  <select
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as ProductCondition)}
                    className="w-full text-xs p-2.5 bg-white border border-[#E2DBD0] rounded-xl focus:outline-none focus:border-[#9E4424]"
                  >
                    <option value="Kusursuz (Yeni Gibi)">Kusursuz (Yeni Gibi)</option>
                    <option value="Çok İyi (Az Kullanılmış)">Çok İyi (Az Kullanılmış)</option>
                    <option value="İyi (Yaşanmışlık İzi Var)">İyi (Yaşanmışlık İzi Var)</option>
                    <option value="Vintage / Koleksiyonluk">Vintage / Koleksiyonluk</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Beden / Ebat / Boy</label>
                  <input
                    type="text"
                    value={size}
                    onChange={(e) => setSize(e.target.value)}
                    placeholder="S, M, L, W32/L32, 120x180 cm vb."
                    className="w-full text-xs p-2.5 bg-white border border-[#E2DBD0] rounded-xl focus:outline-none focus:border-[#9E4424]"
                  />
                </div>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Satış Fiyatı (TL) *</label>
                  <input
                    type="number"
                    required
                    min={10}
                    value={price}
                    onChange={(e) => setPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="850"
                    className="w-full text-xs p-2.5 bg-white border border-[#E2DBD0] rounded-xl focus:outline-none focus:border-[#9E4424]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">Sıfır / Piyasa Değeri (İsteğe Bağlı)</label>
                  <input
                    type="number"
                    min={10}
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="1400"
                    className="w-full text-xs p-2.5 bg-white border border-[#E2DBD0] rounded-xl focus:outline-none focus:border-[#9E4424]"
                  />
                </div>
              </div>

              {/* Object Story & Memory Passport Section (Brand Feature) */}
              <div className="p-4 rounded-xl bg-white border border-[#E7DCCB] space-y-3">
                <div className="flex items-center gap-2 text-[#9E4424] font-serif font-bold text-xs uppercase tracking-wider">
                  <BookOpen className="w-4 h-4" />
                  <span>Eşyanın Hafıza Pasaportu (Sizi Farklı Kılan Hikâye)</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-700 block mb-1">Dönem / Yıl</label>
                    <input
                      type="text"
                      value={eraOrYear}
                      onChange={(e) => setEraOrYear(e.target.value)}
                      placeholder="1980'ler, 2004, 1996 Kadıköy"
                      className="w-full text-xs p-2 bg-[#FAF8F5] border border-stone-200 rounded-lg focus:outline-none focus:border-[#9E4424]"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-700 block mb-1">Çıktığı Şehir / Bölge</label>
                    <input
                      type="text"
                      value={originCity}
                      onChange={(e) => setOriginCity(e.target.value)}
                      placeholder="Eskişehir, Kadıköy, İzmir"
                      className="w-full text-xs p-2 bg-[#FAF8F5] border border-stone-200 rounded-lg focus:outline-none focus:border-[#9E4424]"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                    Kısa Hatıra Cümlesi (Kartta Gözükecek Vurgu)
                  </label>
                  <input
                    type="text"
                    value={memoryQuote}
                    onChange={(e) => setMemoryQuote(e.target.value)}
                    placeholder="Örn: Üniversite yıllarımda kış aylarında üzerimden hiç çıkarmadığım montum."
                    className="w-full text-xs p-2 bg-[#FAF8F5] border border-stone-200 rounded-lg focus:outline-none focus:border-[#9E4424]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                    Alıcıya Kraft Zarfında İletilecek El Yazısı Veda Notu
                  </label>
                  <textarea
                    rows={2}
                    value={sellerFarewell}
                    onChange={(e) => setSellerFarewell(e.target.value)}
                    placeholder="Örn: Yeni sahibine şans ve sıcaklık getirsin. Güzel günlerde kullan..."
                    className="w-full text-xs p-2 bg-[#FAF8F5] border border-stone-200 rounded-lg focus:outline-none focus:border-[#9E4424]"
                  />
                </div>
              </div>

              {/* Photo Selection */}
              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1.5">
                  Örnek Görsellerden Seç veya Kendi Görsel Bağlantını Gir
                </label>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mb-2">
                  {SAMPLE_SELLER_IMAGES.map((img, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setSelectedImageUrl(img.url);
                        setCustomImageUrl('');
                      }}
                      className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        selectedImageUrl === img.url && !customImageUrl
                          ? 'border-[#9E4424] ring-2 ring-[#9E4424]/20'
                          : 'border-stone-200 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={img.url} alt={img.label} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>

                <input
                  type="url"
                  value={customImageUrl}
                  onChange={(e) => setCustomImageUrl(e.target.value)}
                  placeholder="Veya doğrudan bir fotoğraf bağlantısı (URL) yapıştırın..."
                  className="w-full text-xs p-2 bg-white border border-[#E2DBD0] rounded-xl focus:outline-none focus:border-[#9E4424]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">Genel Ürün Açıklaması</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Kumaş dokusu, ölçüler veya kullanım detaylarını belirtin..."
                  className="w-full text-xs p-2.5 bg-white border border-[#E2DBD0] rounded-xl focus:outline-none focus:border-[#9E4424]"
                />
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3 px-4 bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-xs sm:text-sm rounded-xl transition-all shadow-md active:scale-98 flex items-center justify-center gap-2"
                >
                  <Feather className="w-4 h-4 text-amber-200" />
                  <span>Eşyayı ve Hikâyesini Pazaryerinde Yayınla</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
