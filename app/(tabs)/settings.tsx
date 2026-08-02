import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Switch,
  Platform,
  Alert,
} from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { DateTimeHeader } from "@/components/date-time-header";
import { useColors } from "@/hooks/use-colors";
import {
  getNotificationPrefs,
  setNotificationPrefs,
  setupNotifications,
} from "@/lib/notification-service";
import { EarthquakeWidgetPreview } from "@/components/earthquake-widget";
import { useEarthquakes } from "@/hooks/use-earthquakes";

export default function SettingsScreen() {
  const colors = useColors();
  const [notifEnabled, setNotifEnabled] = useState(false);
  const [minMagnitude, setMinMagnitude] = useState(3.0);
  const [loaded, setLoaded] = useState(false);
  const { earthquakes, latestProvince, provinceCounts } = useEarthquakes();

  useEffect(() => {
    loadPrefs();
  }, []);

  const loadPrefs = async () => {
    const prefs = await getNotificationPrefs();
    setNotifEnabled(prefs.enabled);
    setMinMagnitude(prefs.minMagnitude);
    setLoaded(true);
  };

  const toggleNotifications = async (value: boolean) => {
    if (value) {
      const granted = await setupNotifications();
      if (!granted) {
        Alert.alert(
          "İzin Gerekli",
          "Bildirim almak için bildirim iznini vermeniz gerekir.",
          [{ text: "Tamam" }]
        );
        return;
      }
    }
    setNotifEnabled(value);
    await setNotificationPrefs(value, minMagnitude);
  };

  const changeMinMagnitude = async (mag: number) => {
    setMinMagnitude(mag);
    await setNotificationPrefs(notifEnabled, mag);
  };

  const magnitudeOptions = [2.0, 3.0, 4.0, 5.0];

  return (
    <ScreenContainer className="flex-1">
      <DateTimeHeader />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Ayarlar
        </Text>
      </View>

      {/* Bildirim Ayarları */}
      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Bildirimler
        </Text>

        <View style={styles.row}>
          <View style={styles.rowInfo}>
            <Text style={[styles.rowTitle, { color: colors.foreground }]}>
              Deprem Bildirimleri
            </Text>
            <Text style={[styles.rowDesc, { color: colors.muted }]}>
              Yeni depremlerde bildirim al
            </Text>
          </View>
          <Switch
            value={notifEnabled}
            onValueChange={toggleNotifications}
            trackColor={{ false: colors.border, true: colors.primary }}
            thumbColor="#FFFFFF"
            disabled={!loaded}
          />
        </View>

        {notifEnabled && (
          <View style={styles.magnitudeSection}>
            <Text style={[styles.rowTitle, { color: colors.foreground }]}>
              Minimum Büyüklük
            </Text>
            <Text style={[styles.rowDesc, { color: colors.muted }]}>
              Sadece bu büyüklüğün üzerindeki depremler için bildirim gönder
            </Text>
            <View style={styles.magnitudeButtons}>
              {magnitudeOptions.map((mag) => (
                <View
                  key={mag}
                  style={[
                    styles.magButton,
                    {
                      backgroundColor:
                        minMagnitude === mag ? colors.primary : colors.background,
                      borderColor:
                        minMagnitude === mag ? colors.primary : colors.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.magButtonText,
                      {
                        color:
                          minMagnitude === mag ? "#FFFFFF" : colors.foreground,
                      },
                    ]}
                    onPress={() => changeMinMagnitude(mag)}
                  >
                    M≥{mag.toFixed(1)}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        )}
      </View>

      {/* Widget Bilgisi */}
      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Widget
        </Text>

        <EarthquakeWidgetPreview
          totalCount={earthquakes.length}
          latestProvince={latestProvince}
          latestMagnitude={
            latestProvince
              ? provinceCounts.get(latestProvince)?.latestMagnitude ?? 0
              : 0
          }
        />

        <Text style={[styles.widgetInfo, { color: colors.muted }]}>
          Deprem Bildirim widget'ı ana ekranınıza ekleyebilirsiniz. Widget, bugünkü toplam deprem sayısını ve son depremin olduğu ili gösterir.
        </Text>
        {Platform.OS === "android" ? (
          <Text style={[styles.widgetHint, { color: colors.muted }]}>
            Ana ekran {">"} Widget ekle {">"} Deprem Bildirim
          </Text>
        ) : (
          <Text style={[styles.widgetHint, { color: colors.muted }]}>
            Ana ekran {">"} Düzenle {">"} Widget ekle {">"} Deprem Bildirim
          </Text>
        )}
      </View>

      {/* Hakkında */}
      <View style={[styles.section, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
          Hakkında
        </Text>
        <Text style={[styles.aboutText, { color: colors.muted }]}>
          Deprem verileri AFAD (Afet ve Acil Durum Yönetimi Başkanlığı) Event Web Service API'sinden alınmaktadır. Veriler her 60 saniyede bir güncellenir.
        </Text>
        <Text style={[styles.aboutText, { color: colors.muted }]}>
          Sayaçlar her gün 00:00'da sıfırlanır ve 24:00'a kadar sayar.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
  },
  section: {
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 12,
    padding: 16,
    borderWidth: 0.5,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  rowInfo: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "500",
  },
  rowDesc: {
    fontSize: 13,
    marginTop: 2,
  },
  magnitudeSection: {
    marginTop: 16,
    paddingTop: 16,
    borderTopWidth: 0.5,
    borderTopColor: "rgba(150,150,150,0.2)",
  },
  magnitudeButtons: {
    flexDirection: "row",
    gap: 8,
    marginTop: 12,
  },
  magButton: {
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
  },
  magButtonText: {
    fontSize: 13,
    fontWeight: "600",
  },
  widgetInfo: {
    fontSize: 13,
    lineHeight: 20,
  },
  widgetHint: {
    fontSize: 13,
    marginTop: 8,
    fontWeight: "500",
  },
  aboutText: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 8,
  },
});
