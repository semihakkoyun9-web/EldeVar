export type ProductCategory = 
  | 'kadin' 
  | 'erkek' 
  | 'cocuk' 
  | 'ayakkabi' 
  | 'canta_aksesuar' 
  | 'elektronik' 
  | 'ev_yasam' 
  | 'giyim';

export type ProductCondition = 
  | 'Kusursuz (Etiketsiz Sıfır)' 
  | 'Kusursuz (Yeni Gibi)'
  | 'Çok İyi (Az Kullanılmış)' 
  | 'İyi (Temiz İkinci El)' 
  | 'İyi (Yaşanmışlık İzi Var)'
  | 'Çok Kullanılmış (Karakterli Patina)'
  | 'Çok Kullanılmış (Karakterli)'
  | 'Çok Kullanılmış (Orijinal Yün)'
  | 'Vintage & Karakterli'
  | 'Vintage Koleksiyonluk'
  | 'Vintage / Koleksiyonluk'
  | 'Koleksiyonluk & Çalışır';

export interface ProductVariation {
  id: string;
  size?: string;
  condition?: string;
  price: number;
  stock: number;
  sku: string;
}

export interface ProductStory {
  eraOrYear: string; // e.g. "1994", "1980'ler", "Dededen Yadigâr"
  originCity: string; // e.g. "Kadıköy, İstanbul"
  travelBadge: string; // e.g. "90'lar Kadıköy Konser Hatırası"
  memoryQuote: string; // e.g. "Üniversite yıllarımda her konserde üzerimdeydi..."
  storyDetail: string; // The rich provenance narrative
  sellerFarewell: string; // Why parting and wish for next keeper
}

export interface Product {
  id: string;
  title: string;
  category: ProductCategory;
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  stock?: number;
  condition: ProductCondition;
  conditionType?: 'yeni_gibi' | 'az_kullanilmis' | 'cok_kullanilmis' | 'vintage';
  brand: string;
  size?: string;
  passportCode?: string;
  description: string;
  images: string[];
  story?: ProductStory;
  seller: {
    id: string;
    name: string;
    email: string;
    avatar: string;
    rating: number;
    salesCount: number;
    location: string;
    conditionAccuracyRate?: number; // e.g. 99 (%99 Kondisyon Doğruluk Oranı)
  };
  conditionChecklist?: {
    hasTag?: boolean;
    hasFlaws?: boolean;
    flawDetails?: string;
    isCleanAndOdorFree?: boolean;
    isRepaired?: boolean;
  };
  isVariable?: boolean;
  variations?: ProductVariation[];
  ecoSavings: {
    co2Kg: number;
    waterLiters: number;
  };
  shippingFee: number;
  views: number;
  likes: number;
  createdAt: string;
}

export interface FilterState {
  category: ProductCategory | 'all';
  condition: 'all' | 'yeni_gibi' | 'az_kullanilmis' | 'cok_kullanilmis' | 'vintage';
  brand: string | 'all';
  size: string | 'all';
  minPrice: number | '';
  maxPrice: number | '';
  sortBy: 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'eco';
}

export interface CartItem {
  product: Product;
  selectedVariation?: ProductVariation;
  quantity: number;
}

export interface Coupon {
  code: string;
  type: 'percent' | 'fixed';
  value: number;
  minSpend: number;
  description: string;
}

export type PaymentMethodType = 'bacs' | 'cod' | 'credit_card';

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: CartItem[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode?: string;
  paymentMethod: PaymentMethodType; // Havale/EFT, Kapıda Ödeme, Kredi Kartı
  paymentMethodTitle: string;
  bankDetails?: {
    bankName: string;
    accountHolder: string;
    iban: string;
    descriptionCode: string;
  };
  trackingNumber?: string;
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
    city: string;
  };
  status: 'pending_payment' | 'processing' | 'shipped' | 'completed';
  vendorIds: string[];
}

