import React, { useState } from 'react';
import { X, HelpCircle, ChevronDown, ChevronUp, BookOpen, ShieldCheck, Truck, CreditCard, Store } from 'lucide-react';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenContact?: () => void;
}

export const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose, onOpenContact }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  if (!isOpen) return null;

  const faqs = [
    {
      q: 'EldeVarMı nedir ve diğer ikinci el platformlarından farkı nedir?',
      a: 'EldeVarMı, yalnızca eşyaların alınıp satıldığı bir ilan sitesi değil; her nesnenin geçmişini, hatırasını ve seyahatini yaşatan "Eşya Hafıza Pasaportu" konseptine sahip sürdürülebilir bir C2C ikinci el pazaryeridir. Her siparişte satıcı el yazısıyla bir hatıra kartı hazırlar.',
      category: 'Konsept',
    },
    {
      q: 'Ödemem nasıl korunuyor? (EldeVarMı Güvenli Havuz Hesabı)',
      a: 'Sipariş verdiğinizde ödemeniz doğrudan satıcıya aktarılmaz; EldeVarMı güvence havuzunda tutulur. Ürün kargolanıp elinize ulaştıktan sonra ilandaki kondisyonu kontrol edip onay verdiğinizde bedel satıcıya aktarılır.',
      category: 'Güvenlik',
    },
    {
      q: 'Hangi ödeme yöntemlerini kullanabilirim?',
      a: 'Sitemizde 3 farklı WooCommerce ödeme yöntemi sunulmaktadır: 1) Banka Havalesi / EFT (Ziraat, Garanti, Akbank kurumsal hesaplarımıza), 2) Kapıda Ödeme (kuryeye teslimatta Nakit veya Kart ile), 3) Kredi Kartı / Banka Kartı (iyzico / PayTR 3D Secure güvenceli).',
      category: 'Ödeme',
    },
    {
      q: 'Kargo ücreti ne kadar ve ne zaman ücretsiz olur?',
      a: 'Sepet tutarınız 750 TL ve üzerinde olduğunda kargo tamamen ÜCRETSİZDİR. 750 TL altındaki siparişlerde ise Türkiye geneli standart kargo ücreti 49.90 TL\'dir. Kargonuz Yurtiçi veya Aras Kargo ile takip kodlu olarak iletilir.',
      category: 'Kargo',
    },
    {
      q: 'İkinci el üründe iade veya değişim yapabilir miyim?',
      a: 'İkinci el ürünlerin tekil doğası gereği keyfi iade kabul edilmemektedir. Ancak teslim aldığınız üründe ilanda belirtilmeyen gizli kusur, yırtık, sahtelik veya çalışmama durumu varsa, teslimattan itibaren 48 saat içinde destek ekibimizle iletişime geçerek kargo iade koduyla tam ücret iadesi alabilirsiniz.',
      category: 'İade',
    },
    {
      q: 'Dokan çok satıcılı altyapısı ve satıcı komisyonu nedir?',
      a: 'EldeVarMı, WordPress Dokan Lite pazaryeri altyapısıyla çalışır. Her üye dilerse kendi satıcı profilini ve mağazasını açabilir. Güvenli havuz işletimi, sunucu altyapısı ve karbon azaltım fonumuz için tamamlanan satışlardan %10 platform komisyonu kesilmektedir.',
      category: 'Satıcı & Dokan',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1917]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] w-full max-w-2xl rounded-3xl shadow-2xl border border-[#E8E2D8] overflow-hidden my-auto max-h-[90vh] flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-white border-b border-[#E8E2D8] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FAF3EB] text-[#9E4424] border border-[#EBD4BF]">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C1917]">
                Sıkça Sorulan Sorular (S.S.S.)
              </h3>
              <p className="text-xs text-stone-500 font-sans">
                EldeVarMı alışveriş ve satıcılık süreçleri hakkında merak edilenler
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            aria-label="Kapat"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* FAQ Accordion List */}
        <div className="overflow-y-auto p-5 sm:p-6 space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl border border-[#E8E2D8] overflow-hidden transition-all shadow-2xs"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full p-4 text-left flex items-center justify-between gap-3 hover:bg-[#FAF8F5] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-600 border border-stone-200">
                      {faq.category}
                    </span>
                    <span className="font-serif font-bold text-xs sm:text-sm text-[#1C1917]">
                      {faq.q}
                    </span>
                  </div>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#9E4424] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                  )}
                </button>

                {isOpen && (
                  <div className="px-4 pb-4 pt-1 text-xs text-stone-600 leading-relaxed font-sans border-t border-[#F0EBE1] bg-[#FAF8F5]/60 animate-in fade-in duration-150">
                    <p>{faq.a}</p>
                  </div>
                )}
              </div>
            );
          })}

          {/* Bottom Help Banner */}
          <div className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-[#FAF3EB] to-[#F5EADB] border border-[#EADAC5] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div>
              <strong className="text-stone-900 block font-serif">Başka bir sorunuz mu var?</strong>
              <span className="text-stone-600 text-[11px]">Destek ekibimiz haftanın 7 günü yanıtlamaya hazır.</span>
            </div>
            {onOpenContact && (
              <button
                onClick={() => {
                  onClose();
                  onOpenContact();
                }}
                className="px-4 py-2 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-xs transition-all shadow-2xs shrink-0 cursor-pointer"
              >
                Bize Ulaşın
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
