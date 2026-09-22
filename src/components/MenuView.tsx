import React, { useState } from 'react';
import { User, Store, Package, Heart, Tag, ShieldCheck, FileText, Feather, Check, ChevronRight, BookOpen } from 'lucide-react';
import { Order, UserPreferences, Product } from '../types';
import { UserStoreView } from './UserStoreView';

interface MenuViewProps {
  customerEmail: string;
  sellerEmail: string;
  orders: Order[];
  preferences: UserPreferences;
  onUpdatePreferences: (newPrefs: UserPreferences) => void;
  onOpenSellerModal: () => void;
  onNavigateHome: () => void;
  userProducts?: Product[];
  onDeleteProduct?: (productId: string) => void;
}

export const MenuView: React.FC<MenuViewProps> = ({
  customerEmail,
  sellerEmail,
  orders,
  preferences,
  onUpdatePreferences,
  onOpenSellerModal,
  onNavigateHome,
  userProducts = [],
  onDeleteProduct,
}) => {
  const [activeLegalModal, setActiveLegalModal] = useState<string | null>(null);
  const [isStoreOpen, setIsStoreOpen] = useState(false);

  // Clothing & Shoe sizes
  const clothingSizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const shoeSizes = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];
  const availableBrands = ["Levi's", "Burberry", "Vakko", "Dr. Martens", "Sony", "Yashica", "Dual Germany", "Apple", "Schott NYC", "Mid-Century"];

  const toggleBrand = (b: string) => {
    const current = preferences.favoriteBrands || [];
    const updated = current.includes(b) ? current.filter((x) => x !== b) : [...current, b];
    onUpdatePreferences({ ...preferences, favoriteBrands: updated });
  };

  // If user opened their store/shop page, render UserStoreView
  if (isStoreOpen) {
    return (
      <UserStoreView
        onBack={() => setIsStoreOpen(false)}
        onOpenSellerModal={onOpenSellerModal}
        userProducts={userProducts}
        onDeleteProduct={onDeleteProduct}
      />
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 pb-28 space-y-6">
      {/* 1. KULLANICI PROFİLİ */}
      <section className="bg-white rounded-2xl p-5 shadow-xs border border-[#E8E2D8]">
        <div className="flex items-center justify-between pb-4 border-b border-[#F0EBE1]">
          <div className="flex items-center gap-3.5">
            <div className="w-13 h-13 rounded-full bg-[#FAF3E8] text-[#9E4424] font-serif font-bold flex items-center justify-center text-xl border-2 border-[#EBD7BF] shadow-xs">
              S
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif font-bold text-base text-[#1C1917]">
                  Semih Akkoyun
                </h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Onaylı Üye
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5 font-sans">
                {customerEmail}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[11px] text-stone-500 block">Kayıtlı Şehir</span>
            <span className="text-xs font-semibold text-stone-800">Eskişehir / Kadıköy</span>
          </div>
        </div>

        {/* Action Button: Mağazama Git (Kullanıcının İstediği Değişiklik) */}
        <div className="pt-4 flex flex-col sm:flex-row gap-3">
          <button
            onClick={() => setIsStoreOpen(true)}
            className="flex-1 py-3 px-4 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs active:scale-98 cursor-pointer"
          >
            <Store className="w-4 h-4 text-amber-200" />
            <span>Mağazama Git</span>
          </button>
        </div>
      </section>

      {/* 2. ELDEVAR HİKÂYESİ & MANİFESTO BANNER */}
      <section
        onClick={() => setActiveLegalModal('about')}
        className="bg-gradient-to-br from-[#FAF5EE] to-[#F3EAD9] rounded-2xl p-5 border border-[#E5DAC8] shadow-xs cursor-pointer hover:border-[#9E4424] transition-all group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-white text-[#9E4424] border border-[#E2D5C2] shadow-2xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-serif font-bold text-[#1C1917] text-sm group-hover:text-[#9E4424] transition-colors">
                EldeVar'ın Hikâyesi & Yaşam İzi Felsefesi
              </h4>
              <p className="text-xs text-stone-600 mt-0.5">
                Neden buradayız? Eşyaların hafızasını nasıl koruyor ve yeni sahipleriyle buluşturuyoruz?
              </p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-stone-400 group-hover:translate-x-1 transition-transform" />
        </div>
      </section>

      {/* 3. GEÇMİŞ SİPARİŞLERİM */}
      <section className="bg-white rounded-2xl p-5 border border-[#E8E2D8] shadow-xs">
        <h3 className="font-serif font-bold text-[#1C1917] text-sm flex items-center gap-2 mb-3">
          <Package className="w-4 h-4 text-[#9E4424]" />
          <span>Geçmiş Siparişlerim</span>
          <span className="text-[10px] bg-[#FAF8F5] text-stone-600 font-bold px-2 py-0.5 rounded-full ml-auto border border-stone-200">
            {orders.length} Sipariş
          </span>
        </h3>

        {orders.length === 0 ? (
          <div className="p-4 rounded-xl bg-[#FAF8F5] text-center text-xs text-stone-500 border border-[#EFE9DF]">
            Henüz verilmiş bir siparişiniz bulunmuyor. Pazaryerindeki eşyalara göz atabilirsiniz.
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((ord) => (
              <div key={ord.id} className="p-3.5 rounded-xl border border-[#E8E2D8] bg-[#FAF8F5] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-mono font-bold text-stone-900">{ord.orderNumber}</span>
                    <span className="text-stone-400 text-[11px] ml-2">
                      {new Date(ord.date).toLocaleDateString('tr-TR')}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF3EB] text-[#8C3F23] border border-[#EBD6C3]">
                    Ödeme Bekliyor (Havale/EFT)
                  </span>
                </div>

                <div className="text-xs text-stone-600">
                  <div className="font-medium text-stone-800">
                    {ord.items.map((i) => `${i.product.title} (x${i.quantity})`).join(', ')}
                  </div>
                  <div className="text-[11px] text-stone-500 mt-1">
                    Banka: <strong className="text-stone-700">{ord.bankDetails.bankName}</strong> • Tutar:{' '}
                    <strong className="text-stone-900 font-sans">{ord.total.toLocaleString('tr-TR')} TL</strong>
                  </div>
                </div>

                <div className="text-[11px] text-stone-600 bg-white p-2.5 rounded-lg border border-[#E8E2D8] flex items-center justify-between">
                  <span className="text-stone-500">Havale Açıklama Kodu:</span>
                  <code className="font-mono font-bold text-[#9E4424]">{ord.bankDetails.descriptionCode}</code>
                </div>

                <div className="text-[10px] text-stone-500 flex items-center gap-1.5 pt-1">
                  <Feather className="w-3 h-3 text-[#9E4424]" />
                  <span>Satıcının el yazısı hatıra kartı kargo kutusuna eklenecektir.</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. MARKA VE BEDENİM (Kişiselleştirme Alanı) */}
      <section className="bg-white rounded-2xl p-5 border border-[#E8E2D8] shadow-xs space-y-4">
        <div>
          <h3 className="font-serif font-bold text-[#1C1917] text-sm flex items-center gap-2">
            <Tag className="w-4 h-4 text-[#9E4424]" />
            <span>Marka ve Beden Tercihlerim</span>
          </h3>
          <p className="text-xs text-stone-500 mt-0.5 font-sans">
            İkinci el akışınızda size uygun beden ve markalardaki hikâyeleri önceliklendirir.
          </p>
        </div>

        {/* Giyim Bedenim */}
        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1.5">Giyim Bedenim</label>
          <div className="flex flex-wrap gap-1.5">
            {clothingSizes.map((sz) => {
              const isSelected = preferences.clothingSize === sz;
              return (
                <button
                  key={sz}
                  onClick={() => onUpdatePreferences({ ...preferences, clothingSize: sz })}
                  className={`w-10 h-9 rounded-lg text-xs font-bold border transition-all ${
                    isSelected
                      ? 'bg-[#9E4424] text-white border-[#9E4424] shadow-xs'
                      : 'bg-[#FAF8F5] text-stone-700 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {sz}
                </button>
              );
            })}
          </div>
        </div>

        {/* Ayakkabı Numaram */}
        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1.5">Ayakkabı Numaram</label>
          <div className="flex flex-wrap gap-1.5">
            {shoeSizes.map((num) => {
              const isSelected = preferences.shoeSize === num;
              return (
                <button
                  key={num}
                  onClick={() => onUpdatePreferences({ ...preferences, shoeSize: num })}
                  className={`w-10 h-9 rounded-lg text-xs font-bold border transition-all ${
                    isSelected
                      ? 'bg-[#9E4424] text-white border-[#9E4424] shadow-xs'
                      : 'bg-[#FAF8F5] text-stone-700 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {num}
                </button>
              );
            })}
          </div>
        </div>

        {/* Favori Markalar */}
        <div>
          <label className="text-xs font-semibold text-stone-700 block mb-1.5">Takip Ettiğim Markalar</label>
          <div className="flex flex-wrap gap-1.5">
            {availableBrands.map((b) => {
              const isSelected = preferences.favoriteBrands?.includes(b);
              return (
                <button
                  key={b}
                  onClick={() => toggleBrand(b)}
                  className={`px-3 py-1 rounded-full text-xs font-medium border transition-all flex items-center gap-1 ${
                    isSelected
                      ? 'bg-[#9E4424] text-white border-[#9E4424] font-semibold'
                      : 'bg-[#FAF8F5] text-stone-600 border-stone-200 hover:border-stone-300'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 text-white" />}
                  <span>{b}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* 5. GİZLİLİK POLİTİKASI & YASAL SAYFALAR */}
      <section className="bg-white rounded-2xl p-5 border border-[#E8E2D8] shadow-xs space-y-2">
        <h3 className="font-serif font-bold text-[#1C1917] text-sm flex items-center gap-2 mb-3">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Yasal ve Kurumsal Güvence</span>
        </h3>

        {[
          { id: 'about', title: 'Hakkımızda: EldeVar Felsefesi & Hikâyesi' },
          { id: 'privacy', title: 'Gizlilik Politikası & KVKK Aydınlatma Metni' },
          { id: 'sales', title: 'Mesafeli Satış Sözleşmesi (C2C Güvencesi)' },
          { id: 'returns', title: 'İkinci El İade & Cayma Hakkı Şartları' },
        ].map((doc) => (
          <button
            key={doc.id}
            onClick={() => setActiveLegalModal(doc.id)}
            className="w-full p-3 rounded-xl border border-[#F0EBE1] hover:border-[#9E4424] bg-[#FAF8F5] hover:bg-white flex items-center justify-between text-xs text-stone-800 font-medium transition-all"
          >
            <span className="flex items-center gap-2">
              <FileText className="w-4 h-4 text-stone-400" />
              <span>{doc.title}</span>
            </span>
            <ChevronRight className="w-4 h-4 text-stone-400" />
          </button>
        ))}
      </section>

      {/* Legal Content Modal Popup */}
      {activeLegalModal && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] w-full max-w-xl rounded-2xl shadow-2xl border border-[#E4D8C4] overflow-hidden max-h-[85vh] flex flex-col animate-in fade-in">
            <div className="bg-white border-b border-[#E8E2D8] px-5 py-3.5 flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-[#1C1917]">
                {activeLegalModal === 'about' ? 'EldeVar Hikâyesi' : 'Yasal Bilgilendirme'}
              </span>
              <button
                onClick={() => setActiveLegalModal(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-xs text-stone-700 space-y-3 leading-relaxed">
              {activeLegalModal === 'about' && (
                <>
                  <h4 className="font-serif font-bold text-base text-[#1C1917]">
                    "Eski hikâyeler yeni sahibiyle canlanıyor."
                  </h4>
                  <p className="italic font-serif text-[#9E4424] bg-[#FAF3E8] p-3 rounded-xl border border-[#EBD7BF]">
                    Bizde eşyalar yalnızca birer ticari meta değildir; her ceketin omzunda bir konserin, her analog vizörde bir seyahatin, her lambaderde gece yarılarının tanıklığı vardır.
                  </p>
                  <p>
                    EldeVar, seri üretilmiş nesnelerin yerine hafızası olan eşyaları yeni sahipleriyle buluşturur. Her siparişte satıcı el yazısıyla hazırladığı hatıra kartını pakete iliştirir. Böylece satın aldığınız her ürün, hayatınıza yeni bir hikâye katar.
                  </p>
                </>
              )}

              {activeLegalModal === 'privacy' && (
                <>
                  <h4 className="font-bold text-sm text-stone-900">EldeVar Gizlilik Politikası & KVKK</h4>
                  <p>
                    6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") uyarınca, EldeVar C2C Pazaryeri platformu üzerinden
                    toplanan kullanıcı verileri (Ad, Soyad, E-posta, Telefon, Teslimat Adresi) yalnızca siparişin yerine getirilmesi,
                    kargo süreçlerinin takibi ve Havale/EFT teyidi amacıyla güvenli sunucularda işlenmektedir.
                  </p>
                  <p>
                    Kullanıcılarımızın açık rızası olmadan veriler üçüncü taraf reklam ağlarıyla paylaşılmaz.
                  </p>
                </>
              )}

              {activeLegalModal === 'sales' && (
                <>
                  <h4 className="font-bold text-sm text-stone-900">Mesafeli Satış Sözleşmesi (C2C)</h4>
                  <p>
                    İşbu sözleşme, Alıcı ile platformda ilan açan Satıcı arasında akdedilmiştir.
                    EldeVar, 6563 sayılı Elektronik Ticaretin Düzenlenmesi Hakkında Kanun uyarınca "Aracı Hizmet Sağlayıcı" konumundadır.
                  </p>
                  <p>
                    Ödeme bedeli, Alıcı ürünü teslim alıp sistem üzerinden onay verene kadar EldeVar havuz güvence hesabında muhafaza edilir.
                  </p>
                </>
              )}

              {activeLegalModal === 'returns' && (
                <>
                  <h4 className="font-bold text-sm text-stone-900">İade ve Cayma Hakkı Şartları</h4>
                  <p>
                    İkinci el ürünlerin doğası gereği, ürün satıcının ilanında belirttiği görsel ve kondisyon özellikleriyle birebir
                    uyuşuyorsa keyfi iade kabul edilmemektedir. Ancak üründe ilanda belirtilmeyen gizli kusur, yırtık, sahtelik veya
                    çalışmama durumu tespit edilirse, teslimattan itibaren 48 saat içinde kargo tutanağı ile iade talebi başlatılabilir.
                  </p>
                </>
              )}
            </div>
            <div className="p-3 bg-white border-t border-[#E8E2D8] text-right">
              <button
                onClick={() => setActiveLegalModal(null)}
                className="px-4 py-1.5 bg-[#9E4424] text-white rounded-lg text-xs font-semibold hover:bg-[#85361A]"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
