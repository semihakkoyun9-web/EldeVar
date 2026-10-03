import React, { useState } from 'react';
import { X, Tag, Send, CheckCircle2, ShieldCheck, AlertCircle, Percent } from 'lucide-react';
import { Product, ProductOffer } from '../types';

interface MakeOfferModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSubmitOffer: (offer: Omit<ProductOffer, 'id' | 'createdAt' | 'status'>) => void;
}

export const MakeOfferModal: React.FC<MakeOfferModalProps> = ({
  isOpen,
  onClose,
  product,
  onSubmitOffer,
}) => {
  if (!isOpen || !product) return null;

  const currentPrice = product.price;
  const [selectedPercentage, setSelectedPercentage] = useState<number | null>(10);
  const [customPrice, setCustomPrice] = useState<number | ''>(Math.round(currentPrice * 0.9));
  const [buyerMessage, setBuyerMessage] = useState('');
  const [buyerName, setBuyerName] = useState('Semih Akkoyun');
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Quick discount calculation
  const handleSelectDiscount = (percent: number) => {
    setSelectedPercentage(percent);
    const newPrice = Math.round(currentPrice * (1 - percent / 100));
    setCustomPrice(newPrice);
    setError(null);
  };

  const handleCustomPriceChange = (val: string) => {
    setSelectedPercentage(null);
    if (val === '') {
      setCustomPrice('');
      return;
    }
    const num = Number(val);
    setCustomPrice(num);
    if (num > currentPrice) {
      setError('Teklif tutarı ürünün mevcut satış fiyatından yüksek olamaz.');
    } else if (num < currentPrice * 0.4) {
      setError('Satıcı saygısı için %60\'tan daha yüksek indirim teklif edilemez.');
    } else {
      setError(null);
    }
  };

  const calculatedDiscount = typeof customPrice === 'number' && currentPrice > 0
    ? Math.max(0, Math.round(((currentPrice - customPrice) / currentPrice) * 100))
    : 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof customPrice !== 'number' || customPrice <= 0) {
      setError('Lütfen geçerli bir teklif tutarı girin.');
      return;
    }
    if (customPrice >= currentPrice) {
      setError('Teklif tutarı liste fiyatından düşük olmalıdır. Doğrudan satın alabilirsiniz.');
      return;
    }
    if (customPrice < currentPrice * 0.4) {
      setError('Teklif tutarı liste fiyatının en az %40\'ı kadar olmalıdır.');
      return;
    }

    onSubmitOffer({
      productId: product.id,
      productTitle: product.title,
      productImage: product.images[0],
      originalPrice: currentPrice,
      offeredPrice: customPrice,
      discountPercentage: calculatedDiscount,
      buyerName: buyerName.trim() || 'Alıcı',
      message: buyerMessage.trim() || undefined,
    });

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      onClose();
    }, 1800);
  };

  return (
    <div className="fixed inset-0 z-60 bg-[#1C1917]/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] w-full max-w-lg rounded-3xl shadow-2xl border border-[#E8E2D8] overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="bg-[#1C1917] text-white px-5 sm:px-6 py-4 flex items-center justify-between border-b border-stone-800">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/20 text-amber-300">
              <Tag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base text-white">
                Fiyat Teklifi Ver & Pazarlık Masası
              </h3>
              <p className="text-[11px] text-stone-300">
                Satıcıya makul bir teklif sunarak eşyayı rezerve edin
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-white rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success View */}
        {isSuccess ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h4 className="font-serif font-bold text-lg text-stone-900">
              Teklifiniz Satıcıya İletildi!
            </h4>
            <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
              <strong>{customPrice.toLocaleString('tr-TR')} TL</strong> tutarındaki teklifiniz <strong>{product.seller.name}</strong> adlı satıcıya iletildi. Satıcı onayladığında 24 saat geçerli özel satın alma bağlantısı oluşturulacak.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-4">
            
            {/* Product Summary Card */}
            <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-white border border-[#E8E2D8] shadow-2xs">
              <img
                src={product.images[0]}
                alt={product.title}
                className="w-16 h-16 rounded-xl object-cover border border-stone-200 shrink-0"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold text-[#9E4424] uppercase tracking-wide">
                  {product.brand} • {product.seller.name}
                </span>
                <h4 className="text-xs font-serif font-bold text-stone-900 truncate">
                  {product.title}
                </h4>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-xs text-stone-500">Mevcut Liste Fiyatı:</span>
                  <span className="text-sm font-extrabold text-stone-900">
                    {currentPrice.toLocaleString('tr-TR')} TL
                  </span>
                </div>
              </div>
            </div>

            {/* Quick Percentage Chips */}
            <div>
              <label className="text-xs font-bold text-stone-800 block mb-2 flex items-center gap-1.5">
                <Percent className="w-3.5 h-3.5 text-[#9E4424]" />
                Hızlı İndirim Oranı Seçin
              </label>
              <div className="grid grid-cols-4 gap-2">
                {[10, 15, 20, 25].map((pct) => {
                  const isSelected = selectedPercentage === pct;
                  const targetVal = Math.round(currentPrice * (1 - pct / 100));
                  return (
                    <button
                      key={pct}
                      type="button"
                      onClick={() => handleSelectDiscount(pct)}
                      className={`p-2 rounded-xl text-center border-2 transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#9E4424] bg-[#FAF3EB] text-[#8C3F23] font-bold shadow-xs ring-1 ring-[#9E4424]'
                          : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                      }`}
                    >
                      <span className="block text-xs font-bold">-%{pct}</span>
                      <span className="block text-[10px] text-stone-500 mt-0.5">
                        {targetVal} TL
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Custom Offer Price Input */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-stone-800">
                  Teklif Ettiğiniz Tutar (TL) *
                </label>
                {calculatedDiscount > 0 && (
                  <span className="text-[11px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    %{calculatedDiscount} Tasarruf
                  </span>
                )}
              </div>
              <div className="relative">
                <input
                  type="number"
                  required
                  min={Math.round(currentPrice * 0.4)}
                  max={currentPrice - 1}
                  value={customPrice}
                  onChange={(e) => handleCustomPriceChange(e.target.value)}
                  placeholder="Teklif tutarı..."
                  className="w-full text-base font-extrabold p-3 pl-8 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424] text-stone-900"
                />
                <span className="absolute left-3 top-3.5 text-stone-400 font-bold">₺</span>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Optional Note to Seller */}
            <div>
              <label className="text-xs font-semibold text-stone-800 block mb-1">
                Satıcıya Nazik Bir Not (Opsiyonel)
              </label>
              <textarea
                rows={2}
                value={buyerMessage}
                onChange={(e) => setBuyerMessage(e.target.value)}
                placeholder="Örn: Merhaba, bütçem kısıtlı bir öğrenciyim. Kabul ederseniz hemen satın almak isterim..."
                className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424] text-stone-800"
              />
            </div>

            {/* Escrow Guarantee Note */}
            <div className="p-2.5 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex items-start gap-2 text-[11px] text-emerald-950">
              <ShieldCheck className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
              <span>
                Teklifiniz kabul edildiğinde tutar doğrudan tahsil edilmez; ürün 24 saatliğine rezerve edilir ve 48 saatlik Havuz Hesap güvencesiyle satın alma onayınıza sunulur.
              </span>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-700 font-bold text-xs cursor-pointer transition-colors"
              >
                Vazgeç
              </button>

              <button
                type="submit"
                className="flex-2 py-3 px-4 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Teklifi Satıcıya Gönder ({typeof customPrice === 'number' ? `${customPrice} TL` : ''})</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
