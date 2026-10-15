import { Product, Order, WantedItem, WordPressSettings } from '../types';

/**
 * WordPress REST API & WooCommerce Bridge for EldeVar
 */
export class WordPressBridge {
  private static get settings(): WordPressSettings | undefined {
    return typeof window !== 'undefined' ? window.eldevarSettings : undefined;
  }

  public static isWordPress(): boolean {
    return Boolean(this.settings?.restUrl);
  }

  public static getSiteInfo() {
    return {
      isWordPress: this.isWordPress(),
      siteTitle: this.settings?.siteTitle || 'EldeVarMı',
      siteDescription: this.settings?.siteDescription || 'Eşyaların Yaşam İzi & İkinci El Pazaryeri',
      themeUrl: this.settings?.themeUrl || '',
      currentUser: this.settings?.currentUser || null,
      isWooCommerceActive: Boolean(this.settings?.isWooCommerceActive),
    };
  }

  public static async fetchProducts(): Promise<Product[] | null> {
    if (!this.isWordPress() || !this.settings?.restUrl) {
      return null;
    }

    try {
      const response = await fetch(`${this.settings.restUrl}eldevar/v1/products`, {
        headers: {
          'Content-Type': 'application/json',
          ...(this.settings.nonce ? { 'X-WP-Nonce': this.settings.nonce } : {}),
        },
      });

      if (!response.ok) {
        console.warn('WordPress API products fetch failed, using local products.', response.status);
        return null;
      }

      const data = await response.json();
      return Array.isArray(data) && data.length > 0 ? data : null;
    } catch (err) {
      console.warn('WordPress API connection error:', err);
      return null;
    }
  }

  public static async createProduct(product: Product): Promise<boolean> {
    if (!this.isWordPress() || !this.settings?.restUrl) {
      return false;
    }

    try {
      const response = await fetch(`${this.settings.restUrl}eldevar/v1/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.settings.nonce ? { 'X-WP-Nonce': this.settings.nonce } : {}),
        },
        body: JSON.stringify(product),
      });

      return response.ok;
    } catch (err) {
      console.error('Failed to sync product to WordPress:', err);
      return false;
    }
  }

  public static async createOrder(order: Order): Promise<boolean> {
    if (!this.isWordPress() || !this.settings?.restUrl) {
      return false;
    }

    try {
      const response = await fetch(`${this.settings.restUrl}eldevar/v1/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.settings.nonce ? { 'X-WP-Nonce': this.settings.nonce } : {}),
        },
        body: JSON.stringify(order),
      });

      return response.ok;
    } catch (err) {
      console.error('Failed to sync order to WordPress:', err);
      return false;
    }
  }

  public static async fetchWantedItems(): Promise<WantedItem[] | null> {
    if (!this.isWordPress() || !this.settings?.restUrl) {
      return null;
    }

    try {
      const response = await fetch(`${this.settings.restUrl}eldevar/v1/wanted`, {
        headers: {
          'Content-Type': 'application/json',
          ...(this.settings.nonce ? { 'X-WP-Nonce': this.settings.nonce } : {}),
        },
      });

      if (!response.ok) return null;
      const data = await response.json();
      return Array.isArray(data) && data.length > 0 ? data : null;
    } catch (err) {
      console.warn('Failed to fetch wanted items from WordPress:', err);
      return null;
    }
  }

  public static async createWantedItem(item: WantedItem): Promise<boolean> {
    if (!this.isWordPress() || !this.settings?.restUrl) {
      return false;
    }

    try {
      const response = await fetch(`${this.settings.restUrl}eldevar/v1/wanted`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(this.settings.nonce ? { 'X-WP-Nonce': this.settings.nonce } : {}),
        },
        body: JSON.stringify(item),
      });

      return response.ok;
    } catch (err) {
      console.error('Failed to sync wanted item to WordPress:', err);
      return false;
    }
  }
}
