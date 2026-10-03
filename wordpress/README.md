# 🌟 EldeVar - WordPress Entegrasyon ve Kurulum Kılavuzu

Bu paket, **EldeVar (Eşyaların Yaşam İzi & İkinci El Pazaryeri)** uygulamasını WordPress altyapısına doğrudan aktarmak için özel olarak derlenmiş ve hazırlanmıştır.

---

## 📦 Paket İçeriği

Proje kök dizininde hazır 2 adet kurulum dosyası bulunmaktadır:

1. **`eldevar-theme.zip` (Önerilen - Tam WordPress Teması)**
   - WordPress sitenizin tamamını modern, akıcı ve eksiksiz bir EldeVar pazaryerine dönüştürür.
   - Tüm React bileşenleri, hatıra pasaportu, arama ilanları, sepet ve filtreleme fonksiyonları eksiksiz çalışır.
   - Mobil ve masaüstü tam uyumludur.

2. **`eldevar-plugin.zip` (Alternatif - WordPress Eklentisi)**
   - Mevcut bir WordPress temanız varsa (örn: Astra, WoodMart, Hello Elementor) ve pazaryerini sadece belirli bir sayfada göstermek istiyorsanız (örn: `siteniz.com/magaza` veya `siteniz.com/eldevar`), bu eklentiyi yükleyip ilgili sayfaya `[eldevar]` kısa kodunu eklemeniz yeterlidir.

---

## 🚀 1. Yöntem: Tema Olarak Kurulum (1 Dakikada Hazır)

1. **WordPress Yönetici Panelinize** giriş yapın (`https://siteniz.com/wp-admin`).
2. Sol menüden **Görünüm (Appearance) > Temalar (Themes)** sayfasına gidin.
3. Üstteki **Yeni Ekle (Add New)** butonuna ve ardından **Tema Yükle (Upload Theme)** butonuna tıklayın.
4. **Dosya Seç** butonuna tıklayarak projenizin ana dizinindeki `eldevar-theme.zip` dosyasını seçin.
5. **Şimdi Kur (Install Now)** butonuna basın.
6. Kurulum tamamlandığında **Etkinleştir (Activate)** bağlantısına tıklayın.
7. Sitenizin anasayfasına gittiğinizde EldeVar pazaryeri tüm canlılığıyla açılacaktır!

> 💡 **İpucu:** Kalıcı bağlantıların (REST API) sorunsuz çalışması için WordPress panelinde **Ayarlar > Kalıcı Bağlantılar** sekmesine gidip **"Yazı İsmi" (%postname%)** seçeneğini işaretleyip "Değişiklikleri Kaydet" demeniz önerilir.

---

## 🔌 2. Yöntem: Eklenti Olarak Kurulum

1. WordPress Yönetici Panelinde **Eklentiler > Yeni Eklenti Ekle** sayfasına gidin.
2. **Eklenti Yükle** butonuna tıklayın ve `eldevar-plugin.zip` dosyasını seçip yükleyin.
3. Eklentiyi **Etkinleştirin**.
4. **Sayfalar > Yeni Ekle** diyerek "Pazaryeri" veya "İkinci El" başlıklı yeni bir sayfa açın.
5. Sayfa içeriğine şu kısa kodu yazın:
   ```text
   [eldevar]
   ```
6. Sayfayı yayınlayın.

---

## 🛠️ WordPress REST API ve WooCommerce Entegrasyonu

EldeVar teması ve eklentisi, WordPress REST API ile yerleşik olarak iletişim kurar:

- **Ürünler:** Sitede WooCommerce yüklüyse WooCommerce ürünlerini otomatik olarak EldeVar formatına dönüştürüp listeler.
- **Özel İlanlar:** Kullanıcıların veya satıcıların oluşturduğu yeni ilanlar `/wp-json/eldevar/v1/products` uç noktası üzerinden WordPress veritabanına `eldevar_product` özel içerik türüyle kaydedilir.
- **Arama İlanları:** "Aranıyor" ilanları `/wp-json/eldevar/v1/wanted` üzerinden saklanır.
- **Siparişler:** Tamamlanan havale/EFT siparişleri `/wp-json/eldevar/v1/orders` üzerinden WordPress panelinde listelenir.

---

## 🔄 Yeni Değişiklikleri Yeniden Paketleme

React kodunda (tasarım, metinler veya bileşenlerde) değişiklik yaptığınızda WordPress paketini güncellemek için tek bir komut çalıştırmanız yeterlidir:

```bash
npm run package:wp
```

Bu komut:
1. React kodunu Vite ile optimize edilmiş olarak derler.
2. Varlık dosyalarını tema ve eklenti klasörlerine kopyalar.
3. `eldevar-theme.zip` ve `eldevar-plugin.zip` dosyalarını otomatik olarak günceller.

---

## 📋 WTK2105 E-Ticaret Ortak Kurallar ve Dokan Kurulum Rehberi

Proje değerlendirmesinde tam puan alabilmek için WordPress panelinizde şu ayarları tamamlayın:

### 1. Dokan Lite Kurulumu (%30 Projeye Özel Şart)
- **Eklentiler > Yeni Ekle** sekmesinden **"Dokan"** aratıp Dokan Lite eklentisini kurun ve etkinleştirin.
- **Dokan > Ayarlar > Komisyon (Commission)** sekmesine gidin.
  - Komisyon Türü: **Yüzde (Percentage)**
  - Komisyon Oranı: **%10** (Platform payı) olarak kaydedin.
- Dokan satıcı kayıt ve satıcı paneli (`/dashboard`) sayfalarını otomatik oluşturma sihirbazıyla onaylayın.

### 2. WooCommerce Ödeme Yöntemleri (Kural 4)
- **WooCommerce > Ayarlar > Ödemeler**:
  - **Banka Havalesi / EFT (BACS):** Etkinleştirin ve banka hesap bilgilerini (Ziraat/Garanti) girin.
  - **Kapıda Ödeme (Cash on Delivery - COD):** Etkinleştirin.
  - *(Opsiyonel)* iyzico veya PayTR WooCommerce eklentisini kurup test modunu açabilirsiniz.

### 3. Kargo Kuralı (Kural 5)
- **WooCommerce > Ayarlar > Kargo > Kargo Bölgeleri**:
  - Bölge Adı: **Türkiye**
  - Kargo Yöntemi 1: **Sabit Fiyat** (49.90 TL)
  - Kargo Yöntemi 2: **Ücretsiz Kargo** (Minimum sepet tutarı: 750 TL)

### 4. SEO Eklentisi (Kural 10)
- **Yoast SEO** veya **Rank Math** eklentisini kurun.
- Genel ayarları ve ürün başlık/açıklama şablonlarını kaydedin.

### 5. Test Siparişleri (Kural 12)
- Farklı ödeme yöntemleriyle oluşturulmuş 3 adet test siparişi (`EV-84210`, `EV-84211`, `EV-84212`) frontend'e entegre edilmiştir.
- WooCommerce panelinde **WooCommerce > Siparişler** altında bu siparişlerin durumlarını (Ödeme Bekliyor, Kargoya Verildi, Tamamlandı) güncelleyin.

