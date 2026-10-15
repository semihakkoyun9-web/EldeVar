import React, { useState, useMemo, useRef } from 'react';
import { 
  X, Search, Plus, Trash2, Edit3, Image as ImageIcon, Save, Sparkles, 
  Upload, Link as LinkIcon, RotateCcw, Check, AlertCircle, ShieldAlert,
  Sliders, Feather, Eye, Tag, ArrowUpRight, Copy, Download, FileUp
} from 'lucide-react';
import { Product, ProductCategory, ProductCondition } from '../types';
import { INITIAL_PRODUCTS } from '../data/mockData';

interface AdminProductManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onSaveProducts: (newProducts: Product[]) => void;
  onShowNotification?: (title: string, message: string) => void;
}

const CATEGORY_OPTIONS: { value: ProductCategory; label: string }[] = [
  { value: 'erkek', label: 'Erkek Giyim & Mont' },
  { value: 'kadin', label: 'Kadın Giyim & Palto' },
  { value: 'ayakkabi', label: 'Ayakkabı & Bot & Sneaker' },
  { value: 'canta_aksesuar', label: 'Çanta, Saat & Aksesuar' },
  { value: 'elektronik', label: 'Elektronik, Ses & Kamera' },
  { value: 'ev_yasam', label: 'Ev, Yaşam & Koleksiyon' },
  { value: 'cocuk', label: 'Çocuk Giyim & Spor' },
];

const CONDITION_OPTIONS: { value: ProductCondition; type: 'yeni_gibi' | 'az_kullanilmis' | 'cok_kullanilmis' | 'vintage'; label: string }[] = [
  { value: 'Kusursuz (Yeni Gibi)', type: 'yeni_gibi', label: 'Kusursuz (Yeni Gibi)' },
  { value: 'Kusursuz (Etiketsiz Sıfır)', type: 'yeni_gibi', label: 'Kusursuz (Etiketsiz Sıfır)' },
  { value: 'Çok İyi (Az Kullanılmış)', type: 'az_kullanilmis', label: 'Çok İyi (Az Kullanılmış)' },
  { value: 'İyi (Temiz İkinci El)', type: 'az_kullanilmis', label: 'İyi (Temiz İkinci El)' },
  { value: 'İyi (Yaşanmışlık İzi Var)', type: 'cok_kullanilmis', label: 'İyi (Yaşanmışlık İzi Var)' },
  { value: 'Çok Kullanılmış (Karakterli Patina)', type: 'cok_kullanilmis', label: 'Çok Kullanılmış (Patinalı)' },
  { value: 'Çok Kullanılmış (Orijinal Yün)', type: 'cok_kullanilmis', label: 'Çok Kullanılmış (Orijinal Yün)' },
  { value: 'Vintage Koleksiyonluk', type: 'vintage', label: 'Vintage Koleksiyonluk' },
];

