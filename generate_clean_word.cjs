const fs = require('fs');
const { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } = require('docx');

function createHeader(text, level = HeadingLevel.HEADING_1) {
  return new Paragraph({
    text: text,
    heading: level,
    spacing: { before: 360, after: 180 },
  });
}

function createSubHeader(text) {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        bold: true,
        size: 26,
        color: "0F766E",
      }),
    ],
    spacing: { before: 240, after: 120 },
  });
}

function createBullet(title, desc) {
  return new Paragraph({
    bullet: { level: 0 },
    children: [
      new TextRun({ text: `${title}: `, bold: true, color: "1C1917", size: 22 }),
      new TextRun({ text: desc, color: "44403C", size: 22 }),
    ],
    spacing: { before: 80, after: 80 },
  });
}

function createParagraph(text, isBold = false) {
  return new Paragraph({
    children: [
      new TextRun({
        text: text,
        bold: isBold,
        size: 22,
        color: "292524",
      }),
    ],
    spacing: { before: 100, after: 100 },
  });
}

function createCallout(title, text) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [
      new TableRow({
        children: [
          new TableCell({
            children: [
              new Paragraph({
                children: [
                  new TextRun({ text: `📌 ${title}\n`, bold: true, color: "065F46", size: 22 }),
                  new TextRun({ text: text, color: "1F2937", size: 21, italics: true }),
                ],
                spacing: { before: 120, after: 120 },
              }),
            ],
            shading: { fill: "ECFDF5" },
            margins: { top: 160, bottom: 160, left: 240, right: 240 },
          }),
        ],
      }),
    ],
  });
}

