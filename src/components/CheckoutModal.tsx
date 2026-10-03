import React, { useState, useEffect } from 'react';
import { X, CheckCircle, Copy, Building2, ShieldCheck, Mail, ArrowRight, Truck, Info, CreditCard, Banknote } from 'lucide-react';
import { CartItem, Coupon, Order, PaymentMethodType } from '../types';
import { BANK_ACCOUNTS, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE, COD_FEE } from '../data/mockData';

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
  
  // Payment Method Selection (bacs | cod | credit_card)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('bacs');
  const [selectedBankId, setSelectedBankId] = useState('ziraat');
  
  // Mock Credit Card Inputs
  const [cardNumber, setCardNumber] = useState('5428 0000 1234 5678');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('432');
  
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
  const paymentFee = paymentMethod === 'cod' ? COD_FEE : 0;
  const grandTotal = Math.max(0, subtotal - discountAmount + shippingFee + paymentFee);

  const selectedBank = BANK_ACCOUNTS.find((b) => b.id === selectedBankId) || BANK_ACCOUNTS[0];

  const handleCopyIban = (iban: string) => {
    navigator.clipboard?.writeText(iban);
    setCopiedIban(true);
    setTimeout(() => setCopiedIban(false), 2000);
  };

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const orderNumber = `EV-${randomNum}`;

    let methodTitle = 'Banka Havalesi / EFT (WooCommerce BACS)';
    let orderStatus: Order['status'] = 'pending_payment';

    if (paymentMethod === 'cod') {
      methodTitle = 'Kapıda Nakit / Kart ile Ödeme (WooCommerce COD)';
      orderStatus = 'processing';
    } else if (paymentMethod === 'credit_card') {
      methodTitle = 'Kredi Kartı / Banka Kartı (iyzico / PayTR Test Modu)';
      orderStatus = 'processing';
    }

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
      paymentMethod,
      paymentMethodTitle: methodTitle,
      trackingNumber: `KRG-${Math.floor(1000000 + Math.random() * 9000000)}`,
      bankDetails: paymentMethod === 'bacs' ? {
        bankName: selectedBank.bankName,
        accountHolder: selectedBank.accountHolder,
        iban: selectedBank.iban,
        descriptionCode: `Sipariş #${orderNumber} ${customerName.split(' ')[0]}`,
      } : undefined,
      customer: {
        name: customerName,
        email,
        phone,
        address,
        city,
      },
      status: orderStatus,
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
        <div className="bg-[#1C1917] text-white px-5 py-3.5 flex items-center justify-between border-b border-[#2C2622]">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-sm sm:text-base font-serif">
              {completedOrder ? 'Siparişiniz Başarıyla Alındı' : 'Güvenli Ödeme & Sipariş Onayı'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-stone-800 text-stone-400 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-5 sm:p-6 text-xs sm:text-sm">
          {completedOrder ? (
            /* ORDER SUCCESS RECEIPT */
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="text-center">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-2.5">
                  <CheckCircle className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-extrabold text-stone-900 font-serif">
                  Tebrikler! Siparişiniz Başarıyla Oluşturuldu
                </h4>
                <p className="text-xs text-stone-500 mt-1">
                  Sipariş No: <strong className="text-stone-900 font-mono">{completedOrder.orderNumber}</strong> • 
                  Durum:{' '}
                  {completedOrder.paymentMethod === 'bacs' ? (
                    <span className="text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full font-bold">Ödeme Bekliyor</span>
                  ) : (
                    <span className="text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full font-bold">Hazırlanıyor (Onaylandı)</span>
                  )}
                </p>
                <p className="text-[11px] text-stone-400 mt-0.5">
                  Ödeme Yöntemi: <strong className="text-stone-700">{completedOrder.paymentMethodTitle}</strong>
                </p>
              </div>

              {/* BACS: Bank Transfer Instructions Box */}
              {completedOrder.paymentMethod === 'bacs' && completedOrder.bankDetails && (
                <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200 text-stone-800 space-y-3">
                  <div className="flex items-center justify-between pb-2 border-b border-amber-200/80">
                    <span className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                      <Building2 className="w-4 h-4 text-amber-600" />
                      Havale / EFT Yapılacak Banka Bilgisi
                    </span>
                    <span className="text-[11px] font-bold text-stone-900">
                      Ödenecek Tutar: <span className="text-sm font-extrabold text-amber-800">{completedOrder.total.toLocaleString('tr-TR')} TL</span>
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
                      onClick={() => handleCopyIban(completedOrder.bankDetails!.iban)}
                      className="p-1.5 px-2.5 rounded bg-stone-900 hover:bg-stone-800 text-white text-[11px] font-medium flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <Copy className="w-3.5 h-3.5" />
                      <span>{copiedIban ? 'Kopyalandı!' : 'Kopyala'}</span>
                    </button>
                  </div>

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
              )}

              {/* COD: Kapıda Ödeme Bilgilendirmesi */}
              {completedOrder.paymentMethod === 'cod' && (
                <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-emerald-900 text-xs sm:text-sm">
                    <Truck className="w-5 h-5 text-emerald-600" />
                    <span>Kapıda Ödeme Bilgilendirmesi</span>
                  </div>
                  <p className="text-xs text-emerald-800 leading-relaxed">
                    Siparişiniz satıcılarımıza iletildi ve paketleme sürecine alındı. Kargo kuryesi adresinize ulaştığında 
                    <strong> {completedOrder.total.toLocaleString('tr-TR')} TL</strong> tutarını <strong>Nakit</strong> veya <strong>Kredi Kartı</strong> ile POS cihazından güvenle ödeyebilirsiniz.
                  </p>
                  <div className="text-[11px] bg-white p-2 rounded-lg border border-emerald-200 text-emerald-900">
                    📦 Takip No: <strong className="font-mono">{completedOrder.trackingNumber}</strong> (Kargoya verildiğinde SMS gönderilecektir)
                  </div>
                </div>
              )}

              {/* CREDIT CARD: 3D Secure Test Bildirimi */}
              {completedOrder.paymentMethod === 'credit_card' && (
                <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-blue-950 space-y-2">
                  <div className="flex items-center gap-2 font-bold text-blue-900 text-xs sm:text-sm">
                    <CreditCard className="w-5 h-5 text-blue-600" />
                    <span>3D Secure ile Test Ödemesi Tamamlandı</span>
                  </div>
                  <p className="text-xs text-blue-800 leading-relaxed">
                    <strong>{completedOrder.total.toLocaleString('tr-TR')} TL</strong> tutarındaki test ödemeniz simüle edilmiş sanal POS ağ geçidi (iyzico/PayTR Test Modu) üzerinden onaylandı. Havuz hesap güvencesi aktifleşti.
                  </p>
                </div>
              )}

              {/* WP Mail SMTP Delivery Notification Box */}
              <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-stone-800 text-xs flex items-start gap-2.5">
                <Mail className="w-4 h-4 text-[#9E4424] shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold text-stone-900 block">
                    WordPress E-posta Bildirimi Gönderildi
                  </span>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    Sipariş özeti ve fatura bilgileri <strong>{completedOrder.customer.email}</strong> adresinize iletildi. 
                    Dokan pazaryeri sistemi üzerinden satıcı(lar)a yeni sipariş bildirimi düştü.
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-2.5 bg-[#9E4424] hover:bg-[#85361A] text-white rounded-xl font-bold text-xs transition-all shadow-sm cursor-pointer"
                >
                  Tamam (Siparişlerime Git)
                </button>
              </div>
            </div>
          ) : (
            /* CHECKOUT FORM */
            <form onSubmit={handleSubmitOrder} className="space-y-5">
              {/* 1. Müşteri Bilgileri */}
              <div>
                <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider mb-2.5 flex items-center justify-between">
                  <span>1. Müşteri & Teslimat Bilgileri</span>
                  <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-normal border border-emerald-200">
                    Aktif Hesap: {customerEmail}
                  </span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-medium text-stone-600 block mb-1">Ad Soyad</label>
                    <input
                      type="text"
                      required
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#9E4424]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-stone-600 block mb-1">E-posta (Sipariş Bildirimi İçin)</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#9E4424] bg-stone-50"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-stone-600 block mb-1">Telefon Numarası</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#9E4424]"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-stone-600 block mb-1">Şehir</label>
                    <input
                      type="text"
                      required
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#9E4424]"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-[11px] font-medium text-stone-600 block mb-1">Teslimat Adresi</label>
                    <textarea
                      required
                      rows={2}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-lg focus:outline-none focus:border-[#9E4424]"
                    />
                  </div>
                </div>
              </div>

              {/* 2. Ödeme Yöntemi Seçimi (Kural 4: En az 2 ödeme yöntemi) */}
              <div className="pt-3 border-t border-stone-200">
                <div className="flex items-center justify-between mb-2.5">
                  <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                    2. Ödeme Yöntemi Seçin (WooCommerce Gateway)
                  </h4>
                  <span className="text-[10px] text-stone-500 font-semibold bg-stone-100 px-2 py-0.5 rounded">
                    3 Farklı Yöntem Mevcut
                  </span>
                </div>

                {/* Method Radio Options */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 mb-3">
                  {/* BACS */}
                  <div
                    onClick={() => setPaymentMethod('bacs')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'bacs'
                        ? 'border-[#9E4424] bg-[#FAF5EE] text-[#1C1917] ring-1 ring-[#9E4424]'
                        : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Building2 className={`w-4 h-4 ${paymentMethod === 'bacs' ? 'text-[#9E4424]' : 'text-stone-500'}`} />
                      <span className="font-bold text-xs">Havale / EFT</span>
                    </div>
                    <span className="text-[10px] text-stone-500">Banka IBAN transferi</span>
                  </div>

                  {/* COD */}
                  <div
                    onClick={() => setPaymentMethod('cod')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'cod'
                        ? 'border-emerald-600 bg-emerald-50/60 text-[#1C1917] ring-1 ring-emerald-600'
                        : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <Truck className={`w-4 h-4 ${paymentMethod === 'cod' ? 'text-emerald-700' : 'text-stone-500'}`} />
                      <span className="font-bold text-xs">Kapıda Ödeme</span>
                    </div>
                    <span className="text-[10px] text-stone-500">Nakit veya Kartla Kapıda (+19.90 TL)</span>
                  </div>

                  {/* CREDIT CARD */}
                  <div
                    onClick={() => setPaymentMethod('credit_card')}
                    className={`p-3 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                      paymentMethod === 'credit_card'
                        ? 'border-blue-600 bg-blue-50/60 text-[#1C1917] ring-1 ring-blue-600'
                        : 'border-stone-200 bg-white hover:border-stone-300 text-stone-700'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CreditCard className={`w-4 h-4 ${paymentMethod === 'credit_card' ? 'text-blue-600' : 'text-stone-500'}`} />
                      <span className="font-bold text-xs">Kredi Kartı</span>
                    </div>
                    <span className="text-[10px] text-stone-500">iyzico / PayTR Test Modu</span>
                  </div>
                </div>

                {/* Sub-UI depending on method */}
                {paymentMethod === 'bacs' && (
                  <div className="space-y-2 p-3 bg-stone-50 rounded-xl border border-stone-200">
                    <span className="text-[11px] font-semibold text-stone-600 block mb-1">
                      Havale yapacağınız banka hesabını seçin:
                    </span>
                    {BANK_ACCOUNTS.map((bank) => {
                      const isSelected = selectedBankId === bank.id;
                      return (
                        <label
                          key={bank.id}
                          className={`p-2.5 rounded-lg border flex items-center justify-between cursor-pointer transition-all bg-white ${
                            isSelected
                              ? 'border-[#9E4424] ring-1 ring-[#9E4424] shadow-xs'
                              : 'border-stone-200 hover:border-stone-300'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="radio"
                              name="bank_choice"
                              checked={isSelected}
                              onChange={() => setSelectedBankId(bank.id)}
                              className="text-[#9E4424] focus:ring-[#9E4424]"
                            />
                            <div>
                              <div className="font-bold text-stone-900 text-xs flex items-center gap-1">
                                <span>{bank.logo}</span>
                                <span>{bank.bankName}</span>
                              </div>
                              <span className="text-[10px] text-stone-500 font-mono">{bank.iban}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-stone-400 font-medium hidden sm:inline">{bank.branch}</span>
                        </label>
                      );
                    })}
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 space-y-1.5">
                    <div className="flex items-center gap-1.5 font-bold">
                      <Truck className="w-4 h-4 text-emerald-700" />
                      <span>Kapıda Teslimatta Ödeme Seçildi</span>
                    </div>
                    <p className="text-[11px] text-emerald-800 leading-relaxed">
                      Siparişiniz kargoya verilir ve kurye kapınıza geldiğinde ödemeyi Nakit ya da temassız Kredi Kartı ile gerçekleştirebilirsiniz.
                      Hizmet bedeli <strong>19.90 TL</strong> toplam tutara yansıtılmıştır.
                    </p>
                  </div>
                )}

                {paymentMethod === 'credit_card' && (
                  <div className="p-3.5 bg-blue-50/70 rounded-xl border border-blue-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-blue-950 flex items-center gap-1.5">
                        <CreditCard className="w-4 h-4 text-blue-600" />
                        <span>iyzico / PayTR 3D Secure Test Kartı</span>
                      </span>
                      <span className="text-[10px] font-bold bg-blue-200 text-blue-900 px-2 py-0.5 rounded">
                        Simülasyon Modu
                      </span>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <label className="text-[10px] font-medium text-blue-900 block mb-0.5">Kart Numarası</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={(e) => setCardNumber(e.target.value)}
                          className="w-full text-xs font-mono p-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-[10px] font-medium text-blue-900 block mb-0.5">Son Kullanma (AA/YY)</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={(e) => setCardExpiry(e.target.value)}
                            className="w-full text-xs font-mono p-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] font-medium text-blue-900 block mb-0.5">CVV Güvenlik Kodu</label>
                          <input
                            type="text"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value)}
                            className="w-full text-xs font-mono p-2 bg-white border border-blue-200 rounded-lg focus:outline-none focus:border-blue-500"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
                  <span>Kargo Ücreti:</span>
                  <span>{isFreeShipping ? 'ÜCRETSİZ' : `${shippingFee.toFixed(2)} TL`}</span>
                </div>
                {paymentFee > 0 && (
                  <div className="flex justify-between text-xs text-stone-600">
                    <span>Kapıda Ödeme Hizmet Bedeli:</span>
                    <span>+{paymentFee.toFixed(2)} TL</span>
                  </div>
                )}
                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline font-bold">
                  <span className="text-stone-900">Toplam Tutar:</span>
                  <span className="text-lg font-extrabold text-[#1C1917] font-sans">
                    {grandTotal.toLocaleString('tr-TR')} TL
                  </span>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 disabled:opacity-50 mt-3 cursor-pointer"
                >
                  {isSubmitting ? (
                    <span>Sipariş İşleniyor...</span>
                  ) : (
                    <>
                      <span>
                        {paymentMethod === 'bacs'
                          ? 'Siparişi Onayla & IBAN Bilgisini Gör'
                          : paymentMethod === 'cod'
                          ? 'Kapıda Ödeme ile Siparişi Tamamla'
                          : 'Kredi Kartı ile Güvenli Öde'}
                      </span>
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
