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
import { CookieBanner } from './components/CookieBanner';
import { ContactModal } from './components/ContactModal';
import { FaqModal } from './components/FaqModal';
import { MakeOfferModal } from './components/MakeOfferModal';
import { MemoryBoxModal } from './components/MemoryBoxModal';
import { AuthModal } from './components/AuthModal';

import { Product, ProductCategory, CartItem, Coupon, Order, NotificationItem, UserPreferences, ProductVariation, WantedItem, WantedOffer, ProductOffer, KeepsakeItem, AuthUser, DEFAULT_AUTH_USER } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, AVAILABLE_COUPONS, STANDARD_SIZES, STANDARD_BRANDS, INITIAL_OFFERS, INITIAL_KEEPSAKES } from './data/mockData';
import { INITIAL_WANTED_ITEMS } from './data/mockWantedData';
import { ConditionKey, resolveConditionKey } from './utils/conditionTheme';
import { Sparkles, X, BookOpen, Feather, LayoutGrid, Grid3X3, ArrowUpDown, Compass, ArrowRight, ChevronRight, Search } from 'lucide-react';
import { WordPressBridge } from './services/wpBridge';

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
  const [products, setProducts] = useState<Product[]>(() => {
    const saved = getInitialStorage<Product[]>('eldevar_products_v10_perspectives', []);
    if (saved && saved.length > 0) {
      const userCustom = saved.filter(
        (p) => p.id.startsWith('prod-user-') || p.id.startsWith('custom-deal-')
      );
      return [...userCustom, ...INITIAL_PRODUCTS];
    }
    const oldSaved = getInitialStorage<Product[]>('eldevar_products', []);
    const userCustomProducts = oldSaved.filter(
      (p) => p.id.startsWith('prod-user-') || p.id.startsWith('custom-deal-')
    );
    return [...userCustomProducts, ...INITIAL_PRODUCTS];
  });

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

  // Authenticated Member Account (with LocalStorage)
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() =>
    getInitialStorage<AuthUser | null>('eldevar_auth_user', DEFAULT_AUTH_USER)
  );
  const customerEmail = currentUser?.email || 'misafir@eldevar.com';
  const sellerEmail = currentUser?.email || 'semihakkoyun9@gmail.com';

  // Auth Modal State
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authTriggerReason, setAuthTriggerReason] = useState<'create_listing' | 'general' | 'offer' | 'memory_box'>('general');
  const [pendingActionAfterAuth, setPendingActionAfterAuth] = useState<(() => void) | null>(null);

  const handleLoginSuccess = (user: AuthUser) => {
    setCurrentUser(user);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: `✨ Hoş Geldiniz, ${user.name}!`,
        message: 'EldeVar hesabınızla başarıyla oturum açtınız. Artık ilan verebilir ve eşya hatıralarını saklayabilirsiniz.',
        time: 'Şimdi',
        read: false,
        type: 'system',
      },
      ...prev,
    ]);
    if (pendingActionAfterAuth) {
      const act = pendingActionAfterAuth;
      setPendingActionAfterAuth(null);
      act();
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setNotifications((prev) => [
      {
        id: `notif-${Date.now()}`,
        title: '👋 Güvenli Çıkış Yapıldı',
        message: 'Oturumunuz başarıyla kapatıldı. Misafir modundasınız.',
        time: 'Şimdi',
        read: false,
        type: 'system',
      },
      ...prev,
    ]);
  };

  const handleOpenSellerModalGuarded = () => {
    if (!currentUser) {
      setAuthTriggerReason('create_listing');
      setPendingActionAfterAuth(() => () => setIsSellerModalOpen(true));
      setIsAuthModalOpen(true);
      return;
    }
    setIsSellerModalOpen(true);
  };

  // Orders History (with LocalStorage - Kural 12: En az 3 test siparişi)
  const [orders, setOrders] = useState<Order[]>(() => {
    const saved = getInitialStorage<Order[]>('eldevar_orders', []);
    return saved && saved.length > 0 ? saved : INITIAL_ORDERS;
  });

  // Kurumsal & Yasal Modallar (Kural 7, 8 ve Dokan)
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [globalLegalModal, setGlobalLegalModal] = useState<string | null>(null);

  // Offers State (Pazarlık & Fiyat Teklifleri)
  const [offers, setOffers] = useState<ProductOffer[]>(() =>
    getInitialStorage('eldevar_product_offers', INITIAL_OFFERS)
  );
  const [isOfferModalOpen, setIsOfferModalOpen] = useState(false);
  const [offerTargetProduct, setOfferTargetProduct] = useState<Product | null>(null);

  // Keepsakes State (Hatıra Kutusu & Emanet Sandığı - Fiyatsız)
  const [keepsakes, setKeepsakes] = useState<KeepsakeItem[]>(() =>
    getInitialStorage('eldevar_keepsakes', INITIAL_KEEPSAKES)
  );
  const [isMemoryBoxOpen, setIsMemoryBoxOpen] = useState(false);

  // Wanted Items Feature (with LocalStorage)
  const [wantedItems, setWantedItems] = useState<WantedItem[]>(() =>
    getInitialStorage('eldevar_wanted_items', INITIAL_WANTED_ITEMS)
  );

  // Sync to LocalStorage
  useEffect(() => {
    setStorage('eldevar_products_v10_perspectives', products);
    setStorage('eldevar_products', products);
  }, [products]);

  useEffect(() => {
    if (currentUser) {
      setStorage('eldevar_auth_user', currentUser);
    } else {
      localStorage.removeItem('eldevar_auth_user');
    }
  }, [currentUser]);

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
    setStorage('eldevar_product_offers', offers);
  }, [offers]);

  useEffect(() => {
    setStorage('eldevar_keepsakes', keepsakes);
  }, [keepsakes]);

  useEffect(() => {
    setStorage('eldevar_wanted_items', wantedItems);
  }, [wantedItems]);

  // Sync with WordPress REST API if running in WordPress environment
  useEffect(() => {
    if (WordPressBridge.isWordPress()) {
      WordPressBridge.fetchProducts().then((wpProducts) => {
        if (wpProducts && wpProducts.length > 0) {
          setProducts(wpProducts);
        }
      });
      WordPressBridge.fetchWantedItems().then((wpWanted) => {
        if (wpWanted && wpWanted.length > 0) {
          setWantedItems(wpWanted);
        }
      });
    }
  }, []);

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
    if (WordPressBridge.isWordPress()) {
      WordPressBridge.createWantedItem(newItem);
    }
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
    if (WordPressBridge.isWordPress()) {
      WordPressBridge.createProduct(newProd);
    }

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
    if (WordPressBridge.isWordPress()) {
      WordPressBridge.createOrder(newOrder);
    }

    // Satın alınan ürünleri Hatıra Kutusuna otomatik ekle (Fiyatsız, anılarıyla)
    newOrder.items.forEach((item) => {
      const p = item.product;
      const newKeepsake: KeepsakeItem = {
        id: `keep-ord-${Date.now()}-${p.id}`,
        productId: p.id,
        title: p.title,
        image: p.images[0],
        brand: p.brand,
        categoryLabel: p.categoryLabel,
        passportCode: p.passportCode,
        eraOrYear: p.story?.eraOrYear,
        originCity: p.story?.originCity,
        travelBadge: p.story?.travelBadge,
        sellerFarewell: p.story?.sellerFarewell,
        sellerName: p.seller.name,
        acquiredDate: 'Bugün',
      };
      setKeepsakes((prevKeepsakes) => [newKeepsake, ...prevKeepsakes]);
    });

    const emailNotif: NotificationItem = {
      id: `notif-ord-${Date.now()}`,
      title: `Sipariş #${newOrder.orderNumber} Alındı (Havale Bekleniyor)`,
      message: `Banka havalesi talimatları ve hatıra kartı gönderim bilgisi ${newOrder.customer.email} adresinize iletildi. Eşyalarınız Hatıra Kutunuza eklendi.`,
      time: 'Az önce',
      read: false,
      type: 'order',
    };
    setNotifications((n) => [emailNotif, ...n]);
  };

  // Offer handlers
  const handleOpenMakeOffer = (product: Product) => {
    setOfferTargetProduct(product);
    setIsOfferModalOpen(true);
  };

  const handleCreateOffer = (newOfferData: Omit<ProductOffer, 'id' | 'createdAt' | 'status'>) => {
    const newOffer: ProductOffer = {
      ...newOfferData,
      id: `offer-${Date.now()}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };
    setOffers((prev) => [newOffer, ...prev]);
    setNotifications((prev) => [
      {
        id: `notif-offer-${Date.now()}`,
        title: '💬 Yeni Fiyat Teklifi Alındı',
        message: `${newOffer.buyerName}, "${newOffer.productTitle}" için ${newOffer.offeredPrice} TL teklif sundu (%${newOffer.discountPercentage} indirim).`,
        time: 'Az önce',
        read: false,
        type: 'offer',
      },
      ...prev,
    ]);
  };

  const handleAcceptOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'accepted' as const } : o))
    );
  };

  const handleRejectOffer = (offerId: string) => {
    setOffers((prev) =>
      prev.map((o) => (o.id === offerId ? { ...o, status: 'rejected' as const } : o))
    );
  };

  const handleAddKeepsakeNote = (keepsakeId: string, note: string) => {
    setKeepsakes((prev) =>
      prev.map((k) => (k.id === keepsakeId ? { ...k, buyerPersonalNote: note } : k))
    );
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
          onOpenSellerModal={handleOpenSellerModalGuarded}
          onOpenPassportSample={() => setSelectedPassportProduct(products[0])}
          onOpenMemoryBox={() => setIsMemoryBoxOpen(true)}
          currentUser={currentUser}
          onOpenAuthModal={() => {
            setAuthTriggerReason('general');
            setIsAuthModalOpen(true);
          }}
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
          onOpenSellerModal={handleOpenSellerModalGuarded}
          onNavigateFavorites={() => setActiveTab('favorites')}
          onNavigateMenu={() => setActiveTab('menu')}
          onOpenMemoryBox={() => setIsMemoryBoxOpen(true)}
          favoritesCount={favorites.length}
          cartCount={cartCount}
          currentUser={currentUser}
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
            <div className="max-w-7xl mx-auto px-3.5 sm:px-6 py-5 sm:py-8 space-y-8 sm:space-y-12">
              {/* 1. EDITORIAL HERO WITH LIVING HISTORY SHOWCASE CARD */}
              <section className="bg-gradient-to-br from-[#FAF5EE] via-[#FDFBF7] to-[#F5ECE0] rounded-3xl border border-[#E8DEC8] p-5 sm:p-8 xl:p-10 shadow-xs relative overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                  {/* Sol: Manşet & Felsefe */}
                  <div className="lg:col-span-7 space-y-4 sm:space-y-6">
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
                  <div className="lg:col-span-5">
                    {INITIAL_PRODUCTS[0] && (
                      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-[#E5DAC8] shadow-md hover:shadow-xl transition-all relative overflow-hidden group">
                        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-stone-100 border border-[#E8DEC8]">
                          <img
                            src={INITIAL_PRODUCTS[0].images[0]}
                            alt={INITIAL_PRODUCTS[0].title}
                            className="w-full h-full object-cover group-hover:scale-103 transition-transform duration-500"
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <span className="px-2.5 py-1 rounded-full bg-[#1C1917]/85 backdrop-blur-xs text-[#FAF5ED] border border-white/20 text-[10px] sm:text-[11px] font-bold flex items-center gap-1 shadow-sm">
                              <Feather className="w-3 h-3 text-amber-400" />
                              <span>{INITIAL_PRODUCTS[0].story?.travelBadge || "1994 Kadıköy Klasiği"}</span>
                            </span>
                          </div>
                          <div className="absolute top-2.5 right-2.5">
                            <span className="px-2.5 py-1 rounded-full bg-white/95 backdrop-blur-xs text-[#9E4424] border border-[#E8DEC8] text-xs font-extrabold shadow-2xs">
                              {INITIAL_PRODUCTS[0].price.toLocaleString('tr-TR')} TL
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 sm:pt-4 space-y-2">
                          <div className="flex items-center justify-between text-xs text-stone-500">
                            <span className="font-bold uppercase tracking-wider text-[#9E4424] text-[10px]">
                              {INITIAL_PRODUCTS[0].brand} • {INITIAL_PRODUCTS[0].categoryLabel}
                            </span>
                            <span className="text-[11px]">{INITIAL_PRODUCTS[0].story?.originCity}</span>
                          </div>
                          <h3 className="font-serif font-bold text-sm sm:text-base text-stone-900 line-clamp-1">
                            {INITIAL_PRODUCTS[0].title}
                          </h3>
                          {INITIAL_PRODUCTS[0].story && (
                            <p className="text-xs text-stone-600 italic line-clamp-2 bg-[#FAF8F5] p-2.5 rounded-xl border border-[#F0EAE1]">
                              "{INITIAL_PRODUCTS[0].story.memoryQuote}"
                            </p>
                          )}
                          <div className="pt-2 flex items-center gap-2">
                            <button
                              onClick={() => setSelectedPassportProduct(INITIAL_PRODUCTS[0])}
                              className="flex-1 py-2 sm:py-2.5 px-3 rounded-xl bg-[#FAF4ED] hover:bg-[#F3E7D7] border border-[#DFCBB6] text-[#8C3F23] font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <BookOpen className="w-3.5 h-3.5 text-[#9E4424]" />
                              <span>Hafıza Pasaportunu Gör</span>
                            </button>
                            <button
                              onClick={() => setSelectedProduct(INITIAL_PRODUCTS[0])}
                              className="py-2 sm:py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-[#9E4424] text-white font-bold text-xs transition-colors cursor-pointer"
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

              {/* 2. HIZLI KATEGORİ GEÇİŞ HAPLARI (ANINDA FİLTRELEME) */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-stone-500 px-1">
                  <span className="font-bold uppercase tracking-wider text-[#9E4424] text-[10px]">
                    Kategorilere Göre Keşfet
                  </span>
                  <span className="text-[11px]">
                    Toplam {products.length} ürün listeleniyor
                  </span>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {[
                    { id: 'all', label: 'Tümü', count: products.length },
                    { id: 'kadin', label: '👗 Kadın Giyim', count: products.filter(p => p.category === 'kadin').length },
                    { id: 'erkek', label: '👔 Erkek Giyim', count: products.filter(p => p.category === 'erkek').length },
                    { id: 'canta_aksesuar', label: '👜 Çanta & Aksesuar', count: products.filter(p => p.category === 'canta_aksesuar').length },
                    { id: 'elektronik', label: '📷 Teknoloji & Analog', count: products.filter(p => p.category === 'elektronik').length },
                    { id: 'ev_yasam', label: '🛋️ Ev & Yaşam & Antika', count: products.filter(p => p.category === 'ev_yasam').length },
                    { id: 'ayakkabi', label: '👟 Ayakkabı', count: products.filter(p => p.category === 'ayakkabi').length },
                    { id: 'cocuk', label: '🧸 Çocuk & Bebek', count: products.filter(p => p.category === 'cocuk').length },
                  ].map((catItem) => {
                    const isSelected = standardFilters.category === catItem.id;
                    return (
                      <button
                        key={catItem.id}
                        onClick={() => {
                          setStandardFilters((prev) => ({
                            ...prev,
                            category: catItem.id as any,
                          }));
                        }}
                        className={`px-3.5 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs ${
                          isSelected
                            ? 'bg-[#9E4424] text-white shadow-xs'
                            : 'bg-white hover:bg-[#FAF4ED] text-stone-700 border border-[#E8DEC8] hover:border-[#9E4424]'
                        }`}
                      >
                        <span>{catItem.label}</span>
                        <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                          isSelected ? 'bg-white/25 text-white' : 'bg-stone-100 text-stone-600'
                        }`}>
                          {catItem.count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. VİTRİNDEKİ ÜRÜNLER (TAM KATALOG - TÜM ÜRÜNLER KESİNTİSİZ LİSTELENİR) */}
              <div id="vitrin-section" className="space-y-5 pt-2">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3.5 pb-3 border-b border-[#E8E2D8]">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-serif font-black text-stone-900 tracking-tight">
                      Vitrindeki Parçalar
                    </h2>
                    <p className="text-xs text-stone-500 font-sans mt-0.5">
                      Her kategoriden zengin seçki ({filteredProducts.length} ürün listeleniyor • Kural 2: En az 12 ürün şartı karşılandı)
                    </p>
                  </div>

                  {/* Kondisyon Çerçeve Hapları */}
                  <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {[
                      { id: 'all', label: 'Tüm Kondisyonlar' },
                      { id: 'yeni_gibi', label: '🟢 Kusursuz' },
                      { id: 'az_kullanilmis', label: '🟡 Az Kullanılmış' },
                      { id: 'vintage', label: '🟣 Vintage & Patina' },
                    ].map((tab) => {
                      const isSelected = selectedCondition === tab.id;
                      return (
                        <button
                          key={tab.id}
                          onClick={() => setSelectedCondition(tab.id as ConditionKey | 'all')}
                          className={`px-3 py-1.5 rounded-full text-xs transition-all whitespace-nowrap cursor-pointer ${
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

                {/* Ürünler Izgarası: Mobil 2-kolon, Masaüstü 3 veya 4 kolon (TÜM LİSTELEME) */}
                <div className={`grid grid-cols-2 ${
                  desktopCols === 3 ? 'md:grid-cols-3' : 'md:grid-cols-3 xl:grid-cols-4'
                } gap-3 sm:gap-6`}>
                  {filteredProducts.map((product) => (
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

                {filteredProducts.length === 0 && (
                  <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 p-6 space-y-2">
                    <p className="text-sm font-semibold text-stone-700">Seçilen filtrede henüz ürün bulunmuyor.</p>
                    <button
                      onClick={() => {
                        setStandardFilters((prev) => ({ ...prev, category: 'all' }));
                        setSelectedCondition('all');
                      }}
                      className="px-4 py-2 bg-[#9E4424] text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      Filtreleri Temizle
                    </button>
                  </div>
                )}
              </div>
            </div>



            {/* ========================================================= */}
            {/* C. KULLANICININ İSTEDİĞİ GÖRSEL EN ALT KISIM (HomeBottomSection) */}
            {/* Kazanç Bannerı, Popüler Kategoriler, Markalar, 3 Güven Kartı & Footer */}
            {/* ========================================================= */}
            <HomeBottomSection
              onOpenSellerModal={handleOpenSellerModalGuarded}
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
              onOpenContact={() => setIsContactOpen(true)}
              onOpenFaq={() => setIsFaqOpen(true)}
              onOpenLegal={(docId) => setGlobalLegalModal(docId)}
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
            onOpenSellerModal={handleOpenSellerModalGuarded}
            onNavigateHome={() => setActiveTab('home')}
            onOpenContact={() => setIsContactOpen(true)}
            onOpenFaq={() => setIsFaqOpen(true)}
            userProducts={userProducts}
            onDeleteProduct={handleDeleteProduct}
            offers={offers}
            onAcceptOffer={handleAcceptOffer}
            onRejectOffer={handleRejectOffer}
            onOpenMemoryBox={() => setIsMemoryBoxOpen(true)}
            currentUser={currentUser}
            onLoginSuccess={handleLoginSuccess}
            onLogout={handleLogout}
            onOpenAuthModal={() => {
              setAuthTriggerReason('general');
              setIsAuthModalOpen(true);
            }}
          />
        )}
      </main>

      {/* 3. MOBILE-FIRST FIXED BOTTOM BAR (Visible only on mobile) */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={setActiveTab}
        favoritesCount={favorites.length}
        cartCount={cartCount}
        onOpenSellerModal={handleOpenSellerModalGuarded}
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
        onOpenMakeOffer={handleOpenMakeOffer}
      />

      {/* 5B. PAZARLIK & FİYAT TEKLİFİ MODALI (ÇÖZÜM 2 / SEÇENEK 2) */}
      <MakeOfferModal
        isOpen={isOfferModalOpen}
        onClose={() => {
          setIsOfferModalOpen(false);
          setOfferTargetProduct(null);
        }}
        product={offerTargetProduct}
        onSubmitOffer={handleCreateOffer}
      />

      {/* 5C. EŞYA HATIRA KUTUSU & EMANET SANDIĞI (FİYATSIZ, ANILAR VE VEDA NOTLARI) */}
      <MemoryBoxModal
        isOpen={isMemoryBoxOpen}
        onClose={() => setIsMemoryBoxOpen(false)}
        keepsakes={keepsakes}
        onAddPersonalNote={handleAddKeepsakeNote}
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
        currentUser={currentUser}
      />

      {/* 7B. GİRİŞ & KAYIT / İLAN VERME GÜVENLİK MODALI */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          setPendingActionAfterAuth(null);
        }}
        onLoginSuccess={handleLoginSuccess}
        triggerReason={authTriggerReason}
      />

      {/* 8. CHECKOUT MODALI (Havale/EFT, Kapıda Ödeme, Kredi Kartı) */}
      <CheckoutModal
        isOpen={isCheckoutModalOpen}
        onClose={() => setIsCheckoutModalOpen(false)}
        cart={cart}
        appliedCoupon={appliedCoupon}
        customerEmail={customerEmail}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* 9. İLETİŞİM & HARİTA MODALI (Kural 8) */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
      />

      {/* 10. SIKÇA SORULAN SORULAR MODALI (Kural 8) */}
      <FaqModal
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
        onOpenContact={() => setIsContactOpen(true)}
      />

      {/* 11. ÇEREZ ONAY BARI (Kural 7) */}
      <CookieBanner
        onOpenCookiePolicy={() => setGlobalLegalModal('cookies')}
      />

      {/* 12. GENEL YASAL VE KURUMSAL METİNLER MODALI (Kural 7 & Dokan) */}
      {globalLegalModal && (
        <div className="fixed inset-0 z-50 bg-[#1C1917]/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-[#FAF8F5] w-full max-w-xl rounded-2xl shadow-2xl border border-[#E4D8C4] overflow-hidden max-h-[85vh] flex flex-col animate-in fade-in">
            <div className="bg-white border-b border-[#E8E2D8] px-5 py-3.5 flex items-center justify-between">
              <span className="font-serif font-bold text-sm text-[#1C1917]">
                {globalLegalModal === 'about' && 'EldeVar Hikâyesi & Manifesto'}
                {globalLegalModal === 'privacy' && 'KVKK Aydınlatma Metni & Gizlilik'}
                {globalLegalModal === 'cookies' && 'Çerez (Cookie) Politikası'}
                {globalLegalModal === 'sales' && 'Mesafeli Satış Sözleşmesi (C2C)'}
                {globalLegalModal === 'returns' && 'İade ve Cayma Hakkı Şartları'}
                {globalLegalModal === 'dokan' && 'Dokan Lite Pazaryeri & Komisyon Yapısı'}
              </span>
              <button
                onClick={() => setGlobalLegalModal(null)}
                className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-6 overflow-y-auto text-xs text-stone-700 space-y-3.5 leading-relaxed font-sans">
              {globalLegalModal === 'about' && (
                <>
                  <h4 className="font-serif font-bold text-base text-[#1C1917]">
                    "Eski hikâyeler yeni sahibiyle canlanıyor."
                  </h4>
                  <p className="italic font-serif text-[#9E4424] bg-[#FAF3E8] p-3 rounded-xl border border-[#EBD7BF]">
                    Bizde eşyalar yalnızca birer ticari meta değildir; her ceketin omzunda bir konserin, her analog vizörde bir seyahatin, her lambaderde gece yarılarının tanıklığı vardır.
                  </p>
                  <p>
                    EldeVar, seri üretilmiş nesnelerin yerine hafızası olan eşyaları yeni sahipleriyle buluşturur. Her siparişte satıcı el yazısıyla hazırladığı hatıra kartını pakete iliştirir. Böylece satın aldığınız her ürün, hayatınıza yeni bir hikâye katar ve gezegenimize karbon tasarrufu sağlar.
                  </p>
                </>
              )}

              {globalLegalModal === 'cookies' && (
                <>
                  <h4 className="font-bold text-sm text-stone-900">EldeVar Çerez (Cookie) Politikası</h4>
                  <p>
                    EldeVar platformu, ziyaretçilerine daha güvenli, hızlı ve kişiselleştirilmiş bir alışveriş deneyimi sunmak amacıyla 6698 sayılı KVKK ve ilgili mevzuat uyarınca çerezler kullanmaktadır.
                  </p>
                  <div className="space-y-2 bg-white p-3 rounded-xl border border-stone-200">
                    <div>
                      <strong className="text-stone-900 block font-semibold">1. Zorunlu Çerezler:</strong>
                      <span>Sepet yönetimi, WooCommerce ödeme oturumları ve güvenlik için zorunludur.</span>
                    </div>
                    <div>
                      <strong className="text-stone-900 block font-semibold">2. İşlevsel Çerezler:</strong>
                      <span>Kullanıcının beden ve takip ettiği vintage markaları hatırlamasını sağlar.</span>
                    </div>
                    <div>
                      <strong className="text-stone-900 block font-semibold">3. Performans ve Analitik:</strong>
                      <span>Ziyaretçi trafiğini ve karbon tasarrufu etkisini anonim ölçümlememizi sağlar.</span>
                    </div>
                  </div>
                  <p>
                    Çerez tercihlerinizi tarayıcınızın gizlilik ayarlarından dilediğiniz zaman değiştirebilirsiniz.
                  </p>
                </>
              )}

              {globalLegalModal === 'privacy' && (
                <>
                  <h4 className="font-bold text-sm text-stone-900">Gizlilik Politikası & KVKK Aydınlatma Metni</h4>
                  <p>
                    6698 sayılı Kişisel Verilerin Korunması Kanunu ("KVKK") kapsamında veri sorumlusu sıfatıyla EldeVar Pazaryeri A.Ş. tarafından toplanan ad, soyad, telefon, adres ve e-posta verileriniz, yalnızca sipariş teslimatı ve kargo takibi amaçlarıyla işlenir.
                  </p>
                  <p>
                    Verileriniz kesinlikle izinsiz üçüncü taraflarla paylaşılmaz ve yüksek güvenlikli sunucularda şifreli olarak muhafaza edilir.
                  </p>
                </>
              )}

              {globalLegalModal === 'sales' && (
                <>
                  <h4 className="font-bold text-sm text-stone-900">Mesafeli Satış Sözleşmesi (C2C)</h4>
                  <p>
                    İşbu sözleşme 6502 sayılı Tüketicinin Korunması Hakkında Kanun ve Mesafeli Sözleşmeler Yönetmeliği hükümleri doğrultusunda düzenlenmiştir.
                  </p>
                  <p>
                    EldeVar platformu "Aracı Hizmet Sağlayıcı" konumundadır. Alıcı tarafından ödenen ürün tutarı, ürün kargolanıp teslim alınana kadar EldeVar havuz güvence hesabında blokeli kalır.
                  </p>
                </>
              )}

              {globalLegalModal === 'returns' && (
                <>
                  <h4 className="font-bold text-sm text-stone-900">İade ve Cayma Hakkı Şartları</h4>
                  <p>
                    İkinci el ürünlerde tekillik esastır. Satıcının ilanında belirttiği açıklamaya ve fotoğraflara uygun olarak teslim edilen ürünlerde keyfi cayma hakkı bulunmamaktadır.
                  </p>
                  <p>
                    Ancak üründe ilanda belirtilmeyen gizli bir kusur, yırtık, hasar veya sahtelik olması durumunda, teslimat anından itibaren 48 saat içinde kargo tespit tutanağı veya fotoğraflı taleple iade süreci başlatılır ve ücret eksiksiz iade edilir.
                  </p>
                </>
              )}

              {globalLegalModal === 'dokan' && (
                <>
                  <h4 className="font-bold text-sm text-stone-900">Dokan Lite Pazaryeri & %10 Komisyon Modeli</h4>
                  <p>
                    EldeVar, WordPress Dokan Lite altyapısıyla çalışan çok satıcılı bir C2C pazaryeridir.
                  </p>
                  <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-emerald-950 space-y-1.5">
                    <strong>Komisyon Oranı Tanımı:</strong>
                    <p>
                      Platformumuzda tamamlanan her satıştan <strong>%10 Platform Komisyonu</strong> kesilir. 
                      Kalan %90 tutar, alıcı teslimat onayını verdikten sonra satıcının IBAN hesabına aktarılır.
                    </p>
                  </div>
                  <p>
                    Satıcılar kendi Dokan panelleri üzerinden ürünlerini listeleyebilir, siparişlerini ve satış gelirlerini anlık takip edebilir.
                  </p>
                </>
              )}
            </div>
            <div className="p-3 bg-white border-t border-[#E8E2D8] text-right">
              <button
                onClick={() => setGlobalLegalModal(null)}
                className="px-5 py-2 bg-[#9E4424] text-white rounded-xl text-xs font-semibold hover:bg-[#85361A] cursor-pointer"
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

