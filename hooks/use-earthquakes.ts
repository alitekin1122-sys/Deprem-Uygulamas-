import { useState, useEffect, useCallback, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  Earthquake,
  ProvinceCount,
  fetchTodayEarthquakes,
  groupByProvince,
  getLatestEarthquakeProvince,
} from "@/lib/earthquake-service";

const STORAGE_KEY = "@deprem_bildirim/earthquakes";
const LAST_PROVINCE_KEY = "@deprem_bildirim/last_province";
const POLL_INTERVAL = 60_000; // 60 saniye

export interface EarthquakeData {
  earthquakes: Earthquake[];
  provinceCounts: Map<string, ProvinceCount>;
  latestProvince: string | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  refresh: () => Promise<void>;
}

export function useEarthquakes(): EarthquakeData {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [latestProvince, setLatestProvince] = useState<string | null>(null);
  const lastNotifiedRef = useRef<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setError(null);
      console.log('[useEarthquakes] Loading data...');
      const data = await fetchTodayEarthquakes();
      console.log('[useEarthquakes] Data loaded:', data.length, 'earthquakes');
      setEarthquakes(data);
      setLastUpdated(new Date());

      const latest = getLatestEarthquakeProvince(data);
      setLatestProvince(latest);

      // Yeni deprem bildirimi kontrolü
      if (data.length > 0) {
        const latestEvent = data[0];
        const storedLast = await AsyncStorage.getItem(LAST_PROVINCE_KEY);
        const latestEventId = latestEvent.eventID;

        if (
          latestEventId !== lastNotifiedRef.current &&
          storedLast !== latestEventId
        ) {
          lastNotifiedRef.current = latestEventId;
          await AsyncStorage.setItem(LAST_PROVINCE_KEY, latestEventId);
        }
      }

      // Verileri önbelleğe kaydet
      await AsyncStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({
          date: new Date().toDateString(),
          data,
        })
      );
    } catch (err) {
      const message = err instanceof Error ? err.message : "Bilinmeyen hata";
      setError(message);

      // Hata durumunda önbellekten yükle
      try {
        const cached = await AsyncStorage.getItem(STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          const cachedDate = new Date(parsed.date);
          const today = new Date();
          if (cachedDate.toDateString() === today.toDateString()) {
            setEarthquakes(parsed.data);
            setLatestProvince(getLatestEarthquakeProvince(parsed.data));
          }
        }
      } catch {
        // Önbellek okuma hatası - sessizce geç
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // İlk yüklemede loading state'i false yapma
    setLoading(false);
    loadData();
    const interval = setInterval(loadData, POLL_INTERVAL);
    return () => clearInterval(interval);
  }, [loadData]);

  const provinceCounts = groupByProvince(earthquakes);

  return {
    earthquakes,
    provinceCounts,
    latestProvince,
    loading,
    error,
    lastUpdated,
    refresh: loadData,
  };
}
