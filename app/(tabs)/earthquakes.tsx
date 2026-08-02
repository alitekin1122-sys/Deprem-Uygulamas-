import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { ScreenContainer } from "@/components/screen-container";
import { EarthquakeList } from "@/components/earthquake-list";
import { DateTimeHeader } from "@/components/date-time-header";
import { useEarthquakes } from "@/hooks/use-earthquakes";
import { useColors } from "@/hooks/use-colors";

export default function EarthquakesScreen() {
  const colors = useColors();
  const { earthquakes, loading, error } = useEarthquakes();

  return (
    <ScreenContainer className="flex-1">
      <DateTimeHeader />
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          Bugünkü Depremler
        </Text>
        <Text style={[styles.subtitle, { color: colors.muted }]}>
          {earthquakes.length} deprem kaydedildi (00:00 - 24:00)
        </Text>
      </View>

      {loading && earthquakes.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      ) : error && earthquakes.length === 0 ? (
        <View style={styles.loadingContainer}>
          <Text style={[styles.errorText, { color: colors.error }]}>
            Bağlantı hatası: {error}
          </Text>
        </View>
      ) : (
        <EarthquakeList earthquakes={earthquakes} />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  errorText: {
    fontSize: 14,
    textAlign: "center",
  },
});
