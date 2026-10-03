import React, { useState } from 'react';
import { 
  Search, ShieldCheck, Camera, MessageSquare, 
  Tag, Clock, CheckCircle2, AlertTriangle, ArrowRight, 
  X, Send, User, ChevronRight, Check, HelpCircle, Flame, Plus,
  FileCheck2, ShoppingCart
} from 'lucide-react';
import { WantedItem, WantedOffer, ProductCategory, ProductCondition, Product } from '../types';

interface WantedItemsViewProps {
  wantedItems: WantedItem[];
  onAddWantedItem: (newItem: WantedItem) => void;
  onInstantBuyFromOffer: (wantedItem: WantedItem, offer: WantedOffer) => void;
  onNavigateHome: () => void;
}

export const WantedItemsView: React.FC<WantedItemsViewProps> = ({
  wantedItems,
  onAddWantedItem,
  onInstantBuyFromOffer,
  onNavigateHome,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedFilterStatus, setSelectedFilterStatus] = useState<'all' | 'open' | 'deal_made'>('all');

  // Modals state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [activeItemForChat, setActiveItemForChat] = useState<WantedItem | null>(null);
  const [activeOffer, setActiveOffer] = useState<WantedOffer | null>(null);

  // New Chat Message State
  const [chatInputText, setChatInputText] = useState('');
  const [quickPriceInput, setQuickPriceInput] = useState<string>('');
  const [newOfferPrice, setNewOfferPrice] = useState<number | ''>('');
  const [newOfferCondition, setNewOfferCondition] = useState<ProductCondition>('Çok İyi (Az Kullanılmış)');
  const [newOfferPhoto, setNewOfferPhoto] = useState('');
  const [showOfferForm, setShowOfferForm] = useState(false);

  // Generate a random proof code for sellers (e.g. "#EV-784")
  const [generatedVerificationCode] = useState(() => `#EV-${Math.floor(100 + Math.random() * 900)}`);

  // Filtering
  const filteredItems = wantedItems.filter((item) => {
    const matchesSearch = 
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.storyWhy.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.brand && item.brand.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesStatus = selectedFilterStatus === 'all' || item.status === selectedFilterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const categories: { id: ProductCategory | 'all'; label: string }[] = [
    { id: 'all', label: 'Tümü' },
    { id: 'elektronik', label: 'Elektronik & Nostalji' },
    { id: 'erkek', label: 'Erkek Giyim' },
    { id: 'kadin', label: 'Kadın Giyim' },
    { id: 'ayakkabi', label: 'Ayakkabı' },
    { id: 'ev_yasam', label: 'Ev & Yaşam' },
    { id: 'canta_aksesuar', label: 'Çanta & Aksesuar' },
  ];

  // Open Chat Room for an item
  const handleOpenChat = (item: WantedItem) => {
    setActiveItemForChat(item);
    if (item.offers && item.offers.length > 0) {
      setActiveOffer(item.offers[0]);
      setQuickPriceInput(item.offers[0].offerPrice ? item.offers[0].offerPrice.toString() : item.targetBudgetMin.toString());
    } else {
      // Create a default initial offer template if none exists yet
      const initialPrice = Math.round((item.targetBudgetMin + item.targetBudgetMax) / 2);
      const initialOffer: WantedOffer = {
        id: `offer-${Date.now()}`,
        wantedId: item.id,
        sellerId: 'current-user-seller',
        sellerName: 'Sen (Satıcı)',
        sellerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
        sellerRating: 5.0,
        sellerLocation: 'İstanbul',
        offerPrice: initialPrice,
        productCondition: 'Çok İyi (Az Kullanılmış)',
        verificationCode: generatedVerificationCode,
        photos: item.sampleImages.slice(0, 1),
        description: 'Elimde tam bu kriterlere uygun bir parça mevcut.',
        status: 'pending',
        createdAt: 'Az önce',
        messages: [
          {
            id: `msg-${Date.now()}`,
            senderId: item.buyer.id,
            senderName: item.buyer.name,
            senderRole: 'buyer',
            text: `Merhaba! ${item.title} arıyorum. Elinizdeki ürünün kondisyonu ve güncel fotoğrafları nedir acaba?`,
            timestamp: 'Bugün',
          },
        ],
      };
      setActiveOffer(initialOffer);
      setQuickPriceInput(initialPrice.toString());
      setShowOfferForm(false);
    }
  };

  // Immediate Price Offer Handler (User can type or select price directly on this page)
  const handleSendOfferPrice = (customPrice?: number) => {
    const priceToSubmit = customPrice !== undefined ? customPrice : Number(quickPriceInput);
    if (!activeOffer || !priceToSubmit || isNaN(priceToSubmit) || priceToSubmit <= 0) return;

    const offerMsg = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user-seller',
      senderName: 'Sen (Satıcı)',
      senderRole: 'seller' as const,
      text: `Resmi fiyat teklifimi güncelledim: ${priceToSubmit.toLocaleString('tr-TR')} TL.`,
      isOffer: true,
      offerPrice: priceToSubmit,
      verificationCode: activeOffer.verificationCode || generatedVerificationCode,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    setActiveOffer((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        offerPrice: priceToSubmit,
        messages: [...prev.messages, offerMsg],
      };
    });

    setQuickPriceInput(priceToSubmit.toString());
  };

  // Send a message in chat
  const handleSendMessage = () => {
    if (!chatInputText.trim() || !activeOffer) return;

    const newMsg = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user-seller',
      senderName: 'Sen',
      senderRole: 'seller' as const,
      text: chatInputText.trim(),
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    setActiveOffer((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        messages: [...prev.messages, newMsg],
      };
    });

    setChatInputText('');
  };

  // Submit formal offer with verification photo
  const handleSubmitFormalOffer = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOffer || !newOfferPrice) return;

    const offerMsg = {
      id: `msg-${Date.now()}`,
      senderId: 'current-user-seller',
      senderName: 'Sen (Satıcı)',
      senderRole: 'seller' as const,
      text: `Elimdeki ürün için ${newOfferPrice} TL teklif verdim. Durumu: ${newOfferCondition}. Doğrulama koduyla fotoğrafları yükledim.`,
      photoUrl: newOfferPhoto || activeItemForChat?.sampleImages[0],
      isOffer: true,
      offerPrice: Number(newOfferPrice),
      verificationCode: generatedVerificationCode,
      timestamp: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
    };

    setActiveOffer((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        offerPrice: Number(newOfferPrice),
        productCondition: newOfferCondition,
        photos: newOfferPhoto ? [newOfferPhoto] : prev.photos,
        messages: [...prev.messages, offerMsg],
      };
    });

    setShowOfferForm(false);
  };

  return (
    <div className="w-full bg-[#FAF8F5] min-h-screen pb-24 text-stone-800">
      {/* 1. ÜST BİLGİLENDİRME BANNER'I (Sitenin Sıcak ve Uyumlu Renk Paleti) */}
      <section className="bg-[#FAF5EE] border-b border-[#E8E2D8]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <h1 className="text-2xl sm:text-4xl font-serif font-black tracking-tight text-[#1C1917] leading-tight">
                Aradığın ama bulamadığın eşyayı yaz, evinde saklayanlar <span className="text-[#9E4424]">"Bende Var!"</span> desin
              </h1>

              {/* Sayfa farkını anlatan açıklama */}
              <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                <strong>Bu sayfanın farkı nedir?</strong> Klasik mağazalarda sadece satıştaki ürünleri gezersiniz. 
                Burada ise <strong>vitrini siz belirlersiniz:</strong> Çocukluğunuzdan kalma bir kasetçaları, tükenmiş bir vintage ceketi veya hatırası olan bir eşyayı arama ilanı olarak açabilir; 
                elinde bu parçayı saklayan satıcılarla güvenli chat odasında buluşup anında size özel sipariş oluşturabilirsiniz.
              </p>
            </div>

            {/* Yeni Talep Açma Butonu */}
            <div className="w-full lg:w-auto shrink-0 flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="px-6 py-3.5 rounded-full bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Aradığın Eşyayı İlan Ver</span>
              </button>
            </div>
          </div>

          {/* DOLANDIRILMA & YANLIŞ ÜRÜN ÖNLEMLERİ: 3 KATMANLI GÜVENCE */}
          <div className="mt-8 pt-6 border-t border-[#E8E2D8] grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Önlem 1: El Yazılı Doğrulama Kodu */}
            <div className="p-3.5 rounded-xl bg-white border border-[#E8E2D8] shadow-2xs flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#FAF3E8] text-[#9E4424] shrink-0">
                <Camera className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-[#1C1917] font-serif text-[13px] flex items-center gap-1.5">
                  <span>1. El Yazılı Doğrulama Kodu</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-[#FAF3E8] text-[#9E4424] border border-[#EBD7BF] font-sans font-bold">Zorunlu</span>
                </h4>
                <p className="text-stone-600 text-[11px] mt-0.5 leading-snug">
                  Satıcı teklif verirken sistemin verdiği kodu (#EV-...) bir kâğıda yazıp ürünün yanına koyarak çeker. İnternetten sahte görsel kullanımı imkânsızdır.
                </p>
              </div>
            </div>

            {/* Önlem 2: Emanet Havuz Hesap */}
            <div className="p-3.5 rounded-xl bg-white border border-[#E8E2D8] shadow-2xs flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#FAF3E8] text-[#9E4424] shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-[#1C1917] font-serif text-[13px]">2. %100 Emanet Havuz Hesap</h4>
                <p className="text-stone-600 text-[11px] mt-0.5 leading-snug">
                  Chatte fiyatta anlaştığınızda para asla satıcının şahsi hesabına gitmez. EldeVar güvenli havuzunda bloke edilir.
                </p>
              </div>
            </div>

            {/* Önlem 3: 24 Saat Yanlış Ürün İade Garantisi */}
            <div className="p-3.5 rounded-xl bg-white border border-[#E8E2D8] shadow-2xs flex items-start gap-3">
              <div className="p-2 rounded-lg bg-[#FAF3E8] text-[#9E4424] shrink-0">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h4 className="font-bold text-[#1C1917] font-serif text-[13px]">3. 24 Saat İade Güvencesi</h4>
                <p className="text-stone-600 text-[11px] mt-0.5 leading-snug">
                  Kargoyu teslim aldığınızda chatte konuşulan ürünle gelen ürün farklıysa veya kusurluysa paranız kesintisiz iade edilir.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ARAMA, FİLTRE VE İLAN LİSTELEME ALANI */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-6">
        {/* Arama ve Durum Çubuğu */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#E8E2D8] shadow-2xs">
          {/* Arama Input */}
          <div className="relative w-full md:w-96">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Aranan eşyaları veya hikâyeleri ara..."
              className="w-full bg-[#FAF8F5] text-stone-800 text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-[#E4DDCF] focus:outline-none focus:border-[#9E4424] focus:ring-1 focus:ring-[#9E4424] transition-all"
            />
          </div>

          {/* Durum Filtresi */}
          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedFilterStatus('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                selectedFilterStatus === 'all'
                  ? 'bg-[#9E4424] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Tüm Talepler ({wantedItems.length})
            </button>
            <button
              onClick={() => setSelectedFilterStatus('open')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                selectedFilterStatus === 'open'
                  ? 'bg-[#9E4424] text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Teklif Bekleyenler
            </button>
            <button
              onClick={() => setSelectedFilterStatus('deal_made')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer whitespace-nowrap transition-colors ${
                selectedFilterStatus === 'deal_made'
                  ? 'bg-amber-800 text-white'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Anlaşılanlar
            </button>
          </div>
        </div>

        {/* Kategori Hapları */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat.id
                  ? 'bg-[#9E4424] text-white shadow-2xs'
                  : 'bg-white text-stone-700 border border-[#E5DDD1] hover:border-[#9E4424] hover:text-[#9E4424]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* İLANLAR GRİDİ */}
        {filteredItems.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#E8E2D8] p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-[#FAF3E8] text-[#9E4424] flex items-center justify-center mx-auto">
              <Search className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-stone-800 font-serif">Aradığınız kriterde talep bulunamadı</h3>
              <p className="text-xs text-stone-500 max-w-md mx-auto">
                Farklı bir arama yapabilir veya aradığınız özel parçayı ilk siz ilan olarak paylaşabilirsiniz!
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-5 py-2.5 rounded-full bg-[#9E4424] hover:bg-[#85361A] text-white text-xs font-bold cursor-pointer"
            >
              İlk Arama İlanını Ver
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#E8E2D8] overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Görsel Alanı (Örnek Referans Fotoğraflar) */}
                  <div className="relative aspect-4/3 bg-stone-100 overflow-hidden">
                    <img
                      src={item.sampleImages[0]}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      referrerPolicy="no-referrer"
                    />

                    {/* Durum Rozeti */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5">
                      {item.status === 'open' ? (
                        <span className="px-2.5 py-1 rounded-full bg-[#9E4424]/90 backdrop-blur-sm text-white text-[11px] font-bold shadow-xs flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-300 animate-pulse" />
                          <span>Aranıyor</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-stone-800/90 backdrop-blur-sm text-white text-[11px] font-bold shadow-xs">
                          ✓ Anlaşıldı
                        </span>
                      )}

                      {item.eraOrPeriod && (
                        <span className="px-2.5 py-1 rounded-full bg-stone-900/80 backdrop-blur-sm text-stone-200 text-[10px] font-medium">
                          {item.eraOrPeriod}
                        </span>
                      )}
                    </div>

                    {/* Hedef Bütçe Bandı */}
                    <div className="absolute bottom-3 right-3 px-3 py-1.5 rounded-xl bg-white/95 backdrop-blur-md shadow-sm border border-[#E8E2D8] text-right">
                      <span className="text-[10px] text-stone-500 block leading-tight font-medium">Hedef Bütçe</span>
                      <span className="text-xs sm:text-sm font-bold text-[#9E4424]">
                        {item.targetBudgetMin.toLocaleString('tr-TR')} - {item.targetBudgetMax.toLocaleString('tr-TR')} TL
                      </span>
                    </div>
                  </div>

                  {/* İçerik Alanı */}
                  <div className="p-5 space-y-3.5">
                    {/* Alıcı Profili ve Zaman */}
                    <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.buyer.avatar}
                          alt={item.buyer.name}
                          className="w-7 h-7 rounded-full object-cover border border-stone-200"
                          referrerPolicy="no-referrer"
                        />
                        <div>
                          <span className="text-xs font-bold text-stone-900 block leading-tight">{item.buyer.name}</span>
                          <span className="text-[10px] text-stone-500">{item.buyer.city}</span>
                        </div>
                      </div>
                      <span className="text-[11px] text-stone-400">{item.createdAt}</span>
                    </div>

                    {/* Başlık ve Kategori */}
                    <div className="space-y-1">
                      <div className="text-[10px] font-bold text-[#9E4424] uppercase tracking-wider">
                        {item.categoryLabel} {item.brand && `• ${item.brand}`}
                      </div>
                      <h3 className="text-base font-bold text-stone-900 font-serif leading-snug line-clamp-1 group-hover:text-[#9E4424] transition-colors">
                        {item.title}
                      </h3>
                    </div>

                    {/* Neden Arıyor? (Hikâye / Talep Nedeni) */}
                    <div className="p-3 rounded-xl bg-[#FAF5EE] border border-[#EBE3D7] text-xs text-stone-700 leading-relaxed font-sans line-clamp-3">
                      <span className="font-bold text-stone-900 mr-1 font-serif">"Aranma Nedeni:</span>
                      {item.storyWhy}"
                    </div>

                    {/* İpuçları / Beden */}
                    {item.size && (
                      <div className="text-[11px] text-stone-600 flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-stone-400" />
                        <span>Aranan Beden/Ölçü: <strong className="text-stone-800">{item.size}</strong></span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Alt Aksiyon: Sade 'Bende Var!' Butonu (Kullanıcı İsteği) */}
                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleOpenChat(item)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-xs sm:text-sm flex items-center justify-center shadow-2xs hover:shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <span>Bende Var!</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* 3. 'BENDE VAR!' CHAT & GÜVENLİ PAZARLIK MODALI (Negotiation Room) */}
      {/* ======================================================== */}
      {activeItemForChat && activeOffer && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[92vh] shadow-2xl border border-[#E8E2D8] flex flex-col overflow-hidden">
            {/* Modal Başlığı */}
            <div className="px-6 py-4 border-b border-[#E8E2D8] bg-[#FAF8F5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-[#FAF3E8] text-[#9E4424]">
                  <MessageSquare className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900 font-serif">
                    "Bende Var" Güvenli Teklif & Mesajlaşma Odası
                  </h3>
                  <p className="text-xs text-stone-500">
                    {activeItemForChat.title} için özel anlaşma alanı
                  </p>
                </div>
              </div>

              <button
                onClick={() => setActiveItemForChat(null)}
                className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Gövdesi (Sol: Talep Özeti & Güvenlik | Sağ: Chat & Teklif) */}
            <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 divide-y lg:divide-y-0 lg:divide-x divide-[#E8E2D8]">
              {/* SOL SÜTUN: ALICININ ARADIĞI KRİTERLER & DOĞRULAMA KARTI */}
              <div className="lg:col-span-5 p-5 sm:p-6 bg-[#FAF8F5]/50 space-y-4 overflow-y-auto">
                {/* Referans Görseli & Alıcı Bilgisi */}
                <div className="space-y-3">
                  <div className="aspect-video rounded-xl overflow-hidden bg-stone-200 relative border border-stone-300">
                    <img
                      src={activeItemForChat.sampleImages[0]}
                      alt={activeItemForChat.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 text-white text-[10px] font-semibold">
                      Alıcının Örnek Görseli
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-[#9E4424] uppercase tracking-wider block">
                      {activeItemForChat.categoryLabel}
                    </span>
                    <h4 className="font-bold text-stone-900 text-sm font-serif">
                      {activeItemForChat.title}
                    </h4>
                  </div>
                </div>

                {/* Hedef Bütçe & Alıcı Notu */}
                <div className="p-3.5 rounded-xl bg-white border border-[#E8E2D8] space-y-2 text-xs">
                  <div className="flex items-center justify-between pb-2 border-b border-stone-100">
                    <span className="text-stone-500">Alıcının Bütçesi:</span>
                    <strong className="text-[#9E4424] font-bold text-sm">
                      {activeItemForChat.targetBudgetMin.toLocaleString('tr-TR')} - {activeItemForChat.targetBudgetMax.toLocaleString('tr-TR')} TL
                    </strong>
                  </div>
                  <div>
                    <span className="text-stone-500 block mb-0.5 font-medium">Neden Arıyor?</span>
                    <p className="text-stone-700 italic text-[11px] leading-relaxed">
                      "{activeItemForChat.storyWhy}"
                    </p>
                  </div>
                </div>

                {/* YENİ: SOL SÜTUN DOĞRUDAN FİYAT TEKLİFİ VER BÖLÜMÜ */}
                <div className="p-4 rounded-2xl bg-white border border-[#E8E2D8] shadow-2xs space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#9E4424]" />
                      <span>Fiyat Teklifi Ver</span>
                    </span>
                    <span className="text-[10px] font-bold text-[#9E4424] bg-[#FAF3E8] px-2 py-0.5 rounded-full border border-[#EBD6C3]">
                      Son Teklif: {activeOffer.offerPrice.toLocaleString('tr-TR')} TL
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="relative flex-1">
                      <input
                        type="number"
                        value={quickPriceInput}
                        onChange={(e) => setQuickPriceInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSendOfferPrice()}
                        placeholder="Teklif tutarı girin"
                        className="w-full bg-[#FAF8F5] text-xs font-bold text-stone-900 pl-3 pr-8 py-2 rounded-xl border border-[#DFCBB6] focus:outline-none focus:ring-1 focus:ring-[#9E4424]"
                      />
                      <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400">TL</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSendOfferPrice()}
                      disabled={!quickPriceInput || Number(quickPriceInput) <= 0}
                      className="px-3.5 py-2 rounded-xl bg-[#9E4424] hover:bg-[#85361A] disabled:opacity-40 text-white font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                    >
                      Teklif Ver
                    </button>
                  </div>

                  {/* Hızlı Bütçe Seçenekleri */}
                  <div className="flex items-center gap-1.5 pt-0.5">
                    <span className="text-[10px] text-stone-400">Hızlı:</span>
                    <button
                      type="button"
                      onClick={() => handleSendOfferPrice(activeItemForChat.targetBudgetMin)}
                      className="text-[10px] font-medium bg-[#FAF8F5] hover:bg-[#FAF4ED] text-stone-700 hover:text-[#9E4424] px-2 py-0.5 rounded-md border border-stone-200 cursor-pointer transition-colors"
                    >
                      {activeItemForChat.targetBudgetMin} TL (Min)
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendOfferPrice(Math.round((activeItemForChat.targetBudgetMin + activeItemForChat.targetBudgetMax) / 2))}
                      className="text-[10px] font-medium bg-[#FAF8F5] hover:bg-[#FAF4ED] text-stone-700 hover:text-[#9E4424] px-2 py-0.5 rounded-md border border-stone-200 cursor-pointer transition-colors"
                    >
                      {Math.round((activeItemForChat.targetBudgetMin + activeItemForChat.targetBudgetMax) / 2)} TL
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSendOfferPrice(activeItemForChat.targetBudgetMax)}
                      className="text-[10px] font-medium bg-[#FAF8F5] hover:bg-[#FAF4ED] text-stone-700 hover:text-[#9E4424] px-2 py-0.5 rounded-md border border-stone-200 cursor-pointer transition-colors"
                    >
                      {activeItemForChat.targetBudgetMax} TL (Max)
                    </button>
                  </div>
                </div>

                {/* DOLANDIRILMA ÖNLEME KARTI: SATICI DOĞRULAMA KODU */}
                <div className="p-4 rounded-xl bg-[#FAF5EE] border border-[#E8E2D8] space-y-2">
                  <div className="flex items-center gap-2 text-[#9E4424] font-bold text-xs">
                    <ShieldCheck className="w-4 h-4 text-[#9E4424]" />
                    <span>Zorunlu Güvenlik Kodu: {generatedVerificationCode}</span>
                  </div>
                  <p className="text-[11px] text-stone-700 leading-snug">
                    Dolandırıcılığı önlemek için; elinizdeki eşyayı bir kâğıda <strong>{generatedVerificationCode}</strong> kodunu ve bugünün tarihini yazıp yanına koyarak fotoğraflayınız.
                  </p>
                </div>

                {/* ANLAŞILINCA ÖZEL İLAN OLUŞTURMA BUTONU */}
                <div className="pt-1">
                  <button
                    onClick={() => {
                      onInstantBuyFromOffer(activeItemForChat, activeOffer);
                      setActiveItemForChat(null);
                    }}
                    className="w-full py-3 px-4 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md cursor-pointer active:scale-95 transition-all"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Fiyatta Anlaştık ({activeOffer.offerPrice.toLocaleString('tr-TR')} TL) - Satın Al</span>
                  </button>
                  <p className="text-[10px] text-stone-500 text-center mt-1.5">
                    🔒 Para EldeVar emanet havuzunda bloke edilir. Ürün onaylanana kadar satıcıya aktarılmaz.
                  </p>
                </div>
              </div>

              {/* SAĞ SÜTUN: CHAT MESAJLAŞMASI & ANLIK TEKLİF FORMU */}
              <div className="lg:col-span-7 flex flex-col h-[520px] bg-white">
                {/* Chat Başlığı */}
                <div className="px-5 py-3 border-b border-stone-100 flex items-center justify-between bg-stone-50/50">
                  <div className="flex items-center gap-2.5">
                    <img
                      src={activeItemForChat.buyer.avatar}
                      alt={activeItemForChat.buyer.name}
                      className="w-8 h-8 rounded-full object-cover border border-stone-200"
                    />
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-stone-900">{activeItemForChat.buyer.name}</span>
                        <span className="text-[10px] text-[#9E4424] bg-[#FAF3E8] px-1.5 py-0.2 rounded font-bold">Alıcı</span>
                      </div>
                      <span className="text-[10px] text-stone-400">Çevrimiçi • {activeItemForChat.buyer.city}</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setShowOfferForm(!showOfferForm)}
                    className="text-xs font-bold text-[#9E4424] hover:text-[#85361A] bg-[#FAF3E8] hover:bg-[#F3E7D5] px-3 py-1.5 rounded-lg border border-[#DFCBB6] flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    <Tag className="w-3.5 h-3.5" />
                    <span>{showOfferForm ? 'Teklif Formunu Kapat' : 'Teklif & Fotoğraf Ver'}</span>
                  </button>
                </div>

                {/* Teklif Verme Açılır Paneli */}
                {showOfferForm && (
                  <form onSubmit={handleSubmitFormalOffer} className="p-4 bg-[#FAF5EE] border-b border-[#E8E2D8] space-y-3 animate-in fade-in duration-150">
                    <div className="text-xs font-bold text-[#1C1917] flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-[#9E4424]" />
                      <span>Elinizdeki Ürün İçin Teklif Oluşturun</span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-xs">
                      <div>
                        <label className="text-[11px] font-semibold text-stone-700 block mb-1">Teklif Fiyatınız (TL)</label>
                        <input
                          type="number"
                          value={newOfferPrice}
                          onChange={(e) => setNewOfferPrice(e.target.value ? Number(e.target.value) : '')}
                          placeholder={`Örn: ${activeItemForChat.targetBudgetMin}`}
                          required
                          className="w-full bg-white p-2 rounded-lg border border-[#DFCBB6] text-xs font-bold text-stone-900 focus:outline-none focus:ring-1 focus:ring-[#9E4424]"
                        />
                      </div>

                      <div>
                        <label className="text-[11px] font-semibold text-stone-700 block mb-1">Kondisyon</label>
                        <select
                          value={newOfferCondition}
                          onChange={(e) => setNewOfferCondition(e.target.value as ProductCondition)}
                          className="w-full bg-white p-2 rounded-lg border border-[#DFCBB6] text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#9E4424]"
                        >
                          <option value="Kusursuz (Yeni Gibi)">Kusursuz (Yeni Gibi)</option>
                          <option value="Çok İyi (Az Kullanılmış)">Çok İyi (Az Kullanılmış)</option>
                          <option value="İyi (Temiz İkinci El)">İyi (Temiz İkinci El)</option>
                          <option value="Vintage & Karakterli">Vintage & Karakterli</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-700 block mb-1">
                        Ürününüzün Fotoğrafı ({generatedVerificationCode} kodlu)
                      </label>
                      <input
                        type="url"
                        value={newOfferPhoto}
                        onChange={(e) => setNewOfferPhoto(e.target.value)}
                        placeholder="Fotoğraf bağlantısı (veya hazır örnek)"
                        className="w-full bg-white p-2 rounded-lg border border-[#DFCBB6] text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-[#9E4424]"
                      />
                    </div>

                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowOfferForm(false)}
                        className="px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:bg-stone-200 cursor-pointer"
                      >
                        İptal
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-[#9E4424] hover:bg-[#85361A] text-white text-xs font-bold cursor-pointer"
                      >
                        Teklifi Chat'e Gönder
                      </button>
                    </div>
                  </form>
                )}

                {/* Mesaj Listesi */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#FAF8F5]/30">
                  {/* Güvenlik Hatırlatma Mesajı */}
                  <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>Lütfen IBAN veya kişisel telefon paylaşmayınız. Ödemeler yalnızca EldeVar havuz hesabı üzerinden güvence altındadır.</span>
                  </div>

                  {activeOffer.messages.map((msg) => {
                    const isMe = msg.senderRole === 'seller';

                    return (
                      <div
                        key={msg.id}
                        className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                      >
                        <div className="flex items-center gap-1.5 text-[10px] text-stone-400">
                          <span className="font-semibold text-stone-600">{msg.senderName}</span>
                          <span>•</span>
                          <span>{msg.timestamp}</span>
                        </div>

                        <div
                          className={`max-w-xs sm:max-w-sm rounded-2xl p-3 text-xs leading-relaxed ${
                            isMe
                              ? 'bg-[#9E4424] text-white rounded-br-xs'
                              : 'bg-white border border-[#E8E2D8] text-stone-800 rounded-bl-xs shadow-2xs'
                          }`}
                        >
                          {/* Teklif Kartı Varsa */}
                          {msg.isOffer && (
                            <div className={`mb-2.5 p-3 rounded-xl border ${
                              isMe
                                ? 'bg-black/20 border-white/20 text-white'
                                : 'bg-[#FAF4ED] border-[#EAD7C5] text-stone-900'
                            }`}>
                              <div className="flex items-center justify-between pb-1.5 border-b border-black/10">
                                <span className={`text-xs font-bold flex items-center gap-1 ${isMe ? 'text-amber-200' : 'text-[#9E4424]'}`}>
                                  <Tag className="w-3.5 h-3.5" />
                                  <span>Resmi Fiyat Teklifi</span>
                                </span>
                                <span className={`text-sm font-black ${isMe ? 'text-white' : 'text-[#9E4424]'}`}>
                                  {msg.offerPrice?.toLocaleString('tr-TR')} TL
                                </span>
                              </div>
                              {msg.verificationCode && (
                                <div className="mt-1.5 flex items-center gap-1 text-[10px] font-semibold">
                                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                                  <span className={isMe ? 'text-white/90' : 'text-stone-600'}>
                                    Kod Doğrulandı: {msg.verificationCode}
                                  </span>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Fotoğraf Varsa */}
                          {msg.photoUrl && (
                            <div className="mb-2 rounded-xl overflow-hidden border border-black/10">
                              <img
                                src={msg.photoUrl}
                                alt="Teklif görseli"
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80';
                                }}
                                className="w-full h-36 object-cover"
                              />
                            </div>
                          )}

                          <p>{msg.text}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* YENİ: HER ZAMAN GÖRÜNÜR HIZLI TEKLİF & FİYAT GİRİŞ BÖLÜMÜ */}
                <div className="p-3 bg-[#FAF5EE] border-t border-[#E8E2D8] space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                      <span className="text-xs font-bold text-stone-900 flex items-center gap-1 shrink-0">
                        <Tag className="w-3.5 h-3.5 text-[#9E4424]" />
                        <span>Fiyat Teklifi:</span>
                      </span>
                      <div className="relative flex-1 max-w-[130px]">
                        <input
                          type="number"
                          value={quickPriceInput}
                          onChange={(e) => setQuickPriceInput(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendOfferPrice()}
                          placeholder="Fiyat girin..."
                          className="w-full bg-white text-xs font-bold text-stone-900 pl-3 pr-7 py-2 rounded-xl border border-[#DFCBB6] focus:outline-none focus:ring-1 focus:ring-[#9E4424] shadow-2xs"
                        />
                        <span className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[10px] font-bold text-stone-400">TL</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleSendOfferPrice()}
                        disabled={!quickPriceInput || Number(quickPriceInput) <= 0}
                        className="px-3.5 py-2 rounded-xl bg-[#9E4424] hover:bg-[#85361A] disabled:opacity-40 text-white font-bold text-xs shadow-2xs transition-all active:scale-95 cursor-pointer whitespace-nowrap"
                      >
                        Teklif Ver
                      </button>
                    </div>

                    {/* Hızlı Teklif Butonları */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="text-[10px] text-stone-500 hidden sm:inline">Hızlı:</span>
                      <button
                        type="button"
                        onClick={() => handleSendOfferPrice(activeItemForChat.targetBudgetMin)}
                        className="px-2 py-1 rounded-lg bg-white hover:bg-[#FAF4ED] border border-[#E8E2D8] text-[10px] font-bold text-stone-700 hover:text-[#9E4424] cursor-pointer transition-colors shadow-2xs"
                        title="Taban bütçeyi teklif et"
                      >
                        {activeItemForChat.targetBudgetMin} TL
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendOfferPrice(Math.round((activeItemForChat.targetBudgetMin + activeItemForChat.targetBudgetMax) / 2))}
                        className="px-2 py-1 rounded-lg bg-white hover:bg-[#FAF4ED] border border-[#E8E2D8] text-[10px] font-bold text-stone-700 hover:text-[#9E4424] cursor-pointer transition-colors shadow-2xs"
                        title="Ortalama bütçeyi teklif et"
                      >
                        {Math.round((activeItemForChat.targetBudgetMin + activeItemForChat.targetBudgetMax) / 2)} TL
                      </button>
                      <button
                        type="button"
                        onClick={() => handleSendOfferPrice(activeItemForChat.targetBudgetMax)}
                        className="px-2 py-1 rounded-lg bg-white hover:bg-[#FAF4ED] border border-[#E8E2D8] text-[10px] font-bold text-stone-700 hover:text-[#9E4424] cursor-pointer transition-colors shadow-2xs"
                        title="Tavan bütçeyi teklif et"
                      >
                        {activeItemForChat.targetBudgetMax} TL
                      </button>
                    </div>
                  </div>
                </div>

                {/* Mesaj Yazma Alanı */}
                <div className="p-3 border-t border-stone-200 bg-white">
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={chatInputText}
                      onChange={(e) => setChatInputText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                      placeholder="Alıcıya bir soru sor veya teklifini yaz..."
                      className="flex-1 bg-[#FAF8F5] text-stone-800 text-xs sm:text-sm px-4 py-2.5 rounded-xl border border-[#E4DDCF] focus:outline-none focus:border-[#9E4424]"
                    />
                    <button
                      onClick={handleSendMessage}
                      disabled={!chatInputText.trim()}
                      className="px-4 py-2.5 rounded-xl bg-[#9E4424] hover:bg-[#85361A] disabled:opacity-40 text-white font-bold text-xs flex items-center justify-center transition-all cursor-pointer"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. YENİ ARAMA İLANI VER MODALI (Create Wanted Item Modal) */}
      {/* ======================================================== */}
      {isCreateModalOpen && (
        <CreateWantedModal
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={(newItem) => {
            onAddWantedItem(newItem);
            setIsCreateModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

// ========================================================
// YENİ TALEP OLUŞTURMA MODAL BİLEŞENİ
// ========================================================
interface CreateWantedModalProps {
  onClose: () => void;
  onSubmit: (item: WantedItem) => void;
}

const CreateWantedModal: React.FC<CreateWantedModalProps> = ({ onClose, onSubmit }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ProductCategory>('elektronik');
  const [brand, setBrand] = useState('');
  const [size, setSize] = useState('');
  const [eraOrPeriod, setEraOrPeriod] = useState("90'lar");
  const [targetBudgetMin, setTargetBudgetMin] = useState<number>(800);
  const [targetBudgetMax, setTargetBudgetMax] = useState<number>(1400);
  const [storyWhy, setStoryWhy] = useState('');
  const [imageUrl, setImageUrl] = useState('');

  const sampleDefaultImages: Record<ProductCategory, string> = {
    elektronik: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=600&auto=format&fit=crop&q=80',
    erkek: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
    kadin: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80',
    ayakkabi: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80',
    canta_aksesuar: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80',
    ev_yasam: 'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80',
    cocuk: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?w=600&auto=format&fit=crop&q=80',
    giyim: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
  };

  const getCategoryLabel = (cat: ProductCategory) => {
    switch (cat) {
      case 'elektronik': return 'Elektronik & Nostalji';
      case 'erkek': return 'Erkek Giyim';
      case 'kadin': return 'Kadın Giyim';
      case 'ayakkabi': return 'Ayakkabı';
      case 'canta_aksesuar': return 'Çanta & Aksesuar';
      case 'ev_yasam': return 'Ev & Yaşam';
      default: return 'Genel';
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newItem: WantedItem = {
      id: `wanted-${Date.now()}`,
      title,
      category,
      categoryLabel: getCategoryLabel(category),
      targetBudgetMin: Number(targetBudgetMin),
      targetBudgetMax: Number(targetBudgetMax),
      brand: brand.trim() || undefined,
      size: size.trim() || undefined,
      eraOrPeriod: eraOrPeriod.trim() || undefined,
      storyWhy: storyWhy.trim(),
      sampleImages: [imageUrl.trim() || sampleDefaultImages[category]],
      buyer: {
        id: 'current-user-buyer',
        name: 'Sen (Alıcı)',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=120&auto=format&fit=crop&q=80',
        city: 'İstanbul',
        trustScore: 100,
      },
      status: 'open',
      offersCount: 0,
      views: 1,
      createdAt: 'Az önce',
      offers: [],
    };

    onSubmit(newItem);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl w-full max-w-xl max-h-[90vh] shadow-2xl border border-[#E8E2D8] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-[#E8E2D8] bg-[#FAF8F5] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-[#FAF3E8] text-[#9E4424]">
              <Search className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 font-serif">Aradığın Eşyayı İlan Ver</h3>
              <p className="text-xs text-stone-500">Evinde saklayan satıcılar teklif versin</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-700 flex items-center justify-center cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleFormSubmit} className="p-6 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Eşya Adı */}
          <div>
            <label className="font-bold text-stone-800 block mb-1">
              Aradığınız Eşyanın Başlığı <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Örn: Sony WM-EX190 Gri Walkman Kasetçalar"
              required
              className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#E4DDCF] text-xs font-semibold text-stone-900 focus:outline-none focus:border-[#9E4424]"
            />
          </div>

          {/* Kategori & Marka */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-800 block mb-1">Kategori</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#E4DDCF] text-xs text-stone-900 focus:outline-none focus:border-[#9E4424]"
              >
                <option value="elektronik">Elektronik & Nostalji</option>
                <option value="erkek">Erkek Giyim</option>
                <option value="kadin">Kadın Giyim</option>
                <option value="ayakkabi">Ayakkabı</option>
                <option value="ev_yasam">Ev & Yaşam</option>
                <option value="canta_aksesuar">Çanta & Aksesuar</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">Marka / Terzi</label>
              <input
                type="text"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="Örn: Sony, Levi's, Dual"
                className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#E4DDCF] text-xs text-stone-900 focus:outline-none focus:border-[#9E4424]"
              />
            </div>
          </div>

          {/* Dönem & Beden */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-800 block mb-1">Dönem / Yıl Tercihi</label>
              <input
                type="text"
                value={eraOrPeriod}
                onChange={(e) => setEraOrPeriod(e.target.value)}
                placeholder="Örn: 90'lar, 1985, Güncel"
                className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#E4DDCF] text-xs text-stone-900 focus:outline-none focus:border-[#9E4424]"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">Beden / Ölçü (Opsiyonel)</label>
              <input
                type="text"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                placeholder="Örn: L, W32 L32, 42 No"
                className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#E4DDCF] text-xs text-stone-900 focus:outline-none focus:border-[#9E4424]"
              />
            </div>
          </div>

          {/* Hedef Bütçe Aralığı */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-stone-800 block mb-1">Min Bütçe (TL)</label>
              <input
                type="number"
                value={targetBudgetMin}
                onChange={(e) => setTargetBudgetMin(Number(e.target.value))}
                required
                className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#E4DDCF] text-xs text-stone-900 focus:outline-none focus:border-[#9E4424]"
              />
            </div>

            <div>
              <label className="font-bold text-stone-800 block mb-1">Maks Bütçe (TL)</label>
              <input
                type="number"
                value={targetBudgetMax}
                onChange={(e) => setTargetBudgetMax(Number(e.target.value))}
                required
                className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#E4DDCF] text-xs text-stone-900 focus:outline-none focus:border-[#9E4424]"
              />
            </div>
          </div>

          {/* Neden Arıyorsunuz? (Duygusal Hikâye) */}
          <div>
            <label className="font-bold text-stone-800 block mb-1">
              Neden bu eşyayı arıyorsunuz? Hatırası ne? <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              value={storyWhy}
              onChange={(e) => setStoryWhy(e.target.value)}
              placeholder="Örn: Babamın bana lisede aldığı walkman'i kaybettim, kasetlerimi tekrar dinlemek için arıyorum..."
              required
              className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#E4DDCF] text-xs text-stone-900 focus:outline-none focus:border-[#9E4424] leading-relaxed"
            />
          </div>

          {/* Örnek Fotoğraf URL */}
          <div>
            <label className="font-bold text-stone-800 block mb-1">Örnek Görsel Bağlantısı (Opsiyonel)</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="İnternetten benzer bir modelin görsel linki (boş bırakılırsa hazır görsel atanır)"
              className="w-full bg-[#FAF8F5] p-3 rounded-xl border border-[#E4DDCF] text-xs text-stone-900 focus:outline-none focus:border-[#9E4424]"
            />
          </div>

          {/* Güvenlik Bilgisi */}
          <div className="p-3 rounded-xl bg-[#FAF5EE] border border-[#E8E2D8] text-[11px] text-stone-700 flex items-start gap-2">
            <ShieldCheck className="w-4 h-4 text-[#9E4424] shrink-0 mt-0.5" />
            <span>İlanınız onaylandıktan sonra "Bende Var!" diyen kullanıcılar sizinle sadece doğrulama kodu ve gerçek fotoğraflarla iletişime geçebilecektir.</span>
          </div>

          {/* Butonlar */}
          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold cursor-pointer"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-[#9E4424] hover:bg-[#85361A] text-white font-bold cursor-pointer shadow-sm active:scale-95 transition-all"
            >
              Arama İlanını Yayınla
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