export const AdminProductManagerModal: React.FC<AdminProductManagerModalProps> = ({
  isOpen,
  onClose,
  products,
  onSaveProducts,
  onShowNotification,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState(false);
  const [newImageUrl, setNewImageUrl] = useState('');
  const [activeTab, setActiveTab] = useState<'basic' | 'images' | 'story' | 'seller'>('images');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const filteredList = useMemo(() => {
    return products.filter((p) => {
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        return (
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.id.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          (p.passportCode && p.passportCode.toLowerCase().includes(q))
        );
      }
      return true;
    });
  }, [products, selectedCategory, searchQuery]);

  if (!isOpen) return null;

  // Start editing a product
  const handleStartEdit = (product: Product) => {
    setEditingProduct(JSON.parse(JSON.stringify(product)));
    setIsCreatingNew(false);
    setActiveTab('images'); // Start on images since user specifically wants to fix pictures
  };

  // Start creating new product
  const handleStartCreate = () => {
    const newId = `prod-custom-${Date.now()}`;
    const emptyProduct: Product = {
      id: newId,
      title: 'Yeni Koleksiyonluk Eşya',
      category: 'ev_yasam',
      categoryLabel: 'Ev & Yaşam & Koleksiyon',
      price: 1500,
      originalPrice: 3500,
      condition: 'Vintage Koleksiyonluk',
      conditionType: 'vintage',
      brand: 'Özel Zanaat',
      size: 'Tek Ebat',
      passportCode: `EV-${new Date().getFullYear()}-NEW`,
      description: 'Eşyanın detaylı özellikleri ve kondisyon durumu buraya yazılacaktır.',
      images: [
        'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
      ],
      story: {
        eraOrYear: `${new Date().getFullYear() - 30}`,
        originCity: 'Kadıköy, İstanbul',
        travelBadge: 'Özel Koleksiyon Parçası',
        memoryQuote: 'Uzun yıllar özenle saklanmış nadide bir eşya...',
        storyDetail: 'Bu eşyanın geçmişi ve sahibine kattığı değerler buraya yazılacaktır.',
        sellerFarewell: 'Yeni sahibine mutluluk ve huzur getirmesini dilerim.',
      },
      seller: {
        id: 'seller-admin',
        name: 'EldeVar Arşivi',
        email: 'admin@eldevar.com',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80',
        rating: 5.0,
        salesCount: 50,
        location: 'İstanbul, Moda',
      },
      ecoSavings: { co2Kg: 20, waterLiters: 4000 },
      shippingFee: 0,
      views: 1,
      likes: 1,
      createdAt: new Date().toISOString(),
    };
    setEditingProduct(emptyProduct);
    setIsCreatingNew(true);
    setActiveTab('images');
  };

  // Save product edits
  const handleSaveCurrentProduct = () => {
    if (!editingProduct) return;
    if (!editingProduct.title.trim()) {
      alert('Lütfen ürün başlığını boş bırakmayınız.');
      return;
    }
    if (editingProduct.images.length === 0) {
      alert('Ürünün en az 1 adet fotoğrafı olmalıdır.');
      return;
    }

    let updatedList: Product[];
    if (isCreatingNew) {
      updatedList = [editingProduct, ...products];
      showToast(`✨ "${editingProduct.title}" başarıyla eklendi!`);
    } else {
      updatedList = products.map((p) => (p.id === editingProduct.id ? editingProduct : p));
      showToast(`💾 "${editingProduct.title}" güncellendi!`);
    }

    onSaveProducts(updatedList);
    setEditingProduct(null);
    setIsCreatingNew(false);
  };

  // Delete product
  const handleDeleteProduct = (productId: string, title: string) => {
    if (window.confirm(`"${title}" adlı ürünü silmek istediğinize emin misiniz?`)) {
      const updated = products.filter((p) => p.id !== productId);
      onSaveProducts(updated);
      if (editingProduct?.id === productId) {
        setEditingProduct(null);
      }
      showToast(`🗑️ "${title}" silindi.`);
    }
  };

  // Image helpers
  const handleAddImageUrl = () => {
    if (!newImageUrl.trim() || !editingProduct) return;
    setEditingProduct({
      ...editingProduct,
      images: [...editingProduct.images, newImageUrl.trim()],
    });
    setNewImageUrl('');
  };

  const handleRemoveImage = (index: number) => {
    if (!editingProduct) return;
    if (editingProduct.images.length <= 1) {
      alert('Üründe en az 1 görsel bulunmalıdır.');
      return;
    }
    const updated = editingProduct.images.filter((_, i) => i !== index);
    setEditingProduct({ ...editingProduct, images: updated });
  };

  const handleSetPrimaryImage = (index: number) => {
    if (!editingProduct || index === 0) return;
    const target = editingProduct.images[index];
    const others = editingProduct.images.filter((_, i) => i !== index);
    setEditingProduct({ ...editingProduct, images: [target, ...others] });
    showToast('🌟 Ana vitrin görseli değiştirildi.');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0 || !editingProduct) return;

    Array.from(files).forEach((file) => {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        const result = uploadEvent.target?.result as string;
        if (result) {
          setEditingProduct((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              images: [...prev.images, result],
            };
          });
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    showToast('📸 Fotoğraf başarıyla yüklendi.');
  };

  const handleExportMockDataCode = () => {
    const code = `export const INITIAL_PRODUCTS = ${JSON.stringify(products, null, 2)};`;
    navigator.clipboard.writeText(code);
    showToast('📋 Güncel INITIAL_PRODUCTS TypeScript kodu panoya kopyalandı!');
  };

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(products, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'eldevar_products.json';
    a.click();
    URL.revokeObjectURL(url);
    showToast('📥 eldevar_products.json dosyası indirildi!');
  };

  return (
    <div className="fixed inset-0 z-[9999] bg-black/75 backdrop-blur-md flex items-center justify-center p-2 sm:p-4 overflow-hidden">
      <div className="bg-[#FAF8F5] text-stone-900 w-full max-w-7xl h-[92vh] max-h-[950px] rounded-3xl border border-[#E8DEC8] shadow-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        
        {/* TOP BAR */}
        <header className="px-5 py-4 bg-gradient-to-r from-[#1C1917] via-[#2A2421] to-[#1C1917] text-white flex items-center justify-between border-b border-stone-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#9E4424] flex items-center justify-center text-white shadow-md">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif font-bold text-base sm:text-lg tracking-tight">
                  EldeVar Yönetici & Ürün Kontrol Paneli
                </h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  GİRİŞ YAPILDI
                </span>
              </div>
              <p className="text-xs text-stone-400 font-sans">
                Tüm ürünlerin görsellerini, hikâyelerini, fiyatlarını ve özelliklerini anında düzenleyin.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleExportMockDataCode}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-amber-400 hover:text-amber-300 text-xs font-semibold border border-stone-700 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Değişiklikleri TypeScript kodu olarak kopyala"
            >
              <Copy className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Kodu Kopyala</span>
            </button>
            <button
              onClick={handleDownloadJson}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold border border-stone-700 transition-all flex items-center gap-1.5 cursor-pointer"
              title="JSON yedeğini indir"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">JSON İndir</span>
            </button>
            <button
              onClick={handleResetToDefaults}
              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-semibold border border-stone-700 transition-all flex items-center gap-1.5 cursor-pointer"
              title="İlk başlangıç ürünlerine geri dön"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sıfırla</span>
            </button>
            <button
              onClick={handleStartCreate}
              className="px-3.5 py-1.5 rounded-xl bg-[#9E4424] hover:bg-[#B34D28] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Yeni Ürün Ekle</span>
            </button>
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-400 hover:text-white flex items-center justify-center transition-all cursor-pointer ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* TOAST ALERT */}
        {toastMessage && (
          <div className="bg-emerald-700 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2 animate-in slide-in-from-top-2">
            <Check className="w-4 h-4" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* MAIN BODY: SPLIT VIEW (LIST & EDITOR) */}
        <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
          
          {/* LEFT COLUMN: PRODUCT LIST & SEARCH (4 or 5 Cols) */}
          <div className={`h-full flex flex-col border-r border-[#E8DEC8] bg-[#F7F3EB] ${editingProduct ? 'hidden lg:flex lg:col-span-4' : 'col-span-12'}`}>
            
            {/* Search & Filter Header */}
            <div className="p-3.5 border-b border-[#E8DEC8] bg-white space-y-2.5 shrink-0">
              <div className="relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Başlık, marka veya ID ile ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs text-stone-800 placeholder:text-stone-400 focus:outline-hidden focus:border-[#9E4424] transition-all"
                />
              </div>

              <div className="flex items-center justify-between gap-2">
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full py-1.5 px-2 bg-[#FAF8F5] border border-stone-200 rounded-lg text-xs text-stone-700 focus:outline-hidden font-medium"
                >
                  <option value="all">Tüm Kategoriler ({products.length})</option>
                  {CATEGORY_OPTIONS.map((c) => (
                    <option key={c.value} value={c.value}>{c.label}</option>
                  ))}
                </select>
                <span className="text-[11px] text-stone-500 font-bold shrink-0">
                  {filteredList.length} Ürün
                </span>
              </div>
            </div>

            {/* Scrollable Product Items */}
            <div className="flex-1 overflow-y-auto p-2.5 space-y-2 divide-y divide-stone-200/40">
              {filteredList.map((p) => {
                const isSelected = editingProduct?.id === p.id;
                return (
                  <div
                    key={p.id}
                    onClick={() => handleStartEdit(p)}
                    className={`p-2.5 rounded-2xl border transition-all cursor-pointer flex items-center gap-3 group ${
                      isSelected
                        ? 'bg-white border-[#9E4424] shadow-md ring-1 ring-[#9E4424]'
                        : 'bg-white/80 hover:bg-white border-stone-200/80 hover:border-stone-300 shadow-2xs'
                    }`}
                  >
                    {/* Thumbnail */}
                    <div className="w-14 h-14 rounded-xl bg-stone-100 overflow-hidden shrink-0 border border-stone-200 relative">
                      <img
                        src={p.images[0]}
                        alt={p.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <span className="absolute bottom-0.5 right-0.5 bg-black/70 text-white text-[9px] font-bold px-1 rounded">
                        {p.images.length}
                      </span>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 text-[10px] text-stone-500">
                        <span className="font-bold text-[#9E4424] uppercase">{p.brand}</span>
                        <span>•</span>
                        <span>{p.categoryLabel || p.category}</span>
                      </div>
                      <h4 className="font-bold text-xs text-stone-900 truncate group-hover:text-[#9E4424] transition-colors">
                        {p.title}
                      </h4>
                      <div className="flex items-center justify-between mt-1 text-xs">
                        <span className="font-bold text-stone-800 font-sans">
                          {p.price.toLocaleString('tr-TR')} TL
                        </span>
                        <span className="text-[10px] bg-amber-50 text-amber-800 px-1.5 py-0.5 rounded border border-amber-200 font-medium">
                          {p.story?.eraOrYear || 'Vintage'}
                        </span>
                      </div>
                    </div>

                    {/* Action */}
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteProduct(p.id, p.title);
                        }}
                        className="w-7 h-7 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 flex items-center justify-center transition-colors"
                        title="Sil"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* RIGHT COLUMN: FULL PRODUCT EDITOR (8 Cols or Full when active) */}
          <div className={`h-full flex flex-col bg-[#FAF8F5] ${editingProduct ? 'col-span-12 lg:col-span-8' : 'hidden lg:flex lg:col-span-8 items-center justify-center'}`}>
            {editingProduct ? (
              <div className="h-full flex flex-col overflow-hidden">
                
                {/* Editor Sub-Header */}
                <div className="px-5 py-3 bg-white border-b border-[#E8DEC8] flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2 min-w-0">
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="lg:hidden p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold"
                    >
                      ← Liste
                    </button>
                    <div>
                      <h3 className="font-bold text-sm text-stone-900 truncate">
                        {isCreatingNew ? '✨ Yeni Ürün Oluşturuluyor' : `✏️ Düzenleniyor: ${editingProduct.title}`}
                      </h3>
                      <span className="text-[11px] text-stone-500 font-mono">ID: {editingProduct.id}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingProduct(null)}
                      className="px-3 py-1.5 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 text-xs font-semibold transition-all cursor-pointer"
                    >
                      Vazgeç
                    </button>
                    <button
                      onClick={handleSaveCurrentProduct}
                      className="px-4 py-1.5 rounded-xl bg-[#9E4424] hover:bg-[#B34D28] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Kaydet</span>
                    </button>
                  </div>
                </div>

                {/* Editor Tabs */}
                <div className="px-5 pt-2.5 bg-white border-b border-stone-200/80 flex items-center gap-4 text-xs font-bold shrink-0">
                  <button
                    onClick={() => setActiveTab('images')}
                    className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                      activeTab === 'images'
                        ? 'border-[#9E4424] text-[#9E4424]'
                        : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <ImageIcon className="w-4 h-4" />
                    <span>Fotoğraflar & Galeri ({editingProduct.images.length})</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('basic')}
                    className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                      activeTab === 'basic'
                        ? 'border-[#9E4424] text-[#9E4424]'
                        : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <Tag className="w-4 h-4" />
                    <span>Temel Bilgiler & Fiyat</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('story')}
                    className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                      activeTab === 'story'
                        ? 'border-[#9E4424] text-[#9E4424]'
                        : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <Feather className="w-4 h-4" />
                    <span>Hatıra Pasaportu & Hikâye</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('seller')}
                    className={`pb-2.5 border-b-2 flex items-center gap-1.5 transition-colors cursor-pointer ${
                      activeTab === 'seller'
                        ? 'border-[#9E4424] text-[#9E4424]'
                        : 'border-transparent text-stone-500 hover:text-stone-800'
                    }`}
                  >
                    <Sliders className="w-4 h-4" />
                    <span>Satıcı & Kondisyon</span>
                  </button>
                </div>

                {/* Tab Content Body (Scrollable) */}
                <div className="flex-1 overflow-y-auto p-5 space-y-6">
                  
                  {/* TAB 1: IMAGES (USER SPECIFIC REQUEST: CHANGE / ADD / REMOVE PICTURES) */}
                  {activeTab === 'images' && (
                    <div className="space-y-6">
                      
                      {/* Image Upload / Add Section */}
                      <div className="p-4 rounded-2xl bg-white border border-[#E8DEC8] shadow-xs space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="font-bold text-xs text-stone-900 flex items-center gap-2">
                            <Plus className="w-4 h-4 text-[#9E4424]" />
                            <span>Yeni Görsel Ekle</span>
                          </h4>
                          <span className="text-[11px] text-stone-500">
                            Bilgisayarınızdan yükleyin veya internetten URL yapıştırın
                          </span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {/* File upload from device */}
                          <div>
                            <input
                              type="file"
                              ref={fileInputRef}
                              onChange={handleFileUpload}
                              accept="image/*"
                              multiple
                              className="hidden"
                              id="admin-image-upload"
                            />
                            <label
                              htmlFor="admin-image-upload"
                              className="w-full py-3 px-4 rounded-xl border-2 border-dashed border-stone-300 hover:border-[#9E4424] bg-stone-50 hover:bg-[#FAF5EE] text-stone-700 hover:text-[#9E4424] flex items-center justify-center gap-2 text-xs font-bold cursor-pointer transition-all"
                            >
                              <Upload className="w-4 h-4" />
                              <span>Bilgisayardan Fotoğraf Seç & Yükle</span>
                            </label>
                          </div>

                          {/* URL input */}
                          <div className="flex items-center gap-1.5">
                            <div className="relative flex-1">
                              <LinkIcon className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                              <input
                                type="url"
                                placeholder="Görsel URL bağlantısı (https://...)"
                                value={newImageUrl}
                                onChange={(e) => setNewImageUrl(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    e.preventDefault();
                                    handleAddImageUrl();
                                  }
                                }}
                                className="w-full pl-8 pr-3 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs text-stone-800 focus:outline-hidden focus:border-[#9E4424]"
                              />
                            </div>
                            <button
                              type="button"
                              onClick={handleAddImageUrl}
                              className="px-3 py-2 bg-[#9E4424] hover:bg-[#85361A] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                            >
                              Ekle
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Current Images Gallery */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="text-xs font-bold text-stone-900 block">
                            Mevcut Görseller ({editingProduct.images.length})
                          </label>
                          <span className="text-[11px] text-stone-500">
                            İlk görsel ürünün ana vitrin kapağıdır.
                          </span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {editingProduct.images.map((imgUrl, idx) => (
                            <div
                              key={idx}
                              className={`group relative rounded-2xl overflow-hidden border-2 bg-white shadow-xs aspect-square flex flex-col ${
                                idx === 0 ? 'border-[#9E4424] ring-2 ring-[#9E4424]/20' : 'border-stone-200'
                              }`}
                            >
                              <img
                                src={imgUrl}
                                alt={`Fotoğraf ${idx + 1}`}
                                className="w-full h-full object-cover"
                              />

                              {/* Index Badge */}
                              <div className="absolute top-2 left-2 bg-black/75 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow">
                                {idx === 0 ? '★ ANA KAPAK' : `#${idx + 1}`}
                              </div>

                              {/* Action Buttons Overlay */}
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                {idx !== 0 && (
                                  <button
                                    type="button"
                                    onClick={() => handleSetPrimaryImage(idx)}
                                    className="px-2.5 py-1 bg-white text-stone-900 hover:bg-[#9E4424] hover:text-white rounded-lg text-[10px] font-bold transition-all w-full text-center"
                                  >
                                    Ana Kapak Yap
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveImage(idx)}
                                  className="px-2.5 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold transition-all w-full flex items-center justify-center gap-1"
                                >
                                  <Trash2 className="w-3 h-3" />
                                  <span>Görseli Sil</span>
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: BASIC DETAILS */}
                  {activeTab === 'basic' && (
                    <div className="space-y-4">
                      {/* Title */}
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">Ürün Başlığı</label>
                        <input
                          type="text"
                          value={editingProduct.title}
                          onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                          className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-stone-900 focus:outline-hidden focus:border-[#9E4424]"
                        />
                      </div>

                      {/* Category & Brand & Size */}
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Kategori</label>
                          <select
                            value={editingProduct.category}
                            onChange={(e) => {
                              const cat = e.target.value as ProductCategory;
                              const found = CATEGORY_OPTIONS.find((c) => c.value === cat);
                              setEditingProduct({
                                ...editingProduct,
                                category: cat,
                                categoryLabel: found?.label || cat,
                              });
                            }}
                            className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800"
                          >
                            {CATEGORY_OPTIONS.map((c) => (
                              <option key={c.value} value={c.value}>{c.label}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Marka</label>
                          <input
                            type="text"
                            value={editingProduct.brand}
                            onChange={(e) => setEditingProduct({ ...editingProduct, brand: e.target.value })}
                            className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Beden / Ebat</label>
                          <input
                            type="text"
                            value={editingProduct.size || 'Tek Ebat'}
                            onChange={(e) => setEditingProduct({ ...editingProduct, size: e.target.value })}
                            className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800"
                          />
                        </div>
                      </div>

                      {/* Prices */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Satış Fiyatı (TL)</label>
                          <input
                            type="number"
                            value={editingProduct.price}
                            onChange={(e) => setEditingProduct({ ...editingProduct, price: Number(e.target.value) })}
                            className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs font-bold text-[#9E4424]"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Orijinal / Mağaza Fiyatı (TL)</label>
                          <input
                            type="number"
                            value={editingProduct.originalPrice || 0}
                            onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: Number(e.target.value) })}
                            className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-500"
                          />
                        </div>
                      </div>

                      {/* Description */}
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">Detaylı Ürün Açıklaması</label>
                        <textarea
                          rows={4}
                          value={editingProduct.description}
                          onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })}
                          className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs text-stone-800 leading-relaxed"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 3: STORY & PASSPORT */}
                  {activeTab === 'story' && (
                    <div className="space-y-4">
                      <div className="p-3 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs text-amber-900 flex items-center gap-2">
                        <Feather className="w-4 h-4 text-[#9E4424] shrink-0" />
                        <span>
                          Bu bölümdeki bilgiler <strong>Hatıra Pasaportu</strong> kartında mühürlü olarak alıcıya gösterilir.
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Dönem / Yıl (Örn: 1982)</label>
                          <input
                            type="text"
                            value={editingProduct.story?.eraOrYear || ''}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                story: { ...editingProduct.story!, eraOrYear: e.target.value },
                              })
                            }
                            className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Menşei Şehir (Örn: Kadıköy)</label>
                          <input
                            type="text"
                            value={editingProduct.story?.originCity || ''}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                story: { ...editingProduct.story!, originCity: e.target.value },
                              })
                            }
                            className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Yolculuk Rozeti (Badge)</label>
                          <input
                            type="text"
                            value={editingProduct.story?.travelBadge || ''}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                story: { ...editingProduct.story!, travelBadge: e.target.value },
                              })
                            }
                            className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">Öne Çıkan Hatıra Cümlesi (Quote)</label>
                        <input
                          type="text"
                          value={editingProduct.story?.memoryQuote || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              story: { ...editingProduct.story!, memoryQuote: e.target.value },
                            })
                          }
                          className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs italic"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">Detaylı Eşya Hikâyesi (Provenance)</label>
                        <textarea
                          rows={4}
                          value={editingProduct.story?.storyDetail || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              story: { ...editingProduct.story!, storyDetail: e.target.value },
                            })
                          }
                          className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs leading-relaxed"
                        />
                      </div>

                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">Satıcının Veda Notu (Mektup)</label>
                        <textarea
                          rows={3}
                          value={editingProduct.story?.sellerFarewell || ''}
                          onChange={(e) =>
                            setEditingProduct({
                              ...editingProduct,
                              story: { ...editingProduct.story!, sellerFarewell: e.target.value },
                            })
                          }
                          className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs leading-relaxed"
                        />
                      </div>
                    </div>
                  )}

                  {/* TAB 4: SELLER & CONDITION */}
                  {activeTab === 'seller' && (
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs font-bold text-stone-700 block mb-1">Kondisyon Seçimi</label>
                        <select
                          value={editingProduct.condition}
                          onChange={(e) => {
                            const val = e.target.value as ProductCondition;
                            const opt = CONDITION_OPTIONS.find((c) => c.value === val);
                            setEditingProduct({
                              ...editingProduct,
                              condition: val,
                              conditionType: opt?.type || 'az_kullanilmis',
                            });
                          }}
                          className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                        >
                          {CONDITION_OPTIONS.map((c) => (
                            <option key={c.value} value={c.value}>{c.label}</option>
                          ))}
                        </select>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Satıcı Adı</label>
                          <input
                            type="text"
                            value={editingProduct.seller?.name || ''}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                seller: { ...editingProduct.seller!, name: e.target.value },
                              })
                            }
                            className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                          />
                        </div>

                        <div>
                          <label className="text-xs font-bold text-stone-700 block mb-1">Satıcı Konumu</label>
                          <input
                            type="text"
                            value={editingProduct.seller?.location || ''}
                            onChange={(e) =>
                              setEditingProduct({
                                ...editingProduct,
                                seller: { ...editingProduct.seller!, location: e.target.value },
                              })
                            }
                            className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              </div>
            ) : (
              <div className="text-center p-8 space-y-3">
                <div className="w-16 h-16 rounded-3xl bg-[#FAF5EE] border border-[#E5DAC8] text-[#9E4424] flex items-center justify-center mx-auto shadow-sm">
                  <ImageIcon className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-lg text-stone-900">
                  Düzenlemek İstediğiniz Ürünü Seçin
                </h3>
                <p className="text-xs text-stone-500 max-w-md mx-auto font-sans leading-relaxed">
                  Sol taraftaki listeden herhangi bir eşyaya tıklayarak fotoğraflarını silebilir, yenilerini ekleyebilir veya başlık ve açıklamalarını değiştirebilirsiniz.
                </p>
                <button
                  onClick={handleStartCreate}
                  className="px-5 py-2.5 rounded-full bg-[#9E4424] hover:bg-[#85361A] text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  + Yeni Ürün Oluştur
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
