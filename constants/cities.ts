// Türkiye 81 il merkez koordinatları (lon, lat)
// AFAD API province alanı ile eşleştirme için kullanılır

export interface CityInfo {
  name: string;
  centroid: [number, number]; // [longitude, latitude]
}

export const CITIES: CityInfo[] = [
  { name: "Adana", centroid: [35.5103, 36.9849] },
  { name: "Adıyaman", centroid: [38.4242, 37.8545] },
  { name: "Afyon", centroid: [30.5839, 38.5914] },
  { name: "Ağrı", centroid: [43.4339, 39.5294] },
  { name: "Aksaray", centroid: [33.9386, 38.4456] },
  { name: "Amasya", centroid: [35.7544, 40.6875] },
  { name: "Ankara", centroid: [32.6110, 39.7153] },
  { name: "Antalya", centroid: [30.2422, 36.3832] },
  { name: "Ardahan", centroid: [42.8169, 41.2218] },
  { name: "Artvin", centroid: [41.7766, 41.1662] },
  { name: "Aydın", centroid: [27.5383, 37.6357] },
  { name: "Balıkesir", centroid: [27.3231, 39.8578] },
  { name: "Bartın", centroid: [32.4356, 41.6280] },
  { name: "Batman", centroid: [41.4459, 38.0494] },
  { name: "Bayburt", centroid: [40.2032, 40.2381] },
  { name: "Bilecik", centroid: [30.0260, 40.0913] },
  { name: "Bingöl", centroid: [40.6015, 39.0762] },
  { name: "Bitlis", centroid: [42.4356, 38.5631] },
  { name: "Bolu", centroid: [31.5017, 40.6006] },
  { name: "Burdur", centroid: [30.0478, 37.3513] },
  { name: "Bursa", centroid: [29.0850, 40.2119] },
  { name: "Çanakkale", centroid: [26.5240, 40.1252] },
  { name: "Çankırı", centroid: [33.4475, 40.7277] },
  { name: "Çorum", centroid: [34.6900, 40.6207] },
  { name: "Denizli", centroid: [29.2736, 37.7248] },
  { name: "Diyarbakır", centroid: [40.3379, 38.1107] },
  { name: "Düzce", centroid: [31.2959, 40.8871] },
  { name: "Edirne", centroid: [26.5214, 41.1271] },
  { name: "Elazığ", centroid: [39.5106, 38.7570] },
  { name: "Erzincan", centroid: [39.2719, 39.6088] },
  { name: "Erzurum", centroid: [41.5418, 40.0799] },
  { name: "Eskişehir", centroid: [30.9896, 39.5924] },
  { name: "Gaziantep", centroid: [37.3845, 37.1353] },
  { name: "Giresun", centroid: [38.7126, 40.6859] },
  { name: "Gümüşhane", centroid: [39.5080, 40.3813] },
  { name: "Hakkari", centroid: [44.2847, 37.4111] },
  { name: "Hatay", centroid: [36.2412, 36.4596] },
  { name: "Iğdır", centroid: [43.9610, 39.9308] },
  { name: "Isparta", centroid: [30.8361, 37.9004] },
  { name: "İstanbul", centroid: [28.9934, 41.0181] },
  { name: "İzmir", centroid: [26.7861, 38.4914] },
  { name: "Kahramanmaraş", centroid: [36.9833, 37.8742] },
  { name: "Karabük", centroid: [32.6768, 41.2411] },
  { name: "Karaman", centroid: [33.1823, 37.0587] },
  { name: "Kars", centroid: [43.1842, 40.5426] },
  { name: "Kastamonu", centroid: [33.7027, 41.3994] },
  { name: "Kayseri", centroid: [35.7607, 38.6857] },
  { name: "Kilis", centroid: [37.1098, 36.8008] },
  { name: "Kırıkkale", centroid: [33.6615, 39.7338] },
  { name: "Kırklareli", centroid: [27.5171, 41.7692] },
  { name: "Kırşehir", centroid: [34.2736, 39.2694] },
  { name: "Kocaeli", centroid: [29.8467, 40.9055] },
  { name: "Konya", centroid: [32.8219, 37.9489] },
  { name: "Kütahya", centroid: [29.5226, 39.2956] },
  { name: "Malatya", centroid: [38.2010, 38.4995] },
  { name: "Manisa", centroid: [28.1030, 38.8015] },
  { name: "Mardin", centroid: [41.0356, 37.4226] },
  { name: "Mersin", centroid: [33.7944, 36.4915] },
  { name: "Muğla", centroid: [28.0879, 36.8573] },
  { name: "Muş", centroid: [41.8796, 39.0190] },
  { name: "Nevşehir", centroid: [34.6809, 38.9350] },
  { name: "Niğde", centroid: [34.7244, 37.9474] },
  { name: "Ordu", centroid: [37.4510, 40.8316] },
  { name: "Osmaniye", centroid: [36.2225, 37.2698] },
  { name: "Rize", centroid: [40.9139, 41.0114] },
  { name: "Sakarya", centroid: [30.5244, 40.8052] },
  { name: "Samsun", centroid: [36.2823, 41.2222] },
  { name: "Şanlıurfa", centroid: [38.9296, 37.3807] },
  { name: "Siirt", centroid: [42.1559, 37.9510] },
  { name: "Sinop", centroid: [34.9239, 41.7490] },
  { name: "Şırnak", centroid: [42.5516, 37.4501] },
  { name: "Sivas", centroid: [37.3419, 39.6735] },
  { name: "Tekirdağ", centroid: [27.4632, 41.1229] },
  { name: "Tokat", centroid: [36.6516, 40.4143] },
  { name: "Trabzon", centroid: [39.8785, 40.7910] },
  { name: "Tunceli", centroid: [39.6223, 39.2453] },
  { name: "Uşak", centroid: [29.3929, 38.5172] },
  { name: "Van", centroid: [43.8001, 38.4924] },
  { name: "Yalova", centroid: [29.1101, 40.5732] },
  { name: "Yozgat", centroid: [35.2347, 39.6841] },
  { name: "Zonguldak", centroid: [31.7900, 41.3074] },
];

// AFAD API'den gelen province adını bizim il listemizle eşleştir
export function findCityByName(name: string): CityInfo | undefined {
  if (!name) return undefined;
  const normalized = name.trim().toLowerCase();
  return CITIES.find(
    (c) =>
      c.name.toLowerCase() === normalized ||
      c.name.toLowerCase().replace(/[ıiİ]/g, "i") ===
        normalized.replace(/[ıiİ]/g, "i")
  );
}
