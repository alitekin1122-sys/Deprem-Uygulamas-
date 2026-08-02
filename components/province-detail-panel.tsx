import React from "react";
import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { Earthquake } from "@/lib/earthquake-service";

interface ProvinceDetailPanelProps {
  province: string | null;
  earthquakes: Earthquake[];
  onClose: () => void;
}

export function ProvinceDetailPanel({
  province,
  earthquakes,
  onClose,
}: ProvinceDetailPanelProps) {
  const colors = useColors();

  if (!province) return null;

  const provinceEarthquakes = earthquakes.filter(
    (eq) => eq.province === province
  );

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.background, borderTopColor: colors.border },
      ]}
    >
      {/* Başlık */}
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {province} - Bugünkü Depremler
        </Text>
        <Pressable onPress={onClose} style={styles.closeButton}>
          <Text style={[styles.closeText, { color: colors.muted }]}>✕</Text>
        </Pressable>
      </View>

      {/* Deprem Listesi */}
      <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
        {provinceEarthquakes.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={[styles.emptyText, { color: colors.muted }]}>
              Bu ilde bugün deprem kaydedilmedi
            </Text>
          </View>
        ) : (
          provinceEarthquakes.map((eq, index) => (
            <View
              key={`${eq.eventID}-${index}`}
              style={[
                styles.earthquakeItem,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.border,
                },
              ]}
            >
              <View style={styles.earthquakeHeader}>
                <Text
                  style={[
                    styles.magnitude,
                    {
                      color:
                        eq.magnitude >= 4
                          ? colors.error
                          : eq.magnitude >= 3
                          ? colors.warning
                          : colors.success,
                    },
                  ]}
                >
                  {eq.magnitude}
                </Text>
                <View style={styles.locationInfo}>
                  <Text
                    style={[styles.location, { color: colors.foreground }]}
                    numberOfLines={1}
                  >
                    {eq.location}
                  </Text>
                  <Text style={[styles.time, { color: colors.muted }]}>
                    {new Date(eq.date).toLocaleTimeString("tr-TR")}
                  </Text>
                </View>
              </View>
              <View style={styles.earthquakeDetails}>
                <Text style={[styles.detail, { color: colors.muted }]}>
                  Derinlik: {eq.depth} km
                </Text>
                {eq.district && (
                  <Text style={[styles.detail, { color: colors.muted }]}>
                    {eq.district}
                    {eq.neighborhood ? ` - ${eq.neighborhood}` : ""}
                  </Text>
                )}
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    maxHeight: 300,
    borderTopWidth: 1,
    borderRadius: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0.5,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 20,
    fontWeight: "600",
  },
  list: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: "center",
  },
  emptyText: {
    fontSize: 14,
  },
  earthquakeItem: {
    borderRadius: 8,
    borderWidth: 0.5,
    padding: 12,
    marginBottom: 8,
  },
  earthquakeHeader: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 8,
  },
  magnitude: {
    fontSize: 18,
    fontWeight: "700",
    marginRight: 12,
    minWidth: 40,
  },
  locationInfo: {
    flex: 1,
  },
  location: {
    fontSize: 13,
    fontWeight: "600",
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
  },
  earthquakeDetails: {
    marginLeft: 52,
  },
  detail: {
    fontSize: 12,
    marginBottom: 2,
  },
});