const doc = new Document({
  sections: [
    {
      properties: {},
      children: [
        // TITLE
        new Paragraph({
          children: [
            new TextRun({
              text: "WEB TASARIMI, SATIŞ VE PAZARLAMA",
              bold: true,
              size: 38,
              color: "15803D",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 200, after: 100 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Hafta 1 – Müşteri ve Satış Analizi Proje Sunumu",
              bold: true,
              size: 28,
              color: "78350F",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 50, after: 150 },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Proje: EldeVar (Hikâyeli, Güvenli & Sürdürülebilir İkinci El Pazaryeri)",
              italics: true,
              size: 24,
              color: "57534E",
            }),
          ],
          alignment: AlignmentType.CENTER,
          spacing: { before: 50, after: 400 },
        }),

        // GİRİŞ
        createHeader("GİRİŞ: DERSİN AMACI VE TEMEL SATIŞ SORUSU", HeadingLevel.HEADING_1),
        createParagraph("Bu analizin ve projenin amacı; bir web sitesinin yalnızca görsel olarak estetik olmasının ticari başarı için yeterli olmadığını, tasarımın doğrudan satış ve pazarlama stratejisiyle bütünleşmesi gerektiğini ortaya koymaktır."),
        createParagraph("Bir ticari web sitesi;"),
        createBullet("1. Hedef Kitle", "Belirli ve tanımlı bir kitleye hitap etmeli,"),
        createBullet("2. İhtiyaç & Problem", "Müşterinin gerçek bir ihtiyacını veya problemini çözmeli,"),
        createBullet("3. Doğru Mesaj", "Ziyaretçiye aradığı net değeri ve mesajı vermeli,"),
        createBullet("4. Sarsılmaz Güven", "Ödeme, teslimat ve ürün orijinalliğinde şüphe bırakmamalı,"),
        createBullet("5. Net Aksiyon", "Kullanıcıyı tereddütsüz bir eyleme (Sepete Ekle / Fiyat Öner / Satın Al) yönlendirmelidir."),
        createCallout(
          "Temel Stratejik Soru & Cevap",
          "Kimin için, hangi problemi çözen ve ne satmaya çalışan bir web sitesi tasarlıyoruz?\n\nCevap: EldeVar; hızlı tüketim çılgınlığı yerine geçmişi, hatırası ve zamansız değeri olan eşyaları 'Hatıra Pasaportu' ve '%100 Güvenli Lisanslı Havuz Hesap' ile yeni sahipleriyle buluşturan, sürdürülebilirliği teşvik eden hikâyeli bir C2C pazaryeridir."
        ),

        // 1. ÜRÜN VEYA HİZMETİ TANIMLAMA
        createHeader("1. ÜRÜN VEYA HİZMETİ TANIMLAMA", HeadingLevel.HEADING_1),
        createParagraph("Bir web sitesi tasarlamadan önce ne sattığımızı açık şekilde tanımlamamız gerekir. Sadece ürün kategorisinin adını söylemek stratejik olarak yetersizdir."),
        createBullet("Yüzeysel / Yetersiz Tanım", "İkinci el eşya, kıyafet ve antika satan web sitesi."),
        createBullet("Stratejik ve Doğru Tanım", "18–38 yaş arası sürdürülebilir modaya, vintage estetiğe ve hikâyesi olan nesnelere değer veren kullanıcılara yönelik; her eşyanın geçmişini dijital 'Hatıra Pasaportu' ile tescilleyen, %100 güvenli ödeme havuzuna sahip döngüsel ekonomi pazaryeri."),
        createSubHeader("EldeVar'ın Sunduğu 4 Temel Hizmet Bileşeni:"),
        createBullet("1. Hikâyeli Ürün Satışı (Memory Passport)", "Her eşyanın üretim yılını, şehir geçmişini ve önceki sahibinin yazdığı hatıra/veda mektubunu mühürlü sertifikayla sunan satış modeli."),
        createBullet("2. İki Taraflı Güvenli Pazaryeri (C2C)", "Bireysel kullanıcıların evlerindeki değerli ve nostaljik eşyaları kolayca ilana koyup satış yapabildiği altyapı."),
        createBullet("3. 'Arıyorum' (Tersine İlan Masası)", "Alıcıların piyasada bulamadığı özel veya nostaljik eşyaları talep olarak açtığı, satıcıların teklif sunduğu tersine e-ticaret işlevi."),
        createBullet("4. Emanet Sandığı / Hatıra Kutusu", "Satın alınan ürünlerin hatıralarıyla birlikte kullanıcının profilinde dijital bir koleksiyon arşivi olarak saklanması."),

        // 2. HEDEF KİTLE ANALİZİ
        createHeader("2. HEDEF KİTLE ANALİZİ (TARGET AUDIENCE)", HeadingLevel.HEADING_1),
        createCallout("Kritik Kural", "'Herkes hedef kitle değildir.' Bir ürünün herkese hitap ettiğini söylemek, hedef kitlenin yeterince analiz edilmediğini gösterir. EldeVar, sadece ucuzluk arayanlara değil, özgünlük, yaşanmışlık, sürdürülebilirlik ve güven arayan seçici bir kitleye odaklanır."),
        createBullet("Yaş Grubu", "18 – 35 yaş (Ağırlıklı Genç Yetişkinler, Z ve Y Kuşağı)."),
        createBullet("Cinsiyet Dağılımı", "%60 Kadın, %40 Erkek."),
        createBullet("Meslek & Gelir Seviyesi", "Üniversite öğrencileri, tasarımcılar, mimarlar, sanatçılar, yazılımcılar ve genç profesyoneller (Orta ve Üst-Orta Gelir)."),
        createBullet("Yaşanılan Bölge", "Metropoller ve üniversite şehirleri (İstanbul, İzmir, Ankara, Eskişehir, Bursa vb.)."),
        createBullet("İlgi Alanları", "Vintage & Retro moda, analog fotoğrafçılık, plak/müzik kültürü, sürdürülebilir yaşam, döngüsel ekonomi, nostaljik tasarım objeleri."),
        createBullet("Dijital Alışveriş Alışkanlıkları", "Mobil öncelikli (Instagram, Pinterest, TikTok), görsel estetiğe ve hikâye anlatımına duyarlı, online güvenli ödemeyi benimsemiş tüketiciler."),
        createBullet("Satın Alma Davranışı", "Seri üretim fast-fashion yerine zamansız, dayanıklı ve ruhu olan parçaları tercih etme eğilimi."),

        // 3. MÜŞTERİ PROBLEMİNİ BULMAK
        createHeader("3. MÜŞTERİ PROBLEMİNİ BULMAK VE ÇÖZÜM HARİTASI", HeadingLevel.HEADING_1),
        createParagraph("İnsanlar yalnızca bir ürünü ürün olduğu için satın almaz; bir ihtiyacını karşılamak veya bir problemini çözmek için satın alır."),
        createBullet("Problem 1: İkinci Elde Güvensizlik ve Yanıltıcı Görseller", "Müşteri Korkusu: Ürünün fotoğraftaki gibi gelmemesi, gizli kusurların saklanması, iade edememe endişesi.\nEldeVar Çözümü: 4 Kademeli Renk Kodlu Kondisyon Sistemi, şeffaf kusur beyanı ve alıcı onay verene kadar paranın güvende kaldığı %100 Lisanslı Havuz Hesap (Escrow) koruması."),
        createBullet("Problem 2: Hızlı Tüketimin (Fast-Fashion) Ruhsuzluğu ve Yüksek Fiyatlar", "Müşteri Korkusu: Birbirinin kopyası kalitesiz sentetik kıyafetlere yüksek fiyatlar ödemek.\nEldeVar Çözümü: Yıllara meydan okuyan orijinal vintage, hakiki deri ve koleksiyonluk ürünlerin erişilebilir fiyatlarla sunulması."),
        createBullet("Problem 3: Anısı Olan Eşyayı Değersizce Elden Çıkarma Üzüntüsü", "Satıcı Korkusu: Sevdiği hatıralık eşyaların sıradan bir spotçu mantığıyla yok pahasına harcanması.\nEldeVar Çözümü: Satıcının ürüne veda mektubu bırakabildiği 'Hatıra Pasaportu' ile eşyayı değerini bilecek meraklısına emanet etme kültürü."),
        createBullet("Problem 4: Nadir ve Nostaljik Eşyaları Bulma Zorluğu", "Müşteri Korkusu: 90'lardan kalma bir kasetçaları veya özel bir ceketi bulmak için onlarca siteyi günlerce taramak.\nEldeVar Çözümü: 'Arıyorum' (Wanted Items) sistemiyle talep açıp, evinde saklayan satıcılardan doğrudan teklif alma imkânı."),

        // 4. PERSONA
        createHeader("4. PERSONA – ÖRNEK MÜŞTERİ PROFİLLERİ", HeadingLevel.HEADING_1),
        createParagraph("Hedef kitleyi temsil eden, gerçek müşteri davranışlarını somutlaştıran iki ana persona profili:"),
        
        createSubHeader("Persona 1: Alıcı Odaklı (Buyer Persona) – Ece Yılmaz"),
        createBullet("İsim & Yaş", "Ece Yılmaz, 24 Yaşında"),
        createBullet("Meslek & Şehir", "Junior UI/UX Tasarımcısı, Kadıköy / İstanbul"),
        createBullet("Kullandığı Cihaz", "iPhone 14 & MacBook (Alışverişlerini %85 mobilden yapar)"),
        createBullet("Aylık Alışveriş Bütçesi", "1.500 TL – 3.500 TL (Kişisel Alışveriş Bütçesi)"),
        createBullet("İhtiyaç & İstek", "İş ve sosyal hayatında tarzını yansıtacak, kimsede olmayan 90'lar deri mont ve vintage aksesuarlar bulmak."),
        createBullet("Öncelik", "Orijinallik, temiz kondisyon, estetik görünüş ve hikâye."),
        createBullet("En Büyük Endişesi", "Görsellerde kusursuz görünen ürünün gerçekte sigara kokması, astarının yırtık veya deforme gelmesi."),
        createBullet("Davranış & Keşif", "Instagram ve Pinterest'ten kombin keşfeder, ürünün Hatıra Pasaportu'nu ve satıcı yorumlarını dikkatle okur."),
        createBullet("Satın Alma Öncesi", "Fiyatı ve kondisyonu tartar, satıcıya soru sorar veya 'Fiyat Öner' ile teklif sunar."),
        createBullet("Satın Alma Tetikleyicisi", "%100 Havuz Hesap güvencesi, 750 TL üzerine ücretsiz sigortalı kargo ve satıcının samimi veda hikâyesi."),

        createSubHeader("Persona 2: Satıcı Odaklı (Seller Persona) – Caner Öztürk"),
        createBullet("İsim & Yaş", "Caner Öztürk, 29 Yaşında"),
        createBullet("Meslek & Şehir", "İç Mimar & Koleksiyoner, Alsancak / İzmir"),
        createBullet("Kullandığı Cihaz", "iPad Pro & Android Telefon"),
        createBullet("Motivasyon", "Dolabında/evinde yer açmak ve anısı olan özel eşyaları değerini bilecek birine kazançla devretmek."),
        createBullet("İhtiyaç", "Koleksiyonundaki analog fotoğraf makinesi ve saatleri güvenle satabileceği saygın bir mecra."),
        createBullet("En Büyük Endişesi", "İlan sitelerindeki kaba ve saygısız pazarlık mesajları, elden teslimattaki güvensizlikler ve dolandırıcılık."),
        createBullet("Kullanım Tetikleyicisi", "3 adımda kolay ilan ve Hatıra Pasaportu oluşturma, saygılı topluluk ve kartla peşin ödeme güvencesi."),

        // 5. SATIN ALMA MOTİVASYONLARI
        createHeader("5. SATIN ALMA MOTİVASYONLARI VE DÖNÜŞÜM TETİKLEYİCİLERİ", HeadingLevel.HEADING_1),
        createParagraph("EldeVar ziyaretçilerinin 'Sepete Ekle' ve 'Satın Al' kararı vermesini sağlayan psikolojik ve rasyonel etkenler:"),
        createBullet("1. Fiyat & Ekonomik Teşvik", "Sıfır lüks ürünlerin 1/4 fiyatına kaliteli parçalara erişim + Sepette indirim kuponları (ELDEVAR10, YESILGARDROP)."),
        createBullet("2. Kalite & Zamansızlık", "30 yıllık hakiki İtalyan derisi veya Japon mekanik saat gibi dayanıklı malzeme garantisi."),
        createBullet("3. Sosyal Kanıt & Güven (Social Proof)", "Onaylı satıcı puanları (4.9/5), doğrulanmış alıcı yorumları ve Güven Damgaları."),
        createBullet("4. Risk Azaltma (Risk Reversal)", "'Paranız ürün elinize ulaşıp onaylayana kadar blokede kalır' garantisi ve koşulsuz 48 saat iade hakkı."),
        createBullet("5. Ürünün Sınırlı ve Tek Olması (Scarcity)", "Her ürünün dünyada sadece 1 adet olması; 'Bu ürün tektir, kaçırmayın' aciliyet hissi."),
        createBullet("6. Duygusal Bağ Kurma", "Ürünün önceki sahibinin mektubunu okuyarak eşyayla bağ kurma ve nostalji hissi."),
        createBullet("7. Hızlı & Güvenli Teslimat", "Sigortalı anlaşmalı kargo, 750 TL üzeri ücretsiz teslimat ve şeffaf kargo takip kodu."),

        // 6. RAKİP ANALİZİ
        createHeader("6. REKABET ANALİZİ: ELDEVAR'IN DOLAP, LETGO VE GARDROPS'TAN FARKLARI", HeadingLevel.HEADING_1),
        createParagraph("Geleneksel ikinci el platformları eşyayı yalnızca 'elden çıkarılması gereken ucuz bir meta' olarak görürken; EldeVar, eşyayı 'yaşanmışlığı ve kültürel değeri olan bir hafıza nesnesi' olarak konumlandırır."),
        createBullet("Ürün Felsefesi Farkı", "Rakipler: Hızlı tüketim (fast-fashion) yığınları | EldeVar: Seçilmiş vintage, retro ve hikâyeli koleksiyonluk parçalar."),
        createBullet("Güven & Kondisyon Farkı", "Rakipler: Satıcının sübjektif beyanı ve yanıltıcı fotoğrafları | EldeVar: 4 Kademeli Renk Kodlu Kondisyon Sistemi ve şeffaf kontrol."),
        createBullet("Ürün Kimliği Farkı", "Rakipler: Yalnızca marka/beden etiketi | EldeVar: Dijital Mühürlü Hatıra Pasaportu (Şehir, Yıl, Veda Notu)."),
        createBullet("Pazarlık Deneyimi", "Rakipler: Yıpratıcı mesajlaşmalar ve güvensiz buluşmalar | EldeVar: Saygılı İkili Teklif Masası + %100 Lisanslı Havuz Hesap."),
        createBullet("Tersine Talep Modeli", "Rakipler: Sadece mevcut ilanlar taranabilir | EldeVar: 'Arıyorum' ile alıcının ilan açıp teklif toplaması."),
        createBullet("Satış Sonrası Miras", "Rakipler: Satış sonrası ürün silinir | EldeVar: Alıcının profilindeki 'Hatıra Kutusu'nda anısıyla saklanır."),

        // 7. ÖNE ÇIKARAN 5 UNSUR
        createHeader("7. ELDEVAR'I RAKİPLERİNİN ÖNÜNE ÇIKARAN 5 TEMEL UNSUR", HeadingLevel.HEADING_1),
        createBullet("1. Hatıra Pasaportu (Memory Passport)", "Eşyaya ruh kazandıran, önceki sahibinin hatırasını ve kökenini belgeleyen interaktif mühürlü sertifika."),
        createBullet("2. Standartlaştırılmış Kondisyon Çerçeveleri", "Zümrüt Yeşili (Yeni Gibi), Mavi (Az Kullanılmış), Kehribar (Patinalı) ve Bordo (Vintage) renk kodlarıyla sıfır sürpriz garantisi."),
        createBullet("3. 'Arıyorum' (Tersine Pazar & Koleksiyon Avı)", "Kullanıcının geçmişte kaybettiği veya aradığı özel nesneleri ilana çıkarıp teklif topladığı tersine talep mekanizması."),
        createBullet("4. %100 Lisanslı Havuz Hesap & Saygılı Pazarlık", "Alıcı teslimatı onaylamadan paranın satıcıya geçmediği güvenli ticaret ve oransal pazarlık imkânı."),
        createBullet("5. Dijital Hatıra Kutusu", "Satın alınan ürünlerin anılarıyla beraber kullanıcının profilinde sonsuza kadar yaşatıldığı dijital miras alanı."),

        // 8. SÜRDÜRÜLEBİLİRLİK MODELİ
        createHeader("8. SÜRDÜRÜLEBİLİRLİK VE DÖNGÜSEL EKONOMİ MODELİ", HeadingLevel.HEADING_1),
        createParagraph("EldeVar sürdürülebilirliği bir reklam sloganı olarak değil, ölçülebilir bir e-ticaret altyapısı olarak uygular:"),
        createBullet("1. Somut Eko-Tasarruf Metrikleri (CO₂ ve Su Sayacı)", "Her ürün kartında sıfır almak yerine ikinci el tercih ederek önlenen Karbon Ayak İzi (kg CO₂) ve tasarruf edilen su miktarı (Litre) anlık gösterilir."),
        createBullet("2. Lineer Tüketime ('Al-Kullan-At') Karşı Zamansızlık", "Hızlı modanın doğayı kirleten kalitesiz ürünleri yerine, 30–50 yıl dayanan hakiki deri, masif ahşap ve saf yün eşyalar döngüde tutulur."),
        createBullet("3. Yeşil Gardırop Kupon Teşviki (YESILGARDROP)", "Döngüsel ekonomiye katkıda bulunan alıcılara özel çevre indirim kuponları sağlanır."),
        createBullet("4. Plastiksiz ve Hikâyeli Paketleme", "Geri dönüştürülebilir craft kutular ve satıcının el yazısı hatıra notları standartlaştırılır."),

        // 9. WEB TASARIMINA YANSIYAN KARARLAR
        createHeader("9. WEB TASARIMI VE ARAYÜZE (UI/UX) YANSIYAN STRATEJİK KARARLAR", HeadingLevel.HEADING_1),
        createBullet("Hero Alanı (Ana Manşet)", "'Eski hikâyeler yeni sahibiyle canlanıyor' sloganı ile hikâye + sürdürülebilirlik odaklı ilk izlenim."),
        createBullet("Ürün Kartı Tasarımı", "Fiyatın yanında kondisyon rengi, karbon tasarruf rozeti ve tek tıkla açılan Hatıra Pasaportu ikonu."),
        createBullet("Pazarlık & Teklif Modalı", "Saygılı, kaba mesajlaşmalardan uzak, hızlı yüzdelik teklif butonları."),
        createBullet("Şeffaf Sepet & Güvenli Ödeme", "Gizli maliyet içermeyen sepet, kupon uygulama alanı ve lisanslı ödeme güven damgaları."),

        // SONUÇ
        createHeader("SONUÇ VE STRATEJİK DEĞERLENDİRME", HeadingLevel.HEADING_1),
        createParagraph("EldeVar projesi; modern web tasarımının yalnızca estetik arayüz geliştirmekten ibaret olmadığını kanıtlamaktadır. Güçlü bir Hedef Kitle Analizi, net bir Müşteri Problemi Çözümü, özgün bir Değer Önerisi (UVP) ve Döngüsel Ekonomi Felsefesi ile birleşen tasarım; ziyaretçiyi güvenle satın alma aksiyonuna yönlendiren ticari bir başarı modelidir."),
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("EldeVar_Satis_ve_Pazarlama_Proje_Sunumu_Temiz.docx", buffer);
  console.log("SUCCESS: EldeVar_Satis_ve_Pazarlama_Proje_Sunumu_Temiz.docx generated successfully!");
});