export interface UserPreferences {
  favoriteBrands: string[];
  clothingSize: string;
  shoeSize: string;
  preferredCategories: ProductCategory[];
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'offer' | 'system' | 'vendor';
}

export interface WantedOfferMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderRole: 'buyer' | 'seller' | 'system';
  text: string;
  photoUrl?: string;
  isOffer?: boolean;
  offerPrice?: number;
  verificationCode?: string; // Örn: "#EV-784" el yazısıyla kâğıda yazılıp ürünün yanında çekilen kod
  timestamp: string;
}

export interface WantedOffer {
  id: string;
  wantedId: string;
  sellerId: string;
  sellerName: string;
  sellerAvatar: string;
  sellerRating: number;
  sellerLocation: string;
  offerPrice: number;
  productCondition: ProductCondition;
  verificationCode: string; // Sahte/internet fotoğrafı önleme kodu
  photos: string[];
  description: string;
  status: 'pending' | 'accepted' | 'rejected' | 'product_created';
  createdAt: string;
  messages: WantedOfferMessage[];
}

export interface WantedItem {
  id: string;
  title: string;
  category: ProductCategory;
  categoryLabel: string;
  targetBudgetMin: number;
  targetBudgetMax: number;
  brand?: string;
  size?: string;
  eraOrPeriod?: string; // Örn: "90'lar", "Orijinal 1980'ler", "Güncel Sezon"
  storyWhy: string; // Neden bu eşyayı arıyor?
  sampleImages: string[];
  buyer: {
    id: string;
    name: string;
    avatar: string;
    city: string;
    trustScore: number;
  };
  status: 'open' | 'deal_made' | 'completed';
  offersCount: number;
  views: number;
  createdAt: string;
  offers: WantedOffer[];
}

export interface ProductOffer {
  id: string;
  productId: string;
  productTitle: string;
  productImage: string;
  originalPrice: number;
  offeredPrice: number;
  discountPercentage: number;
  buyerName: string;
  buyerEmail?: string;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'countered';
  counterPrice?: number;
  createdAt: string;
}

export interface KeepsakeItem {
  id: string;
  productId: string;
  title: string;
  image: string;
  brand: string;
  categoryLabel: string;
  passportCode?: string;
  eraOrYear?: string;
  originCity?: string;
  travelBadge?: string;
  sellerFarewell?: string;
  sellerName: string;
  acquiredDate: string;
  buyerPersonalNote?: string;
}

export interface AuthUser {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  phone?: string;
  city?: string;
  iban?: string;
  bio?: string;
  role: 'seller' | 'buyer' | 'collector';
  isVerified: boolean;
  memberSince: string;
  rating: number;
  successfulSales: number;
  availableBalance?: number;
  pendingBalance?: number;
}

export const DEFAULT_AUTH_USER: AuthUser = {
  id: 'usr-semih',
  name: 'Semih Akkoyun',
  username: 'semihakkoyun',
  email: 'semihakkoyun9@gmail.com',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
  phone: '0532 555 44 33',
  city: 'Eskişehir / Kadıköy',
  iban: 'TR12 0001 0090 1234 5678 5001',
  bio: "90'lar vintage giyim, analog vizörler ve yaşanmışlığı olan eşyalar koleksiyoneri.",
  role: 'seller',
  isVerified: true,
  memberSince: 'Eylül 2024',
  rating: 4.9,
  successfulSales: 16,
  availableBalance: 2420.0,
  pendingBalance: 570.0,
};

export interface WordPressSettings {
  siteUrl?: string;
  restUrl?: string;
  nonce?: string;
  ajaxUrl?: string;
  siteTitle?: string;
  siteDescription?: string;
  themeUrl?: string;
  currentUser?: {
    id: number;
    name: string;
    email: string;
    isLoggedIn: boolean;
    avatar?: string;
  };
  isWooCommerceActive?: boolean;
}

declare global {
  interface Window {
    eldevarSettings?: WordPressSettings;
  }
}
