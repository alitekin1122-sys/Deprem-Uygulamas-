import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Earthquake } from "./earthquake-service";

const NOTIFICATION_PREF_KEY = "@deprem_bildirim/notification_enabled";
const MIN_MAGNITUDE_KEY = "@deprem_bildirim/min_magnitude";
const NOTIFIED_EVENTS_KEY = "@deprem_bildirim/notified_events";

/**
 * Bildirim izinlerini ayarlar ve kanal oluşturur.
 */
export async function setupNotifications(): Promise<boolean> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("deprem-bildirim", {
      name: "Deprem Bildirimleri",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#E63946",
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;
  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === "granted";
}

/**
 * Bildirim tercihlerini getirir.
 */
export async function getNotificationPrefs(): Promise<{
  enabled: boolean;
  minMagnitude: number;
}> {
  try {
    const enabled = await AsyncStorage.getItem(NOTIFICATION_PREF_KEY);
    const minMag = await AsyncStorage.getItem(MIN_MAGNITUDE_KEY);
    return {
      enabled: enabled === "true",
      minMagnitude: minMag ? parseFloat(minMag) : 3.0,
    };
  } catch {
    return { enabled: false, minMagnitude: 3.0 };
  }
}

/**
 * Bildirim tercihlerini kaydeder.
 */
export async function setNotificationPrefs(
  enabled: boolean,
  minMagnitude: number
): Promise<void> {
  await AsyncStorage.setItem(NOTIFICATION_PREF_KEY, String(enabled));
  await AsyncStorage.setItem(MIN_MAGNITUDE_KEY, String(minMagnitude));
}

/**
 * Zaten bildirilmiş event ID'lerini getirir.
 */
async function getNotifiedEvents(): Promise<Set<string>> {
  try {
    const data = await AsyncStorage.getItem(NOTIFIED_EVENTS_KEY);
    if (data) {
      return new Set(JSON.parse(data));
    }
  } catch {
    // Hata - boş set döndür
  }
  return new Set();
}

/**
 * Bildirilmiş event ID'lerini kaydeder.
 */
async function saveNotifiedEvents(events: Set<string>): Promise<void> {
  // Son 100 event ID'yi tut
  const arr = Array.from(events).slice(-100);
  await AsyncStorage.setItem(NOTIFIED_EVENTS_KEY, JSON.stringify(arr));
}

/**
 * Yeni depremler için bildirim gönderir.
 * Sadece kullanıcının tercih ettiği büyüklüğün üzerindeki depremler için.
 */
export async function checkAndNotifyNewEarthquakes(
  earthquakes: Earthquake[]
): Promise<void> {
  const prefs = await getNotificationPrefs();
  if (!prefs.enabled) return;

  const notified = await getNotifiedEvents();
  const newEvents: Earthquake[] = [];

  for (const eq of earthquakes) {
    if (!notified.has(eq.eventID) && eq.magnitude >= prefs.minMagnitude) {
      newEvents.push(eq);
      notified.add(eq.eventID);
    }
  }

  if (newEvents.length > 0) {
    await saveNotifiedEvents(notified);
    for (const eq of newEvents) {
      await sendEarthquakeNotification(eq);
    }
  }
}

/**
 * Tek bir deprem için bildirim gönderir.
 */
async function sendEarthquakeNotification(eq: Earthquake): Promise<void> {
  const title = `Deprem: ${eq.province || eq.location}`;
  const body = `Büyüklük: ${eq.magnitude} ${eq.type} | Derinlik: ${eq.depth} km | ${eq.district || ""} ${eq.neighborhood || ""}`;

  await Notifications.scheduleNotificationAsync({
    content: {
      title,
      body,
      data: {
        eventId: eq.eventID,
        province: eq.province,
      },
      sound: true,
    },
    trigger: null,
  });
}
