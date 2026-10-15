import React, { useState } from 'react';
import { X, Mail, Phone, MapPin, Send, CheckCircle2, Clock, MessageSquare, Instagram } from 'lucide-react';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('siparis');
  const [message, setMessage] = useState('');
  const [isSent, setIsSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSent(true);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1C1917]/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-[#FAF8F5] w-full max-w-4xl rounded-3xl shadow-2xl border border-[#E8E2D8] overflow-hidden my-auto max-h-[92vh] flex flex-col relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-white border-b border-[#E8E2D8] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FAF3EB] text-[#9E4424] border border-[#EBD4BF]">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-base sm:text-lg text-[#1C1917]">
                İletişim & Destek Merkezi
              </h3>
              <p className="text-xs text-stone-500 font-sans">
                Sorularınız, iş ortaklığı ve sipariş desteği için bize ulaşın
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

        {/* Body Grid: Sol İletişim Bilgileri & Harita | Sağ İletişim Formu */}
        <div className="overflow-y-auto p-5 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Sol Kolon (5 Grid): Kurumsal Bilgiler & Harita */}
          <div className="lg:col-span-5 space-y-5">
            <div className="bg-white p-5 rounded-2xl border border-[#E8E2D8] shadow-xs space-y-4">
              <h4 className="font-serif font-bold text-sm text-[#1C1917] pb-2 border-b border-[#F0EBE1]">
                Kurumsal İletişim Bilgileri
              </h4>

              <div className="space-y-3.5 text-xs text-stone-700">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-stone-100 text-stone-700 shrink-0">
                    <MapPin className="w-4 h-4 text-[#9E4424]" />
                  </div>
                  <div>
                    <strong className="block text-stone-900 font-semibold mb-0.5">Merkez Ofis</strong>
                    <span>Eskişehir Teknik Üniversitesi Teknopark & Moda Cad. No: 42 Kadıköy / İstanbul</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-stone-100 text-stone-700 shrink-0">
                    <Mail className="w-4 h-4 text-[#9E4424]" />
                  </div>
                  <div>
                    <strong className="block text-stone-900 font-semibold mb-0.5">E-posta</strong>
                    <a href="mailto:destek@eldevarmi.com" className="text-[#9E4424] hover:underline">
                      destek@eldevarmi.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-stone-100 text-stone-700 shrink-0">
                    <Phone className="w-4 h-4 text-[#9E4424]" />
                  </div>
                  <div>
                    <strong className="block text-stone-900 font-semibold mb-0.5">Müşteri Destek Hattı</strong>
                    <span className="font-mono font-medium">0850 308 00 26</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-pink-50 text-pink-700 border border-pink-200 shrink-0">
                    <Instagram className="w-4 h-4" />
                  </div>
                  <div>
                    <strong className="block text-stone-900 font-semibold mb-0.5">Instagram Destek & Kurucu</strong>
                    <a
                      href="https://www.instagram.com/semih.akkoyunn/"
                      target="_blank"
                      rel="noreferrer"
                      className="text-pink-600 hover:text-pink-700 font-semibold hover:underline"
                    >
                      @semih.akkoyunn (Semih Akkoyun)
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-stone-100 text-stone-700 shrink-0">
                    <Clock className="w-4 h-4 text-[#9E4424]" />
                  </div>
                  <div>
                    <strong className="block text-stone-900 font-semibold mb-0.5">Çalışma Saatleri</strong>
                    <span>Hafta içi 09:00 – 18:00 (Hafta sonu nöbetçi destek)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* İnteraktif Harita (Kural 8: Form ve Harita Gereksinimi) */}
            <div className="bg-white p-3 rounded-2xl border border-[#E8E2D8] shadow-xs overflow-hidden">
              <span className="text-[11px] font-bold text-stone-700 block mb-2 px-1">
                📍 Konum & Ulaşım Haritası (Kadıköy / Eskişehir Ofis)
              </span>
              <div className="w-full h-44 rounded-xl overflow-hidden border border-[#EDE7DD] relative">
                <iframe
                  title="EldeVar Merkez Harita"
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3011.666617066914!2d29.0232!3d40.9885!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14cab8675c94285b%3A0x6b8bcde5543c7b8e!2zTW9kYSwgS2FkxLFrw7Z5L8Swc3RhbmJ1bA!5e0!3m2!1str!2str!4v1700000000000!5m2!1str!2str"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full grayscale-[25%] contrast-[1.05]"
                />
              </div>
            </div>
          </div>

          {/* Sağ Kolon (7 Grid): İletişim Formu */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-7 rounded-2xl border border-[#E8E2D8] shadow-xs">
            {isSent ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4 animate-in fade-in">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10" />
                </div>
                <h4 className="font-serif font-bold text-xl text-[#1C1917]">
                  Mesajınız Başarıyla İletildi!
                </h4>
                <p className="text-xs text-stone-600 max-w-md leading-relaxed">
                  Teşekkür ederiz. İlettiğiniz talep <strong>#EV-TALEP-{Math.floor(1000 + Math.random() * 9000)}</strong> takip koduyla destek ekibimize ulaştı. 
                  En geç 2 saat içinde <strong>{email || 'e-posta adresiniz'}</strong> üzerinden dönüş yapacağız.
                </p>
                <button
                  onClick={() => {
                    setIsSent(false);
                    setMessage('');
                  }}
                  className="mt-2 px-5 py-2 rounded-xl bg-stone-900 text-white text-xs font-bold hover:bg-stone-800 transition-all cursor-pointer"
                >
                  Yeni Mesaj Gönder
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h4 className="font-serif font-bold text-sm text-[#1C1917] pb-2 border-b border-[#F0EBE1]">
                  Bize Mesaj Gönderin
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                      Adınız Soyadınız *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="Örn: Semih Akkoyun"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424] focus:bg-white"
                    />
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                      E-posta Adresiniz *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="adiniz@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424] focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                    Konu Seçimi
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424] focus:bg-white text-stone-800"
                  >
                    <option value="siparis">Sipariş & Kargo Durumu Takibi</option>
                    <option value="satici">Dokan Satıcı Başvurusu & İlan Yardımı</option>
                    <option value="iade">İade & Cayma Talebi</option>
                    <option value="pasaport">Eşya Hafıza Pasaportu Hakkında</option>
                    <option value="oneri">Öneri, İş Birliği ve Genel Sorular</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                    Mesajınız *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Lütfen sorunuzu veya iletmek istediğiniz detayları buraya yazınız..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full text-xs p-2.5 bg-[#FAF8F5] border border-stone-300 rounded-xl focus:outline-none focus:border-[#9E4424] focus:bg-white"
                  />
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <span className="text-[10px] text-stone-400">
                    * Zorunlu alanlar. Kişisel verileriniz KVKK kapsamında korunmaktadır.
                  </span>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-6 py-2.5 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-xs flex items-center gap-2 shadow-xs transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span>Gönderiliyor...</span>
                    ) : (
                      <>
                        <span>Mesajı İlet</span>
                        <Send className="w-3.5 h-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
