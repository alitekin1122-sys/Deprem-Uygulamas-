# Deprem Bildirim - Mobil Uygulama Tasarım Planı

## Genel Bakış

Türkiye'de meydana gelen depremleri gerçek zamanlı takip eden, harita üzerinde illeri gösteren, günlük deprem sayacı olan ve bildirim gönderen bir mobil uygulamadır. Veri kaynağı AFAD Event Web Service API'sidir.

## Ekran Listesi

### 1. Ana Ekran (Harita)
- Türkiye SVG haritası (81 il çokgenleri)
- Her ilin adı harita üzerinde yazılı
- Son depremin olduğu il **kırmızı yanıp sönen** animasyonla vurgulanır
- Her ilin merkezinde **günlük deprem sayısı** (00:00-24:00) gösterilir
- Üst kısımda **bugünün tarihi ve saati** canlı olarak gösterilir
- Harita üzerinde pinç-to-zoom ve pan desteği

### 2. Deprem Listesi Ekranı
- Bugün gerçekleşen depremlerin listesi (saat sırasına göre)
- Her deprem için: saat, il, ilçe, mahalle, büyüklük, derinlik
- Büyüklüğe göre renk kodlaması (küçük: yeşil, orta: sarı, büyük: kırmızı)

### 3. Ayarlar Ekranı
- Bildirim aç/kapa
- Minimum büyüklük filtresi (sadece belirli büyüklüğün üzerinde bildir)
- Widget bilgi bölümü

## Kullanıcı Akışları

### Ana Akış
1. Uygulama açılır → Ana ekranda Türkiye haritası görünür
2. Tarih/saat üst kısımda canlı çalışır
3. İllerin üzerinde günlük deprem sayıları görünür
4. Son depremin olduğu il kırmızı yanıp söner
5. Kullanıcı bir ile dokunur → o ilin gün içindeki depremleri alt listede görünür

### Bildirim Akışı
1. Uygulama arka planda çalışırken yeni deprem algılanır
2. Kullanıcıya yerel bildirim gönderilir (il, büyüklük, saat)
3. Bildirime tıklayınca uygulama açılır ve harita o ile odaklanır

### Günlük Sıfırlama
1. Her gün 00:00:00'da tüm il sayaçları sıfırlanır
2. 00:00'dan 24:00'a kadar depremler sayılır
3. Tarih değişince sayaçlar otomatik sıfırlanır

## Renk Paleti

| Token | Renk | Kullanım |
|-------|------|----------|
| Primary | #E63946 (kırmızı) | Son deprem ili vurgusu, başlıklar |
| Background | #0A1929 (koyu mavi) | Arka plan (koyu tema) |
| Surface | #132F4C | Kartlar, harita arka planı |
| Foreground | #F0F4F8 | Ana metin |
| Muted | #8A9BA8 | İkincil metin |
| Success | #22C55E | Düşük büyüklük |
| Warning | #F59E0B | Orta büyüklük |
| Error | #EF4444 | Yüksek büyüklük |
| Map Province | #2A4A6B | Normal il rengi |
| Map Province Active | #E63946 | Yanıp sönen il |

## Teknik Yaklaşım

- **Harita**: SVG tabanlı Türkiye haritası (react-native-svg ile GeoJSON çokgenleri render edilir)
- **Veri Kaynağı**: AFAD Event Web Service API (`https://deprem.afad.gov.tr/apiv2/event/filter`)
- **Veri Çekme**: Her 60 saniyede bir poll yapılarak güncel depremler alınır
- **Sayaç**: AsyncStorage ile günlük sayılar saklanır, tarih değişince sıfırlanır
- **Bildirim**: expo-notifications ile yerel bildirimler
- **Widget**: react-native-android-widget ile Android widget desteği (development build gerektirir)
- **Tarih/Saat**: Her saniye güncellenen canlı saat
