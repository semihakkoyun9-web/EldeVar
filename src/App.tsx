/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo, useEffect } from 'react';
import { TopBar } from './components/TopBar';
import { DesktopHeader } from './components/DesktopHeader';
import { DesktopSidebar } from './components/DesktopSidebar';
import { BottomNav, TabType } from './components/BottomNav';
import { ProductCard } from './components/ProductCard';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartView } from './components/CartView';
import { FavoritesView } from './components/FavoritesView';
import { MenuView } from './components/MenuView';
import { CheckoutModal } from './components/CheckoutModal';
import { SellerAddProductModal } from './components/SellerAddProductModal';
import { CategoriesModal } from './components/CategoriesModal';
import { ConditionFrameSelector } from './components/ConditionFrameSelector';
import { StandardFilterBar, StandardFilters } from './components/StandardFilterBar';
import { StoryPassportViewer } from './components/StoryPassportViewer';
import { CategoriesView } from './components/CategoriesView';
import { HomeBottomSection } from './components/HomeBottomSection';
import { WantedItemsView } from './components/WantedItemsView';

import { Product, ProductCategory, CartItem, Coupon, Order, NotificationItem, UserPreferences, ProductVariation, WantedItem, WantedOffer } from './types';
import { INITIAL_PRODUCTS, AVAILABLE_COUPONS, STANDARD_SIZES, STANDARD_BRANDS } from './data/mockData';
import { INITIAL_WANTED_ITEMS } from './data/mockWantedData';
import { ConditionKey, resolveConditionKey } from './utils/conditionTheme';
import { Sparkles, X, BookOpen, Feather, LayoutGrid, Grid3X3, ArrowUpDown, Compass, ArrowRight, ChevronRight, Search } from 'lucide-react';

function getInitialStorage<T>(key: string, fallback: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
}

function setStorage<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    console.error('LocalStorage save error:', e);
  }
}

