import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('🚀 EldeVar WordPress Paketi Hazırlanıyor...\n');

// 1. Vite Build
console.log('📦 1/5: Vite Projesi Derleniyor (npm run build)...');
execSync('npm run build', { cwd: rootDir, stdio: 'inherit' });

const distAssets = path.join(rootDir, 'dist', 'assets');
const themeAssets = path.join(rootDir, 'wordpress', 'eldevar-theme', 'assets');
const pluginAssets = path.join(rootDir, 'wordpress', 'eldevar-plugin', 'assets');

// Klasörleri temizle ve oluştur
[themeAssets, pluginAssets].forEach((dir) => {
  if (fs.existsSync(dir)) {
    fs.rmSync(dir, { recursive: true, force: true });
  }
  fs.mkdirSync(dir, { recursive: true });
});

// 2. Asset Kopyalama
console.log('📂 2/5: Derlenen CSS ve JS varlıkları WordPress tema ve eklenti klasörlerine kopyalanıyor...');
const assetFiles = fs.readdirSync(distAssets);
for (const file of assetFiles) {
  const src = path.join(distAssets, file);
  fs.copyFileSync(src, path.join(themeAssets, file));
  fs.copyFileSync(src, path.join(pluginAssets, file));
  console.log(`   ✓ Kopyalandı: ${file}`);
}

// Favicon ve public varlıkları
const faviconSrc = path.join(rootDir, 'public', 'favicon.svg');
if (fs.existsSync(faviconSrc)) {
  fs.copyFileSync(faviconSrc, path.join(themeAssets, 'favicon.svg'));
  fs.copyFileSync(faviconSrc, path.join(pluginAssets, 'favicon.svg'));
}

// 3. Tema Ekran Görüntüsü (screenshot.png)
console.log('🖼️  3/5: WordPress Tema Screenshot (screenshot.png) kontrol ediliyor...');
const screenshotSrc = 'C:\\Users\\semih\\.gemini\\antigravity-ide\\brain\\e31536fb-8221-4f04-90e2-139ec7436ecc\\eldevar_wp_screenshot_1790262710148.jpg';
const themeScreenshotTarget = path.join(rootDir, 'wordpress', 'eldevar-theme', 'screenshot.png');
if (fs.existsSync(screenshotSrc)) {
  fs.copyFileSync(screenshotSrc, themeScreenshotTarget);
  console.log('   ✓ screenshot.png tema dizinine eklendi.');
} else if (fs.existsSync(themeScreenshotTarget)) {
  console.log('   ✓ Mevcut screenshot.png korundu.');
}

// 4. Zip Arşivleri Oluşturuluyor
console.log('🗜️  4/5: WordPress için doğrudan yüklenebilir .ZIP arşivleri paketleniyor...');
const themeZip = path.join(rootDir, 'eldevar-theme.zip');
const pluginZip = path.join(rootDir, 'eldevar-plugin.zip');

try {
  // Evrensel standart ZIP oluştur (Linux ve Windows sunucularda %100 sorunsuz açılması için)
  if (fs.existsSync(themeZip)) fs.unlinkSync(themeZip);
  if (fs.existsSync(pluginZip)) fs.unlinkSync(pluginZip);

  execSync(`tar -a -cf eldevar-theme.zip -C wordpress eldevar-theme`, {
    cwd: rootDir,
    stdio: 'inherit',
  });
  console.log('   ✓ eldevar-theme.zip başarıyla oluşturuldu!');

  execSync(`tar -a -cf eldevar-plugin.zip -C wordpress eldevar-plugin`, {
    cwd: rootDir,
    stdio: 'inherit',
  });
  console.log('   ✓ eldevar-plugin.zip başarıyla oluşturuldu!');
} catch (e) {
  console.error('Zip oluşturulurken hata:', e);
}

// 5. Özet Bilgi
console.log('\n=============================================');
console.log('🎉 TEBRİKLER! WordPress Paketleme Tamamlandı!');
console.log('=============================================');
console.log('Oluşturulan Paketler:');
if (fs.existsSync(themeZip)) {
  const stats = fs.statSync(themeZip);
  console.log(`1. 📦 Tema Paketi: eldevar-theme.zip (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
}
if (fs.existsSync(pluginZip)) {
  const stats = fs.statSync(pluginZip);
  console.log(`2. 🔌 Eklenti Paketi: eldevar-plugin.zip (${(stats.size / 1024 / 1024).toFixed(2)} MB)`);
}
console.log('\nNasıl Yüklenir:');
console.log('Tema olarak: WP Yönetici Paneli -> Görünüm -> Temalar -> Yeni Tema Ekle -> Tema Yükle -> eldevar-theme.zip seçin ve Etkinleştirin.');
console.log('Eklenti olarak: WP Yönetici Paneli -> Eklentiler -> Yeni Eklenti Ekle -> Eklenti Yükle -> eldevar-plugin.zip seçin ve [eldevar] kısa kodunu istediğiniz sayfaya ekleyin.');
