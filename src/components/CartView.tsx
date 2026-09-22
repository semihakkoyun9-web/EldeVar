import React, { useState } from 'react';
import { ShoppingBag, Trash2, ArrowRight, Tag, Truck, Check, Sparkles, ShieldCheck } from 'lucide-react';
import { CartItem, Coupon } from '../types';
import { FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE, AVAILABLE_COUPONS } from '../data/mockData';

interface CartViewProps {
  cart: CartItem[];
  onUpdateQuantity: (index: number, newQty: number) => void;
  onRemoveItem: (index: number) => void;
  onClearCart: () => void;
  appliedCoupon: Coupon | null;
  onApplyCoupon: (code: string) => { success: boolean; message: string };
  onRemoveCoupon: () => void;
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartView: React.FC<CartViewProps> = ({
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  appliedCoupon,
  onApplyCoupon,
  onRemoveCoupon,
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Subtotal calculation
  const subtotal = cart.reduce((acc, item) => {
    const itemPrice = item.selectedVariation ? item.selectedVariation.price : item.product.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  // Free shipping check & progress bar
  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  const remainingForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal);
  const shippingProgress = Math.min(100, Math.round((subtotal / FREE_SHIPPING_THRESHOLD) * 100));

  // Discount calculation
  let discountAmount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minSpend) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  const shippingFee = cart.length === 0 ? 0 : isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const handleApplyCoupon = (e?: React.FormEvent, customCode?: string) => {
    if (e) e.preventDefault();
    const codeToTest = customCode || couponInput.trim();
    if (!codeToTest) return;

    const res = onApplyCoupon(codeToTest);
    setCouponFeedback(res);
    if (res.success) {
      setCouponInput('');
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-12 text-center">
        <div className="w-20 h-20 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
          <ShoppingBag className="w-10 h-10 stroke-[1.5]" />
        </div>
        <h2 className="text-xl font-bold text-stone-900 mb-2">Sepetiniz Boş</h2>
        <p className="text-sm text-stone-500 mb-6 max-w-sm mx-auto">
          Eski hikâyeleri yeni sahipleriyle buluşturmak için ikinci el pazarını keşfedin.
        </p>
        <button
          onClick={onContinueShopping}
          className="px-6 py-2.5 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-medium text-sm transition-all shadow-sm"
        >
          Ürünleri Keşfet
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 pb-28">
      {/* Title & Clear */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl sm:text-2xl font-bold text-stone-900 flex items-center gap-2">
          <span>Sepetim</span>
          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
            {cart.reduce((a, b) => a + b.quantity, 0)} Ürün
          </span>
        </h2>
        <button
          onClick={onClearCart}
          className="text-xs text-stone-400 hover:text-rose-600 transition-colors"
        >
          Sepeti Temizle
        </button>
      </div>

      {/* Free Shipping Dynamic Progress Bar (PDF Zorunlu Kriteri) */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-stone-900 to-stone-800 text-white shadow-md">
        <div className="flex items-center justify-between text-xs mb-2">
          <div className="flex items-center gap-2">
            <Truck className="w-4 h-4 text-amber-400" />
            {isFreeShipping ? (
              <span className="font-bold text-emerald-400 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Tebrikler! Kargonuz BEDAVA!
              </span>
            ) : (
              <span>
                Ücretsiz Kargo için son{' '}
                <strong className="text-amber-400">{remainingForFreeShipping.toFixed(2)} TL</strong> kaldı!
              </span>
            )}
          </div>
          <span className="font-mono text-stone-400">{shippingProgress}%</span>
        </div>
        <div className="w-full bg-stone-700 h-2.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              isFreeShipping ? 'bg-emerald-400' : 'bg-gradient-to-r from-amber-500 to-amber-300'
            }`}
            style={{ width: `${shippingProgress}%` }}
          />
        </div>
        <div className="flex justify-between text-[10px] text-stone-400 mt-1">
          <span>0 TL</span>
          <span>Hedef: {FREE_SHIPPING_THRESHOLD} TL (Kargo Bedava)</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-3">
          {cart.map((item, index) => {
            const itemPrice = item.selectedVariation ? item.selectedVariation.price : item.product.price;
            return (
              <div
                key={`${item.product.id}-${item.selectedVariation?.id || 'base'}-${index}`}
                className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-xs flex gap-3.5 items-center"
              >
                {/* Product Thumbnail */}
                <img
                  src={item.product.images[0]}
                  alt={item.product.title}
                  referrerPolicy="no-referrer"
                  className="w-18 h-18 sm:w-20 sm:h-20 rounded-lg object-cover bg-stone-100 shrink-0 border border-stone-100"
                />

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider block">
                        {item.product.brand}
                      </span>
                      <h4 className="text-xs sm:text-sm font-semibold text-stone-900 truncate">
                        {item.product.title}
                      </h4>
                    </div>
                    <button
                      onClick={() => onRemoveItem(index)}
                      className="text-stone-400 hover:text-rose-500 p-1 transition-colors"
                      title="Kaldır"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Variation Details if applicable */}
                  {item.selectedVariation && (
                    <div className="mt-1 text-[11px] text-amber-800 bg-amber-50 px-2 py-0.5 rounded-md inline-block">
                      Seçim: {item.selectedVariation.size} • {item.selectedVariation.condition}
                    </div>
                  )}

                  {/* Seller info */}
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    Satıcı: <span className="font-medium text-stone-700">{item.product.seller.name}</span>
                  </div>

                  {/* Price and Quantity */}
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-sm font-bold text-stone-950 font-sans">
                      {(itemPrice * item.quantity).toLocaleString('tr-TR')} TL
                    </span>

                    <div className="flex items-center border border-stone-300 rounded-lg bg-stone-50">
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                        className="px-2.5 py-0.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-l transition-colors"
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="px-2 text-xs font-semibold text-stone-900">{item.quantity}</span>
                      <button
                        onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                        className="px-2.5 py-0.5 text-xs text-stone-600 hover:text-stone-900 hover:bg-stone-200 rounded-r transition-colors"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right: Coupon & Order Summary */}
        <div className="space-y-4">
          {/* Coupon Section (PDF Zorunlu Kriteri) */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider flex items-center gap-1.5 mb-2.5">
              <Tag className="w-3.5 h-3.5 text-amber-600" />
              <span>İndirim Kuponu</span>
            </h3>

            {appliedCoupon ? (
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-emerald-900 font-mono">{appliedCoupon.code}</span>
                  <span className="text-emerald-700 block text-[11px]">{appliedCoupon.description}</span>
                </div>
                <button
                  onClick={onRemoveCoupon}
                  className="text-emerald-800 hover:text-emerald-950 font-bold text-xs underline"
                >
                  Kaldır
                </button>
              </div>
            ) : (
              <form onSubmit={(e) => handleApplyCoupon(e)} className="space-y-2">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Kupon Kodu (Örn: ELDEVAR10)"
                    className="flex-1 text-xs uppercase font-mono px-3 py-2 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-500"
                  />
                  <button
                    type="submit"
                    className="px-3 py-2 bg-stone-900 text-white rounded-lg text-xs font-bold hover:bg-stone-800 transition-colors"
                  >
                    Uygula
                  </button>
                </div>

                {couponFeedback && (
                  <p
                    className={`text-[11px] ${
                      couponFeedback.success ? 'text-emerald-600 font-semibold' : 'text-rose-600'
                    }`}
                  >
                    {couponFeedback.message}
                  </p>
                )}

                {/* Fast Coupon Presets */}
                <div className="pt-2 border-t border-stone-100">
                  <span className="text-[10px] text-stone-400 block mb-1">Mevcut Kuponlar:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {AVAILABLE_COUPONS.map((cp) => (
                      <button
                        type="button"
                        key={cp.code}
                        onClick={() => handleApplyCoupon(undefined, cp.code)}
                        className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-stone-100 hover:bg-amber-100 hover:text-amber-900 text-stone-700 border border-stone-200 transition-colors"
                      >
                        {cp.code} ({cp.type === 'percent' ? `%${cp.value}` : `${cp.value} TL`})
                      </button>
                    ))}
                  </div>
                </div>
              </form>
            )}
          </div>

          {/* Order Summary Card */}
          <div className="bg-white p-4 rounded-xl border border-stone-200 shadow-xs">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider mb-3">
              Sipariş Özeti
            </h3>

            <div className="space-y-2 text-xs text-stone-600 pb-3 border-b border-stone-100">
              <div className="flex justify-between">
                <span>Ürünler Toplamı</span>
                <span className="font-semibold text-stone-900">{subtotal.toLocaleString('tr-TR')} TL</span>
              </div>

              {appliedCoupon && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Kupon İndirimi ({appliedCoupon.code})</span>
                  <span>-{discountAmount.toLocaleString('tr-TR')} TL</span>
                </div>
              )}

              <div className="flex justify-between items-center">
                <span className="flex items-center gap-1">
                  <span>Kargo Bedeli</span>
                  {isFreeShipping && (
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.2 rounded">
                      ÜCRETSİZ
                    </span>
                  )}
                </span>
                <span className="font-semibold text-stone-900">
                  {isFreeShipping ? '0,00 TL' : `${STANDARD_SHIPPING_FEE.toFixed(2)} TL`}
                </span>
              </div>
            </div>

            <div className="pt-3 flex justify-between items-baseline mb-4">
              <span className="text-sm font-bold text-stone-900">Genel Toplam</span>
              <span className="text-xl font-extrabold text-[#1C1917] font-sans">
                {grandTotal.toLocaleString('tr-TR')} TL
              </span>
            </div>

            {/* Kraft Envelope Story Promise */}
            <div className="mb-4 p-2.5 rounded-lg bg-[#FAF5EE] border border-[#EADBCA] text-[11px] text-stone-700 flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-[#9E4424] shrink-0" />
              <span>Satıcının el yazısı hatıra kartı kargo paketinde size ulaştırılacaktır.</span>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-3.5 px-4 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98"
            >
              <span>Kasaya İlerle & Sahip Çık</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Escrow Guarantee */}
            <div className="mt-3 text-center text-[10px] text-stone-500 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>EldeVar Havuz Hesap & Güvenli Teslimat</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