export default function App() {
  // Desktop grid columns preference (3 or 4 columns)
  const [desktopCols, setDesktopCols] = useState<3 | 4>(3);

  // Products Catalog (with LocalStorage)
  const [products, setProducts] = useState<Product[]>(() =>
    getInitialStorage('eldevar_products', INITIAL_PRODUCTS)
  );

  // Standard Filters State
  const [standardFilters, setStandardFilters] = useState<StandardFilters>({
    category: 'all',
    size: 'all',
    brand: 'all',
    priceRange: 'all',
    sortBy: 'newest',
  });

  // Condition Frame Filter State (Dynamic frame coloring feature)
  const [selectedCondition, setSelectedCondition] = useState<ConditionKey | 'all'>('all');

  // Search Query
  const [searchQuery, setSearchQuery] = useState('');

  // Signature Feature: Memory Passport Modal
  const [selectedPassportProduct, setSelectedPassportProduct] = useState<Product | null>(null);

  // Navigation
  const [activeTab, setActiveTab] = useState<TabType>('home');

  // Favorites (with LocalStorage)
  const [favorites, setFavorites] = useState<string[]>(() =>
    getInitialStorage('eldevar_favorites', ['prod-1', 'prod-6', 'prod-3'])
  );

  // Cart (with LocalStorage)
  const [cart, setCart] = useState<CartItem[]>(() =>
    getInitialStorage('eldevar_cart', [
      {
        product: INITIAL_PRODUCTS[0], // Vintage Leather Bomber
        selectedVariation: INITIAL_PRODUCTS[0].variations?.[0],
        quantity: 1,
      },
    ])
  );
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(null);

  // Authenticated Member Account
  const customerEmail = 'semihakkoyun9@gmail.com';
  const sellerEmail = 'semihakkoyun9@gmail.com';

  // Orders History (with LocalStorage)
  const [orders, setOrders] = useState<Order[]>(() =>
    getInitialStorage('eldevar_orders', [])
  );

  // Wanted Items Feature (with LocalStorage)
  const [wantedItems, setWantedItems] = useState<WantedItem[]>(() =>
    getInitialStorage('eldevar_wanted_items', INITIAL_WANTED_ITEMS)
  );

  // Sync to LocalStorage
  useEffect(() => {
    setStorage('eldevar_products', products);
  }, [products]);

  useEffect(() => {
    setStorage('eldevar_cart', cart);
  }, [cart]);

  useEffect(() => {
    setStorage('eldevar_orders', orders);
  }, [orders]);

  useEffect(() => {
    setStorage('eldevar_favorites', favorites);
  }, [favorites]);

  useEffect(() => {
    setStorage('eldevar_wanted_items', wantedItems);
  }, [wantedItems]);

  // User Preferences
  const [preferences, setPreferences] = useState<UserPreferences>({
    clothingSize: 'M',
    shoeSize: '41',
    favoriteBrands: ["Levi's", 'Schott NYC', 'Sony', 'Yashica'],
    preferredCategories: ['giyim', 'elektronik'],
  });

  // Notifications
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif-1',
      title: 'EldeVar’a Hoş Geldiniz',
      message: 'Her eşyanın bir geçmişi, her alışverişin bir hikâyesi var. Keşfetmeye başlayın.',
      time: 'Şimdi',
      read: false,
      type: 'system',
    },
    {
      id: 'notif-2',
      title: 'Ücretsiz Kargo Ayrıcalığı',
      message: '750 TL ve üzeri siparişlerinizde sigortalı kargo tamamen ücretsiz.',
      time: '1 saat önce',
      read: true,
      type: 'system',
    },
  ]);

  // Modals
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSellerModalOpen, setIsSellerModalOpen] = useState(false);
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isCategoriesModalOpen, setIsCategoriesModalOpen] = useState(false);

  const handleAddWantedItem = (newItem: WantedItem) => {
    setWantedItems((prev) => [newItem, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: '✨ Arama İlanınız Yayınlandı!',
        message: `"${newItem.title}" için arama ilanı açıldı. Evinde bu eşyayı saklayan satıcılar teklif verdiğinde bilgilendirileceksiniz.`,
        time: 'Şimdi',
        read: false,
        type: 'system',
      },
      ...prev,
    ]);
  };

  const handleInstantBuyFromOffer = (wantedItem: WantedItem, offer: WantedOffer) => {
    const agreedProduct: Product = {
      id: `custom-deal-${Date.now()}`,
      title: `${wantedItem.title} (Özel Anlaşmalı Satış)`,
      category: wantedItem.category,
      categoryLabel: wantedItem.categoryLabel,
      price: offer.offerPrice,
      condition: offer.productCondition,
      brand: wantedItem.brand || 'Özel Koleksiyon',
      description: `${offer.description} (Güvenlik Kodu: ${offer.verificationCode} - %100 EldeVar Havuz Hesap Korumalı Özel Anlaşma)`,
      images: offer.photos && offer.photos.length > 0 ? offer.photos : wantedItem.sampleImages,
      seller: {
        id: offer.sellerId,
        name: offer.sellerName,
        email: 'satici@eldevar.com',
        avatar: offer.sellerAvatar,
        rating: offer.sellerRating,
        salesCount: 15,
        location: offer.sellerLocation,
      },
      ecoSavings: {
        co2Kg: 9.2,
        waterLiters: 1600,
      },
      shippingFee: 0,
      views: 1,
      likes: 1,
      createdAt: 'Bugün',
    };

    handleAddToCart(agreedProduct);
    setActiveTab('cart');

    setWantedItems((prev) =>
      prev.map((item) =>
        item.id === wantedItem.id ? { ...item, status: 'deal_made' as const } : item
      )
    );

    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: '🤝 Özel Güvenli İlan Oluşturuldu!',
        message: `${offer.sellerName} ile ${offer.offerPrice} TL fiyatta anlaştınız. Ürün sepetinize eklendi, Havuz Hesap korumasıyla siparişinizi güvenle tamamlayabilirsiniz.`,
        time: 'Az önce',
        read: false,
        type: 'offer',
      },
      ...prev,
    ]);
  };

  // Toggle Favorite
  const handleToggleFavorite = (productId: string) => {
    setFavorites((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  // Add To Cart (with variation fallback)
  const handleAddToCart = (product: Product, variation?: ProductVariation) => {
    const effectiveVariation =
      variation ||
      (product.isVariable && product.variations && product.variations.length > 0
        ? product.variations[0]
        : undefined);

    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedVariation?.id === effectiveVariation?.id
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex].quantity += 1;
        return updated;
      } else {
        return [...prev, { product, selectedVariation: effectiveVariation, quantity: 1 }];
      }
    });

    const newNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'Sepete Eklendi',
      message: `"${product.title}" sepetinize eklendi.`,
      time: 'Yeni',
      read: false,
      type: 'system',
    };
    setNotifications((n) => [newNotif, ...n]);
  };

  // Delete User Product
  const handleDeleteProduct = (productId: string) => {
    setProducts((prev) => prev.filter((p) => p.id !== productId));
    setCart((prev) => prev.filter((item) => item.product.id !== productId));
    setFavorites((prev) => prev.filter((id) => id !== productId));
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: 'İlan Kaldırıldı',
        message: 'İlanınız başarıyla mağazanızdan ve vitrinden kaldırıldı.',
        time: 'Şimdi',
        read: false,
        type: 'vendor',
      },
      ...prev,
    ]);
  };

  // Buy Now (Direct to checkout)
  const handleBuyNow = (product: Product, variation?: ProductVariation) => {
    handleAddToCart(product, variation);
    setIsCheckoutModalOpen(true);
  };

  // Cart quantity update
  const handleUpdateQuantity = (index: number, newQty: number) => {
    if (newQty < 1) return;
    setCart((prev) => {
      const updated = [...prev];
      updated[index].quantity = newQty;
      return updated;
    });
  };

  // Cart item remove
  const handleRemoveItem = (index: number) => {
    setCart((prev) => prev.filter((_, i) => i !== index));
  };

  // Apply Coupon
  const handleApplyCoupon = (code: string): { success: boolean; message: string } => {
    const found = AVAILABLE_COUPONS.find((c) => c.code.toUpperCase() === code.toUpperCase());
    if (!found) {
      return { success: false, message: 'Geçersiz kupon kodu. ELDEVAR10 deneyebilirsiniz.' };
    }

    const currentSubtotal = cart.reduce((acc, item) => {
      const price = item.selectedVariation ? item.selectedVariation.price : item.product.price;
      return acc + price * item.quantity;
    }, 0);

    if (currentSubtotal < found.minSpend) {
      return {
        success: false,
        message: `Bu kupon en az ${found.minSpend} TL alışverişlerde geçerlidir.`,
      };
    }

    setAppliedCoupon(found);
    return { success: true, message: `"${found.code}" kuponu başarıyla uygulandı!` };
  };

  // Add Product by Seller
  const handleAddVendorProduct = (newProd: Product) => {
    setProducts((prev) => [newProd, ...prev]);

    const vendorNotif: NotificationItem = {
      id: `notif-${Date.now()}`,
      title: 'İlanınız Yayında',
      message: `"${newProd.title}" hatıra pasaportuyla birlikte EldeVar pazaryerinde sergileniyor.`,
      time: 'Az önce',
      read: false,
      type: 'vendor',
    };
    setNotifications((n) => [vendorNotif, ...n]);
  };

  // Order Success (Havale/EFT)
  const handleOrderSuccess = (newOrder: Order) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCart([]);
    setAppliedCoupon(null);

    const emailNotif: NotificationItem = {
      id: `notif-ord-${Date.now()}`,
      title: `Sipariş #${newOrder.orderNumber} Alındı (Havale Bekleniyor)`,
      message: `Banka havalesi talimatları ve hatıra kartı gönderim bilgisi ${newOrder.customer.email} adresinize iletildi.`,
      time: 'Az önce',
      read: false,
      type: 'order',
    };
    setNotifications((n) => [emailNotif, ...n]);
  };

  // Reset all filters
  const handleResetFilters = () => {
    setStandardFilters({
      category: 'all',
      size: 'all',
      brand: 'all',
      priceRange: 'all',
      sortBy: 'newest',
    });
    setSelectedCondition('all');
    setSearchQuery('');
  };

  // Calculate condition counts
  const conditionCounts = useMemo(() => {
    const counts: Record<ConditionKey | 'all', number> = {
      all: products.length,
      yeni_gibi: 0,
      az_kullanilmis: 0,
      cok_kullanilmis: 0,
      vintage: 0,
    };
    products.forEach((p) => {
      const c = p.conditionType || resolveConditionKey(p.condition);
      counts[c] += 1;
    });
    return counts;
  }, [products]);

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<ProductCategory | 'all', number> = {
      all: products.length,
      giyim: 0,
      kadin: 0,
      erkek: 0,
      cocuk: 0,
      ayakkabi: 0,
      canta_aksesuar: 0,
      elektronik: 0,
      ev_yasam: 0,
    };
    products.forEach((p) => {
      if (counts[p.category] !== undefined) {
        counts[p.category] += 1;
      }
    });
    return counts;
  }, [products]);

  // Filter products by Standard Filters + Condition + Search Query
  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        // Category filter
        if (standardFilters.category !== 'all' && p.category !== standardFilters.category) {
          return false;
        }

        // Size filter
        if (standardFilters.size !== 'all') {
          const productSize = p.size || '';
          if (!productSize.toLowerCase().includes(standardFilters.size.toLowerCase())) {
            // Also check variation sizes if variable
            const hasVarMatch = p.variations?.some((v) =>
              v.size ? v.size.toLowerCase().includes(standardFilters.size.toLowerCase()) : false
            );
            if (!hasVarMatch) return false;
          }
        }

        // Brand filter
        if (standardFilters.brand !== 'all') {
          if (!p.brand.toLowerCase().includes(standardFilters.brand.toLowerCase())) {
            return false;
          }
        }

        // Price range filter
        if (standardFilters.priceRange !== 'all') {
          if (standardFilters.priceRange === '0-500' && p.price > 500) return false;
          if (standardFilters.priceRange === '500-1500' && (p.price < 500 || p.price > 1500)) return false;
          if (standardFilters.priceRange === '1500-3000' && (p.price < 1500 || p.price > 3000)) return false;
          if (standardFilters.priceRange === '3000+' && p.price < 3000) return false;
        }

        // Condition filter
        if (selectedCondition !== 'all') {
          const condKey = p.conditionType || resolveConditionKey(p.condition);
          if (condKey !== selectedCondition) return false;
        }

        // Search query filter (searches title, brand, description, and story details)
        const query = searchQuery.trim().toLowerCase();
        if (query) {
          const matches =
            p.title.toLowerCase().includes(query) ||
            p.brand.toLowerCase().includes(query) ||
            p.description.toLowerCase().includes(query) ||
            (p.passportCode && p.passportCode.toLowerCase().includes(query)) ||
            (p.story?.memoryQuote && p.story.memoryQuote.toLowerCase().includes(query)) ||
            (p.story?.originCity && p.story.originCity.toLowerCase().includes(query));
          if (!matches) return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (standardFilters.sortBy === 'price_asc') {
          return a.price - b.price;
        }
        if (standardFilters.sortBy === 'price_desc') {
          return b.price - a.price;
        }
        if (standardFilters.sortBy === 'likes') {
          return (b.likes || 0) - (a.likes || 0);
        }
        // newest
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [products, standardFilters, selectedCondition, searchQuery]);

  // Favorite products list
  const favoriteProducts = useMemo(() => {
    return products.filter((p) => favorites.includes(p.id));
  }, [products, favorites]);

  // Total cart items count & subtotal
  const cartCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((acc, item) => {
      const price = item.selectedVariation ? item.selectedVariation.price : item.product.price;
      return acc + price * item.quantity;
    }, 0);
  }, [cart]);

  const hasActiveFilters =
    standardFilters.category !== 'all' ||
    standardFilters.size !== 'all' ||
    standardFilters.brand !== 'all' ||
    standardFilters.priceRange !== 'all' ||
    selectedCondition !== 'all' ||
    searchQuery.trim() !== '';

  // User's own products listed on platform
  const userProducts = useMemo(() => {
    return products.filter(
      (p) => p.seller.email === sellerEmail || p.id.startsWith('prod-user-')
    );
  }, [products, sellerEmail]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-[#1C1917] flex flex-col font-sans selection:bg-[#9E4424]/15 selection:text-[#9E4424]">
      {/* 1A. DESKTOP HEADER (Visible on desktop screens) */}
      <div className="hidden lg:block">
        <DesktopHeader
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={standardFilters.category}
          onSelectCategory={(cat) => {
            setStandardFilters((prev) => ({ ...prev, category: cat }));
          }}
          activeTab={activeTab}
          onTabChange={setActiveTab}
          favoritesCount={favorites.length}
          cartCount={cartCount}
          cartSubtotal={cartSubtotal}
          notifications={notifications}
          onOpenSellerModal={() => setIsSellerModalOpen(true)}
          onOpenPassportSample={() => setSelectedPassportProduct(products[0])}
        />
      </div>

      {/* 1B. MOBILE TOP BAR (Visible on mobile screens) */}
      <div className="lg:hidden">
        <TopBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={standardFilters.category}
          onSelectCategory={(cat) => {
            setStandardFilters((prev) => ({ ...prev, category: cat }));
          }}
          notifications={notifications}
          onOpenCategoriesModal={() => setIsCategoriesModalOpen(true)}
          onNavigateHome={() => setActiveTab('home')}
        />
      </div>

      {/* 2. MAIN VIEW CONTENT */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <div>
            {/* ========================================================= */}
            {/* A. DESKTOP WEB HOMEPAGE (GENİŞ & FERAH DOLAP / ELDEVAR DÜZENİ) */}
            {/* Filtreler ana sayfada YOKTUR; Kategoriler butonuna basınca gidecektir */}
            {/* ========================================================= */}
            <div className="max-w-7xl mx-auto px-6 py-8 pb-16 hidden lg:block space-y-12">
              {/* 1. EDITORIAL HERO WITH LIVING HISTORY SHOWCASE CARD */}
              <section className="bg-gradient-to-br from-[#FAF5EE] via-[#FDFBF7] to-[#F5ECE0] rounded-3xl border border-[#E8DEC8] p-8 xl:p-10 shadow-xs relative overflow-hidden">
                <div className="grid grid-cols-12 gap-8 items-center">
                  {/* Sol: Manşet & Felsefe */}
                  <div className="col-span-7 space-y-6">
                    <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/95 border border-[#E2DBD0] text-[#9E4424] text-xs font-bold uppercase tracking-wider shadow-2xs">
                      <span className="w-2 h-2 rounded-full bg-[#9E4424]" />
                      <span>Sürdürülebilir İkinci El & Hafıza Döngüsü</span>
                    </div>

                    <div className="space-y-3">
                      <h1 className="text-3xl xl:text-5xl font-serif font-black text-[#1C1917] tracking-tight leading-[1.15]">
                        "Eski hikâyeler yeni sahibiyle canlanıyor."
                      </h1>
                      <p className="text-sm xl:text-base text-stone-600 leading-relaxed font-sans max-w-xl">
                        Tüketim çağının seri üretim nesneleri yerine, özenle korunmuş ve ruhu olan eşyaları buluşturuyoruz. EldeVar'da her parça, önceki sahibinin hatıra mektubu ve mum mühürlü hafıza pasaportuyla kapınıza gelir.
                      </p>
                    </div>

                    {/* Ana Butonlar */}
                    <div className="flex items-center gap-3.5 pt-1">
                      <button
                        onClick={() => setActiveTab('categories')}
                        className="px-6 py-3.5 rounded-full bg-[#9E4424] hover:bg-[#85361A] text-white font-bold text-xs xl:text-sm shadow-md hover:shadow-lg transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                      >
                        <span>Koleksiyonu Keşfet</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => setActiveTab('wanted')}
                        className="px-5 py-3.5 rounded-full bg-white hover:bg-stone-50 border border-[#DFCBB6] text-[#8C3F23] font-bold text-xs xl:text-sm shadow-2xs hover:shadow-xs transition-all active:scale-95 cursor-pointer flex items-center gap-2"
                      >
                        <Search className="w-4 h-4 text-[#9E4424]" />
                        <span>Bunu Arıyorum İlanı Aç</span>
                      </button>
                    </div>

                    {/* 3 Güven Rozeti */}
                    <div className="grid grid-cols-3 gap-3 pt-6 border-t border-[#E8DACB]/80 max-w-lg">
                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center text-sm font-bold shadow-2xs shrink-0">
                          🍃
                        </span>
                        <div>
                          <div className="font-bold text-xs text-stone-900">1.850+ kg</div>
                          <div className="text-[11px] text-stone-500">CO₂ Tasarrufu</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center text-sm font-bold shadow-2xs shrink-0">
                          📜
                        </span>
                        <div>
                          <div className="font-bold text-xs text-stone-900">Mum Mühürlü</div>
                          <div className="text-[11px] text-stone-500">Hatıra Zarfı</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <span className="w-8 h-8 rounded-xl bg-[#FAF0E6] text-[#9E4424] flex items-center justify-center text-sm font-bold shadow-2xs shrink-0">
                          🛡️
                        </span>
                        <div>
                          <div className="font-bold text-xs text-stone-900">%100 Güvenli</div>
                          <div className="text-[11px] text-stone-500">Havuz Hesap</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Sağ: Seçkin Hikâye Örneği Vitrin Kartı */}
                  <div className="col-span-5">
                    {products[0] && (
                      <div className="bg-white rounded-3xl p-5 border border-[#E5DAC8] shadow-md hover:shadow-xl transition-all relative overflow-hidden group">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-[#E8DEC8]">
                          <img
                            src={products[0].images[0]}
                            alt={products[0].title}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          />
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 rounded-full bg-[#1C1917]/85 backdrop-blur-xs text-[#FAF5ED] border border-white/20 text-[11px] font-bold flex items-center gap-1.5 shadow-sm">
                              <Feather className="w-3.5 h-3.5 text-amber-400" />
                              <span>{products[0].story?.travelBadge || "90'lar Hatırası"}</span>
                            </span>
                          </div>
                          <div className="absolute top-3 right-3">
                            <span className="px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-xs text-[#9E4424] border border-[#E8DEC8] text-xs font-extrabold shadow-2xs">
                              {products[0].price.toLocaleString('tr-TR')} TL
                            </span>
                          </div>
                        </div>

                        <div className="pt-4 space-y-2">
                          <div className="flex items-center justify-between text-xs text-stone-500">
                            <span className="font-bold uppercase tracking-wider text-[#9E4424] text-[10px]">
                              {products[0].brand} • {products[0].categoryLabel}
                            </span>
                            <span>{products[0].story?.originCity}</span>
                          </div>
                          <h3 className="font-serif font-bold text-base text-stone-900 line-clamp-1">
                            {products[0].title}
                          </h3>
                          {products[0].story && (
                            <p className="text-xs text-stone-600 italic line-clamp-2 bg-[#FAF8F5] p-2.5 rounded-xl border border-[#F0EAE1]">
                              "{products[0].story.memoryQuote}"
                            </p>
                          )}
                          <div className="pt-2 flex items-center gap-2">
                            <button
                              onClick={() => setSelectedPassportProduct(products[0])}
                              className="flex-1 py-2.5 px-3 rounded-xl bg-[#FAF4ED] hover:bg-[#F3E7D7] border border-[#DFCBB6] text-[#8C3F23] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-[#9E4424]" />
                              <span>Hafıza Pasaportunu Gör</span>
                            </button>
                            <button
                              onClick={() => setSelectedProduct(products[0])}
                              className="py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-[#9E4424] text-white font-bold text-xs transition-colors cursor-pointer"
                            >
                              İncele
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </section>

              {/* 2. DEDICATED "BUNU ARIYORUM" DEMAND BAR (Temiz, Canlı & Prestijli) */}
              <section className="bg-white rounded-3xl p-6 xl:p-8 border border-[#E8E2D8] shadow-2xs space-y-5">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase tracking-wider text-[#9E4424] bg-[#FAF3E8] px-2.5 py-0.5 rounded-full border border-[#EBD6C3]">
                        Bunu Arıyorum
                      </span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-xs font-bold text-emerald-700">Canlı Talep Ağı</span>
                    </div>
                    <h2 className="text-xl xl:text-2xl font-serif font-black text-stone-900">
                      Evinde sakladığın eşyayı arayanlar var
                    </h2>
                    <p className="text-xs text-stone-500">
                      Alıcılar aradıkları kriterleri ve bütçelerini ilan etti. Elinde olanlar güvenli chat üzerinden anında teklif veriyor.
                    </p>
                  </div>

                  <button
                    onClick={() => setActiveTab('wanted')}
                    className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-[#9E4424] hover:text-[#85361A] bg-[#FAF4ED] hover:bg-[#F4ECE0] border border-[#E7D7C1] px-4 py-2.5 rounded-full transition-all cursor-pointer shadow-2xs"
                  >
                    <span>Tüm Talepleri Gör & İlan Aç</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* 3 Örnek Talep Kartı */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {wantedItems.slice(0, 3).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setActiveTab('wanted')}
                      className="p-4 rounded-2xl border border-[#EFE8DD] bg-[#FAF8F5] hover:bg-[#FAF4ED] hover:border-[#DFCBB6] transition-all cursor-pointer group flex flex-col justify-between"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] text-stone-400">
                          <span className="font-semibold text-[#8C3F23]">{item.categoryLabel}</span>
                          <span className="px-2 py-0.5 rounded-full bg-white border border-[#EAE4D9] text-stone-600 font-bold">
                            {item.offersCount} Teklif
                          </span>
                        </div>
                        <h4 className="font-serif font-bold text-stone-900 text-sm group-hover:text-[#9E4424] transition-colors line-clamp-1">
                          {item.title}
                        </h4>
                        <p className="text-xs text-stone-600 line-clamp-2 italic">
                          "{item.storyWhy}"
                        </p>
                      </div>

                      <div className="mt-4 pt-3 border-t border-[#EDE5D8] flex items-center justify-between text-xs">
                        <div>
                          <span className="text-[10px] text-stone-400 block">Hedef Bütçe:</span>
                          <span className="font-extrabold text-stone-900">
                            {item.targetBudgetMin.toLocaleString('tr-TR')} - {item.targetBudgetMax.toLocaleString('tr-TR')} TL
                          </span>
                        </div>
                        <span className="font-bold text-[#9E4424] text-[11px] group-hover:translate-x-0.5 transition-transform flex items-center gap-1">
                          <span>Bende Var!</span>
                          <ChevronRight className="w-3 h-3" />
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. ÖNE ÇIKAN EŞYALAR (Kondisyon Filtre Hapları & Ferah Grid) */}
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-[#E8E2D8]">
                  <div>
                    <h2 className="text-2xl xl:text-3xl font-serif font-black text-stone-900 tracking-tight">
                      Öne Çıkan Seçkiler
                    </h2>
                    <p className="text-xs sm:text-sm text-stone-500 font-sans mt-0.5">
                      Her biri hatıra pasaportuyla korunan, özenle seçilmiş döngüsel parçalar
                    </p>
                  </div>

                  {/* Kondisyon Çerçeve Hapları */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {[
                      { id: 'all', label: 'Tüm Kondisyonlar' },
                      { id: 'yeni_gibi', label: 'Yeni Gibi (Kusursuz)' },
                      { id: 'az_kullanilmis', label: 'Az Kullanılmış' },
                      { id: 'vintage', label: 'Vintage & Koleksiyonluk' },
                    ].map((tab) => {
                      const isSelected = selectedCondition === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setSelectedCondition(tab.id as ConditionKey | 'all')}
                          className={`px-3.5 py-1.5 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer ${
                            isSelected
                              ? 'bg-stone-900 text-white font-bold shadow-xs'
                              : 'bg-white hover:bg-stone-50 text-stone-700 border border-[#E5DDD1] hover:border-[#9E4424] hover:text-[#9E4424]'
                          }`}
                        >
                          {tab.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Geniş 4-Kolonlu Ürün Izgarası */}
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredProducts.slice(0, 8).map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      isFavorite={favorites.includes(product.id)}
                      onToggleFavorite={handleToggleFavorite}
                      onSelectProduct={setSelectedProduct}
                      onQuickAddToCart={(prod) => handleAddToCart(prod)}
                      activeConditionFilter={selectedCondition}
                      onOpenPassport={(prod) => setSelectedPassportProduct(prod)}
                    />
                  ))}
                </div>

                {/* Tüm Kategorilere Git Butonu */}
                <div className="text-center pt-4">
                  <button
                    onClick={() => setActiveTab('categories')}
                    className="px-8 py-3.5 rounded-full bg-white hover:bg-[#FAF4ED] border-2 border-[#9E4424] text-[#9E4424] font-bold text-xs sm:text-sm shadow-xs hover:shadow-sm transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <Compass className="w-4 h-4" />
                    <span>Tüm Kategorileri ve Filtreleri İncele ({products.length} Eşya)</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ========================================================= */}
            {/* B. MOBİL UYGULAMA ARAYÜZÜ (Kullanıcının İstediği Orijinal Akış) */}
            {/* ========================================================= */}
            <div className="max-w-2xl mx-auto px-4 sm:px-6 py-5 pb-12 space-y-5 lg:hidden">
              <section className="pt-1 pb-1">
                <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1C1917] tracking-tight mb-2">
                  "Eski hikâyeler yeni sahibiyle canlanıyor."
                </h1>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed font-sans">
                  Tüketim çağının seri üretim nesneleri yerine, özenle kullanılmış ve hafızası olan eşyaları koruyoruz.
                  EldeVar'da aldığınız her parça, önceki sahibinin hatıra notuyla gelir ve evinizde yeni bir hikâye başlatır.
                </p>
              </section>

              {/* Eşya Hafıza Pasaportu Vurgusu */}
              <section className="p-3.5 rounded-2xl bg-[#FAF4ED] border border-[#EBD6C3] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-white text-[#9E4424] shadow-2xs border border-[#E2DBD0] shrink-0">
                    <BookOpen className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-serif font-bold text-stone-900 text-xs sm:text-sm flex items-center gap-2">
                      <span>Eşya Hafıza Pasaportu</span>
                      <span className="text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#9E4424] text-white">
                        EldeVar'a Özel
                      </span>
                    </div>
                    <p className="text-stone-600 mt-0.5 leading-normal text-[11px]">
                      Her ürünün önceki sahibinin yazdığı veda mektubu ve karbon sertifikası mum mühürle gelir.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedPassportProduct(products[0])}
                  className="w-full sm:w-auto px-3.5 py-1.5 bg-white border border-[#DFCBB6] text-[#8E3F23] font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-2xs cursor-pointer"
                >
                  <Feather className="w-3.5 h-3.5 text-[#9E4424]" />
                  <span>Örnek Pasaportu Gör</span>
                </button>
              </section>

              {/* Mobil Kategoriler Butonu */}
              <div className="flex items-center justify-between border-b border-[#E8E2D8] pb-2">
                <div>
                  <h2 className="text-sm font-serif font-bold text-[#1C1917]">
                    Öne Çıkan Eşyalar
                  </h2>
                  <p className="text-[11px] text-stone-500 font-sans">
                    Kendini keşfet, stilini yarat
                  </p>
                </div>
                <button
                  onClick={() => setActiveTab('categories')}
                  className="text-xs font-bold text-[#9E4424] flex items-center gap-1 hover:underline cursor-pointer"
                >
                  <span>Kategoriler & Filtreler</span>
                  <ChevronRight className="w-3 h-3" />
                </button>
              </div>

              {/* Mobil Ürünler Izgarası */}
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {products.slice(0, 10).map((product) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    isFavorite={favorites.includes(product.id)}
                    onToggleFavorite={handleToggleFavorite}
                    onSelectProduct={setSelectedProduct}
                    onQuickAddToCart={(prod) => handleAddToCart(prod)}
                    activeConditionFilter={selectedCondition}
                    onOpenPassport={(prod) => setSelectedPassportProduct(prod)}
                  />
                ))}
              </div>
            </div>

            {/* ========================================================= */}
            {/* C. KULLANICININ İSTEDİĞİ GÖRSEL EN ALT KISIM (HomeBottomSection) */}
            {/* Kazanç Bannerı, Popüler Kategoriler, Markalar, 3 Güven Kartı & Footer */}
            {/* ========================================================= */}
            <HomeBottomSection
              onOpenSellerModal={() => setIsSellerModalOpen(true)}
              onNavigateCategory={(cat, keyword) => {
                setStandardFilters((prev) => ({
                  ...prev,
                  category: cat,
                  brand: 'all',
                }));
                if (keyword) {
                  setSearchQuery(keyword);
                }
                setActiveTab('categories');
              }}
              onSelectBrand={(brand) => {
                setStandardFilters((prev) => ({
                  ...prev,
                  brand,
                }));
                setActiveTab('categories');
              }}
            />
          </div>
        )}

        {/* 3. KULLANICININ İSTEDİĞİ KATEGORİLER & SOL FİLTRE SAYFASI */}
        {activeTab === 'categories' && (
          <CategoriesView
            products={products}
            filteredProducts={filteredProducts}
            standardFilters={standardFilters}
            onFilterChange={(key, value) => {
              setStandardFilters((prev) => ({ ...prev, [key]: value }));
            }}
            onResetFilters={handleResetFilters}
            selectedCondition={selectedCondition}
            onSelectCondition={setSelectedCondition}
            conditionCounts={conditionCounts}
            categoryCounts={categoryCounts}
            availableBrands={STANDARD_BRANDS}
            availableSizes={STANDARD_SIZES}
            favorites={favorites}
            onToggleFavorite={handleToggleFavorite}
            onSelectProduct={setSelectedProduct}
            onQuickAddToCart={(prod) => handleAddToCart(prod)}
            onOpenPassport={(prod) => setSelectedPassportProduct(prod)}
            onOpenPassportSample={() => setSelectedPassportProduct(products[0])}
            onOpenAdvancedModal={() => setIsCategoriesModalOpen(true)}
            onNavigateHome={() => setActiveTab('home')}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
          />
        )}

        {activeTab === 'wanted' && (
          <WantedItemsView
            wantedItems={wantedItems}
            onAddWantedItem={handleAddWantedItem}
            onInstantBuyFromOffer={handleInstantBuyFromOffer}
            onNavigateHome={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'favorites' && (
          <FavoritesView
            favoriteProducts={favoriteProducts}
            onToggleFavorite={handleToggleFavorite}
            onSelectProduct={setSelectedProduct}
            onQuickAddToCart={(prod) => handleAddToCart(prod)}
            onContinueShopping={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'cart' && (
          <CartView
            cart={cart}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={() => setCart([])}
            appliedCoupon={appliedCoupon}
            onApplyCoupon={handleApplyCoupon}
            onRemoveCoupon={() => setAppliedCoupon(null)}
            onProceedToCheckout={() => setIsCheckoutModalOpen(true)}
            onContinueShopping={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'menu' && (
          <MenuView
            customerEmail={customerEmail}
            sellerEmail={sellerEmail}
            orders={orders}
            preferences={preferences}
            onUpdatePreferences={setPreferences}
            onOpenSellerModal={() => setIsSellerModalOpen(true)}
            onNavigateHome={() => setActiveTab('home')}
            userProducts={userProducts}
            onDeleteProduct={handleDeleteProduct}
          />
        )}
      </main>

      {/* 3. MOBILE-FIRST FIXED BOTTOM BAR (Visible only on mobile) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        favoritesCount={favorites.length}
        cartCount={cartCount}
        onOpenSellerModal={() => setIsSellerModalOpen(true)}
        className="lg:hidden"
      />

      {/* 4. KAPSAMLI STANDART KATEGORİ & FİLTRELER MODALI */}
      <CategoriesModal
        isOpen={isCategoriesModalOpen}
        onClose={() => setIsCategoriesModalOpen(false)}
        selectedCategory={standardFilters.category}
        onSelectCategory={(cat) => setStandardFilters((prev) => ({ ...prev, category: cat }))}
        selectedSize={standardFilters.size}
        onSelectSize={(size) => setStandardFilters((prev) => ({ ...prev, size }))}
        selectedBrand={standardFilters.brand}
        onSelectBrand={(brand) => setStandardFilters((prev) => ({ ...prev, brand }))}
        priceRange={standardFilters.priceRange}
        onSelectPriceRange={(priceRange) => setStandardFilters((prev) => ({ ...prev, priceRange }))}
        selectedCondition={selectedCondition}
        onSelectCondition={setSelectedCondition}
        onResetAll={handleResetFilters}
        matchingCount={filteredProducts.length}
      />

      {/* 5. ÜRÜN DETAY MODALI */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        isFavorite={selectedProduct ? favorites.includes(selectedProduct.id) : false}
        onToggleFavorite={handleToggleFavorite}
        onAddToCart={handleAddToCart}
        onBuyNow={handleBuyNow}
        onOpenPassport={(prod) => setSelectedPassportProduct(prod)}
      />

      {/* 6. SİTEYE ÖZGÜ İMZA ÖZELLİK: EŞYA HAFIZA PASAPORTU & MEKTUP GÖRÜNTÜLEYİCİ */}
      <StoryPassportViewer
        isOpen={!!selectedPassportProduct}
        product={selectedPassportProduct}
        onClose={() => setSelectedPassportProduct(null)}
        onSelectProduct={(prod: Product) => {
          setSelectedPassportProduct(null);
          setSelectedProduct(prod);
        }}
      />

      {/* 7. SATICI ÜRÜN & HATIRA EKLEME MODALI */}
      <SellerAddProductModal
        isOpen={isSellerModalOpen}
        onClose={() => setIsSellerModalOpen(false)}
        sellerEmail={sellerEmail}
        onUpdateSellerEmail={() => {}}
        onAddProduct={handleAddVendorProduct}
      />

      {/* 8. CHECKOUT MODALI (Havale / EFT) */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cart={cart}
        appliedCoupon={appliedCoupon}
        customerEmail={customerEmail}
        onOrderSuccess={handleOrderSuccess}
      />
    </div>
  );
}
