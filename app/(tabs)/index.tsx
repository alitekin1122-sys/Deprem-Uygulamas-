import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, ActivityIndicator, Pressable } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { SortedGridMap } from "@/components/sorted-grid-map";
import { TurkeyMapSvg } from "@/components/turkey-map-svg";
import { ProvinceDetailPanel } from "@/components/province-detail-panel";
import { DateTimeHeader } from "@/components/date-time-header";
import { useEarthquakes } from "@/hooks/use-earthquakes";
import { useColors } from "@/hooks/use-colors";
import { setupNotifications, checkAndNotifyNewEarthquakes } from "@/lib/notification-service";

export default function HomeScreen() {
  const colors = useColors();
  const { earthquakes, provinceCounts, latestProvince, loading, error, lastUpdated } =
    useEarthquakes();
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);
  const [mapMode, setMapMode] = useState<'grid' | 'map'>('grid');

  useEffect(() => {
    setupNotifications();
  }, []);

  useEffect(() => {
    if (earthquakes.length > 0) {
      checkAndNotifyNewEarthquakes(earthquakes);
    }
  }, [earthquakes]);

  const totalToday = earthquakes.length;

  return (
    <ScreenContainer className="flex-1">
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Tarih/Saat */}
        <DateTimeHeader />

        {/* Başlık ve özet */}
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Türkiye Deprem Haritası
          </Text>
          <Text style={[styles.subtitle, { color: colors.muted }]}>
            Bugün {totalToday} deprem kaydedildi
          </Text>
          {lastUpdated && (
            <Text style={[styles.updatedTime, { color: colors.muted }]}>
              Son güncelleme: {lastUpdated.toLocaleTimeString("tr-TR").substring(0, 5)}
            </Text>
          )}
        </View>

        {/* Harita Modu Toggle */}
        <View style={styles.modeToggle}>
          <Pressable
            onPress={() => setMapMode('grid')}
            style={({ pressed }) => [
              styles.modeButton,
              {
                backgroundColor: mapMode === 'grid' ? colors.primary : colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.modeButtonText,
                { color: mapMode === 'grid' ? '#FFFFFF' : colors.foreground },
              ]}
            >
              Kutucuk
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setMapMode('map')}
            style={({ pressed }) => [
              styles.modeButton,
              {
                backgroundColor: mapMode === 'map' ? colors.primary : colors.surface,
                borderColor: colors.border,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Text
              style={[
                styles.modeButtonText,
                { color: mapMode === 'map' ? '#FFFFFF' : colors.foreground },
              ]}
            >
              Harita
            </Text>
          </Pressable>
        </View>

        {/* Harita */}
        {loading && earthquakes.length === 0 ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.muted }]}>
              Deprem verileri yükleniyor...
            </Text>
          </View>
        ) : mapMode === 'grid' ? (
          <SortedGridMap
            provinceCounts={provinceCounts}
            latestProvince={latestProvince}
            earthquakes={earthquakes}
            onProvincePress={(province) => setSelectedProvince(province)}
          />
        ) : (
          <TurkeyMapSvg
            provinceCounts={provinceCounts}
            latestProvince={latestProvince}
            onProvincePress={(province) => setSelectedProvince(province)}
          />
        )}

        {error && (
          <Text style={[styles.errorText, { color: colors.error }]}>
            Bağlantı hatası: {error}
          </Text>
        )}

        {/* Açıklama */}
        <View style={[styles.legend, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.primary }]} />
            <Text style={[styles.legendText, { color: colors.muted }]}>Son deprem</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.warning }]} />
            <Text style={[styles.legendText, { color: colors.muted }]}>Deprem var</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: colors.border }]} />
            <Text style={[styles.legendText, { color: colors.muted }]}>Sakin</Text>
          </View>
        </View>

        {/* Detay Paneli */}
        {selectedProvince && (
          <ProvinceDetailPanel
            province={selectedProvince}
            earthquakes={earthquakes}
            onClose={() => setSelectedProvince(null)}
          />
        )}
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 100,
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
    alignItems: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  updatedTime: {
    fontSize: 12,
    marginTop: 2,
  },
  modeToggle: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: "center",
  },
  modeButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  modeButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
  },
  errorText: {
    textAlign: "center",
    fontSize: 13,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 16,
    marginHorizontal: 16,
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 0.5,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  legendText: {
    fontSize: 12,
  },
});
