import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Copy, Building2, ShieldCheck, Mail, ArrowRight, Truck, Info } from 'lucide-react';
import { CartItem, Coupon, Order } from '../types';
import { BANK_ACCOUNTS, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE } from '../data/mockData';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  appliedCoupon: Coupon | null;
  customerEmail: string;
  onOrderSuccess: (order: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  appliedCoupon,
  customerEmail,
  onOrderSuccess,
}) => {
  // Checkout Form State
  const [customerName, setCustomerName] = useState('Semih Akkoyun');
  const [email, setEmail] = useState(customerEmail);
  const [phone, setPhone] = useState('0532 555 44 33');
  const [city, setCity] = useState('Eskişehir');
  const [address, setAddress] = useState('Tepebaşı Mah. Üniversite Cad. No: 14 D: 3');
  const [selectedBankId, setSelectedBankId] = useState('ziraat');
  const [copiedIban, setCopiedIban] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (isOpen) {
      setCompletedOrder(null);
      setIsSubmitting(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  // Subtotal calculation
  const subtotal = cart.reduce((acc, item) => {
    const itemPrice = item.selectedVariation ? item.selectedVariation.price : item.product.price;
    return acc + itemPrice * item.quantity;
  }, 0);

  const isFreeShipping = subtotal >= FREE_SHIPPING_THRESHOLD;
  let discountAmount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minSpend) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = Math.round((subtotal * appliedCoupon.value) / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }
  const shippingFee = isFreeShipping ? 0 : STANDARD_SHIPPING_FEE;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee);

  const selectedBank = BANK_ACCOUNTS.find((b) => b.id === selectedBankId) || BANK_ACCOUNTS[0];

  const handleCopyIban = (iban: string) => {
    navigator.clipboard?.writeText(iban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate C2C WooCommerce BACS order generation
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `EV-${randomNum}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      date: new Date().toISOString(),
      items: [...cart],
      subtotal,
      discount: discountAmount,
      shipping: shippingFee,
      total: grandTotal,
      couponCode: appliedCoupon?.code,
      paymentMethod: 'bacs',
      bankDetails: {
        bankName: selectedBank.bankName,
        accountHolder: selectedBank.accountHolder,
        iban: selectedBank.iban,
        descriptionCode: `Sipariş #${orderNumber} ${customerName.split(' ')[0]}`,
      },
      customer: {
        name: customerName,
        email,
        phone,
        address,
        city,
      },
      status: 'pending_payment',
      vendorIds: Array.from(new Set(cart.map((item) => item.product.seller.id))),
    };

    setTimeout(() => {
      setIsSubmitting(false);
      setCompletedOrder(newOrder);
      onOrderSuccess(newOrder);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-stone-200 overflow-hidden my-auto max-h-[92vh] flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        {/* Top Header */}
        <div className="bg-stone-900 text-white px-5 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm sm:text-base">
              {completedOrder ? 'Siparişiniz Alındı (Ödeme Bekliyor)' : 'Havale / EFT ile Güvenli Satın Alım'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 text-xs sm:text-sm">
          {completedOrder ? (
            /* ORDER SUCCESS RECEIPT (WooCommerce BACS + WP Mail SMTP flow) */
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="text-center">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2.5">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-extrabold text-stone-900">
                  Tebrikler! Siparişiniz Başarıyla Oluşturuldu
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  Sipariş No: <strong className="text-stone-900 font-mono">{completedOrder.orderNumber}</strong> • 
                  Durum: <span className="text-amber-700 bg-amber-100 px-2 py-0.5 rounded-full font-bold">Ödeme Bekliyor</span>
                </p>
              </div>

              {/* Bank Transfer Instructions Box */}
              <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-stone-800 space-y-3">
                <div className="flex items-center justify-between pb-2 border-b border-amber-200/80">
                  <span className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                    <Building2 className="w-4 h-4 text-amber-600" />
                    Havale / EFT Yapılacak Banka Bilgisi
                  </span>
                  <span className="text-[11px] font-bold text-stone-900">
                    Ödenecek Tutar: <span className="text-sm font-extrabold text-amber-700">{completedOrder.total.toLocaleString('tr-TR')} TL</span>
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[11px] text-stone-500 block">Banka:</span>
                    <strong className="text-stone-900">{completedOrder.bankDetails.bankName}</strong>
                  </div>
                  <div>
                    <span className="text-[11px] text-stone-500 block">Alıcı Ünvanı:</span>
                    <strong className="text-stone-900">{completedOrder.bankDetails.accountHolder}</strong>
                  </div>
                </div>

                <div className="p-2.5 bg-white rounded-lg border border-amber-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-500 block">IBAN:</span>
                    <span className="font-mono font-bold text-stone-950 text-xs sm:text-sm">
                      {completedOrder.bankDetails.iban}
                    </span>
                  </div>
                  <button
                    onClick={() => handleCopyIban(completedOrder.bankDetails.iban)}
                    className="p-1.5 px-2.5 rounded bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-medium flex items-center gap-1 transition-all"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>{copiedIban ? 'Kopyalandı!' : 'Kopyala'}</span>
                  </button>
                </div>

                {/* Transfer Description Warning */}
                <div className="p-2 rounded bg-amber-100/70 border border-amber-300 text-[11px] text-amber-950 flex items-start gap-1.5">
                  <Info className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                  <div>
                    <strong>ÖNEMLİ (Dekont Açıklaması):</strong> Lütfen havale açıklamasına{' '}
                    <code className="bg-white px-1.5 py-0.5 rounded font-mono font-bold text-amber-900">
                      {completedOrder.bankDetails.descriptionCode}
                    </code>{' '}
                    yazınız. Sistemimiz ödemeyi otomatik eşleştirecektir.
                  </div>
                </div>
              </div>

              {/* WP Mail SMTP Delivery Notification Box */}
              <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 text-xs flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-blue-900 block">
                    WP Mail SMTP E-posta Bildirimi Gönderildi
                  </span>
                  <p className="text-[11px] text-blue-800 leading-relaxed">
                    Sipariş onay ve banka IBAN bilgileri <strong>{completedOrder.customer.email}</strong> adresinize gönderildi. 
                    Ayrıca Dokan üzerinden ilgili satıcı(lar)a yeni sipariş bildirimi iletildi.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 bg-stone-900 text-white rounded-xl font-bold text-xs hover:bg-stone-800 transition-all shadow-sm"
                >
                  Tamam (Siparişlerime Git)
                </button>
              </div>
            </div>
          ) : (
            /* CHECKOUT FORM */
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              {/* Customer Information (Müşteri Girişi Semih Akkoyun) */}
              <div>
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <span>1. Müşteri & Teslimat Bilgileri</span>
                  <span className="text-[10px] text-blue-600 font-normal">Aktif Müşteri: {customerEmail}</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-stone-600 block mb-1">Ad Soyad</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-stone-600 block mb-1">E-posta (Sipariş Bildirimi İçin)</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-500 bg-stone-50"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-stone-600 block mb-1">Telefon Numarası</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-stone-600 block mb-1">Şehir</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-medium text-stone-600 block mb-1">Teslimat Adresi</label>
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>

              {/* Payment Method: Havale/EFT */}
              <div className="pt-3 border-t border-stone-200">
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-2.5">
                  2. Ödeme Yöntemi: Banka Havalesi / EFT (WooCommerce BACS)
                </h4>

                <div className="space-y-2">
                  {BANK_ACCOUNTS.map((bank) => {
                    const isSelected = selectedBankId === bank.id;
                    return (
                      <label
                        key={bank.id}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/50 shadow-xs'
                            : 'border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            name="bank_choice"
                            checked={isSelected}
                            onChange={() => setSelectedBankId(bank.id)}
                            className="text-amber-600 focus:ring-amber-500"
                          />
                          <div>
                            <div className="font-bold text-stone-900 text-xs flex items-center gap-1.5">
                              <span>{bank.logo}</span>
                              <span>{bank.bankName}</span>
                            </div>
                            <span className="text-[11px] text-stone-500 font-mono">{bank.iban}</span>
                          </div>
                        </div>
                        <span className="text-[11px] text-stone-400 font-medium hidden sm:inline">{bank.branch}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {/* Order Summary & Submit Button */}
              <div className="pt-3 border-t border-stone-200 bg-stone-50 p-3.5 rounded-xl space-y-2">
                <div className="flex justify-between text-xs text-stone-600">
                  <span>Ara Toplam:</span>
                  <span className="font-semibold text-stone-900">{subtotal.toLocaleString('tr-TR')} TL</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-emerald-600">
                    <span>Kupon İndirimi:</span>
                    <span>-{discountAmount.toLocaleString('tr-TR')} TL</span>
                  </div>
                )}
                <div className="flex justify-between text-xs text-stone-600">
                  <span>Kargo:</span>
                  <span>{isFreeShipping ? 'ÜCRETSİZ' : `${shippingFee.toFixed(2)} TL`}</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline font-bold">
                  <span className="text-stone-900">Toplam Tutar:</span>
                  <span className="text-lg font-extrabold text-stone-950 font-sans">
                    {grandTotal.toLocaleString('tr-TR')} TL
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 disabled:opacity-50 mt-3"
                >
                  {isSubmitting ? (
                    <span>Sipariş Oluşturuluyor...</span>
                  ) : (
                    <>
                      <span>Siparişi Onayla & IBAN Bilgilerini Gör</span>
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
