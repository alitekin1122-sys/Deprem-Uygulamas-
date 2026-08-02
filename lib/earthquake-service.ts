import { findCityByName } from "@/constants/cities";
import { Platform } from "react-native";
import { getApiBaseUrl } from "@/constants/oauth";

// AFAD API'den gelen deprem verisi
export interface Earthquake {
  eventID: string;
  location: string;
  latitude: number;
  longitude: number;
  depth: number;
  type: string;
  magnitude: number;
  country: string;
  province: string;
  district: string;
  neighborhood: string;
  date: string; // ISO format: "2026-07-26T00:54:20"
  isEventUpdate: boolean;
  lastUpdateDate: string | null;
}

// İl bazlı günlük deprem sayısı
export interface ProvinceCount {
  province: string;
  count: number;
  latestMagnitude: number;
  latestTime: string;
}

const AFAD_API_BASE = "https://deprem.afad.gov.tr/apiv2/event/filter";

/**
 * Belirli bir tarih aralığındaki depremleri AFAD API'sinden çeker.
 */
export async function fetchEarthquakes(
  startDate: string,
  endDate: string
): Promise<Earthquake[]> {
  const start = startDate.replace(" ", "T");
  const end = endDate.replace(" ", "T");
  const url = `${AFAD_API_BASE}?start=${encodeURIComponent(
    start
  )}&end=${encodeURIComponent(end)}&format=json&orderby=timedesc`;

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`AFAD API hatası: ${response.status}`);
  }
  const data = await response.json();
  return normalizeEarthquakes(data);
}

/**
 * Bugünün 00:00:00 ile 23:59:59 arasındaki depremleri çeker.
 * Web'de server proxy, mobilde direkt AFAD API kullanır.
 */
export async function fetchTodayEarthquakes(): Promise<Earthquake[]> {
  // Web ortamında CORS sorununu aşmak için server proxy kullan
  if (Platform.OS === "web") {
    try {
      const baseUrl = getApiBaseUrl();
      const proxyUrl = `${baseUrl}/api/trpc/earthquake.today`;
      console.log('[fetchTodayEarthquakes] Fetching from:', proxyUrl);
      const response = await fetch(proxyUrl);
      console.log('[fetchTodayEarthquakes] Response status:', response.status);
      if (response.ok) {
        const result = await response.json();
        // tRPC response format: { result: { data: { json: [...] } } }
        const data = result?.result?.data?.json ?? result?.result?.data ?? result;
        if (Array.isArray(data)) {
          return normalizeEarthquakes(data);
        }
      }
    } catch {
      // Proxy başarısız olursa direkt API'ye düş
    }
  }

  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0
  );
  const end = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    23,
    59,
    59
  );

  const startStr = formatDateTime(start);
  const endStr = formatDateTime(end);

  return fetchEarthquakes(startStr, endStr);
}

/**
 * AFAD API'sinden gelen string değerleri number'a çevirir.
 * API bazen magnitude, depth, latitude, longitude değerlerini string olarak döndürür.
 */
function normalizeEarthquakes(raw: any[]): Earthquake[] {
  return raw.map((item: any) => ({
    eventID: String(item.eventID),
    location: String(item.location || ""),
    latitude: Number(item.latitude) || 0,
    longitude: Number(item.longitude) || 0,
    depth: Number(item.depth) || 0,
    type: String(item.type || ""),
    magnitude: Number(item.magnitude) || 0,
    country: String(item.country || ""),
    province: String(item.province || ""),
    district: String(item.district || ""),
    neighborhood: String(item.neighborhood || ""),
    date: String(item.date || ""),
    isEventUpdate: Boolean(item.isEventUpdate),
    lastUpdateDate: item.lastUpdateDate ? String(item.lastUpdateDate) : null,
  }));
}

function formatDateTime(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  const h = String(date.getHours()).padStart(2, "0");
  const min = String(date.getMinutes()).padStart(2, "0");
  const s = String(date.getSeconds()).padStart(2, "0");
  return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

/**
 * Deprem listesini il bazında gruplar ve sayar.
 */
export function groupByProvince(
  earthquakes: Earthquake[]
): Map<string, ProvinceCount> {
  const map = new Map<string, ProvinceCount>();
  for (const eq of earthquakes) {
    const province = eq.province || "Bilinmiyor";
    const existing = map.get(province);
    if (existing) {
      existing.count += 1;
      if (eq.date > existing.latestTime) {
        existing.latestMagnitude = eq.magnitude;
        existing.latestTime = eq.date;
      }
    } else {
      map.set(province, {
        province,
        count: 1,
        latestMagnitude: eq.magnitude,
        latestTime: eq.date,
      });
    }
  }
  return map;
}

/**
 * En son gerçekleşen depremin ilini döndürür.
 */
export function getLatestEarthquakeProvince(
  earthquakes: Earthquake[]
): string | null {
  if (earthquakes.length === 0) return null;
  const sorted = [...earthquakes].sort((a, b) =>
    b.date.localeCompare(a.date)
  );
  return sorted[0].province || null;
}

/**
 * Depremin büyüklüğüne göre renk kategorisi döndürür.
 */
export function getMagnitudeCategory(
  magnitude: number
): "low" | "medium" | "high" {
  if (magnitude < 3.0) return "low";
  if (magnitude < 5.0) return "medium";
  return "high";
}

/**
 * İl adının GeoJSON'daki adla eşleşip eşleşmediğini kontrol eder.
 */
export function normalizeProvinceName(province: string): string | null {
  const city = findCityByName(province);
  return city ? city.name : null;
}
