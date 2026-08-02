import React from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { Earthquake, getMagnitudeCategory } from "@/lib/earthquake-service";

interface EarthquakeListProps {
  earthquakes: Earthquake[];
  filterProvince?: string | null;
}

export function EarthquakeList({
  earthquakes,
  filterProvince,
}: EarthquakeListProps) {
  const colors = useColors();

  const filtered = filterProvince
    ? earthquakes.filter((eq) => eq.province === filterProvince)
    : earthquakes;

  const renderItem = ({ item }: { item: Earthquake }) => {
    const category = getMagnitudeCategory(item.magnitude);
    const magColor =
      category === "high"
        ? colors.error
        : category === "medium"
        ? colors.warning
        : colors.success;

    const time = item.date.split("T")[1]?.substring(0, 5) || "";

    return (
      <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.cardHeader}>
          <View style={[styles.magnitudeBadge, { backgroundColor: magColor }]}>
            <Text style={styles.magnitudeText}>M{item.magnitude}</Text>
          </View>
          <View style={styles.cardInfo}>
            <Text style={[styles.location, { color: colors.foreground }]} numberOfLines={1}>
              {item.location}
            </Text>
            <Text style={[styles.subInfo, { color: colors.muted }]}>
              {item.province} · {item.district} · {item.neighborhood}
            </Text>
          </View>
          <Text style={[styles.time, { color: colors.muted }]}>{time}</Text>
        </View>
        <View style={styles.cardDetails}>
          <Text style={[styles.detail, { color: colors.muted }]}>
            Derinlik: {item.depth} km
          </Text>
          <Text style={[styles.detail, { color: colors.muted }]}>
            Tip: {item.type}
          </Text>
        </View>
      </View>
    );
  };

  if (filtered.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={[styles.emptyText, { color: colors.muted }]}>
          {filterProvince
            ? `${filterProvince} ilinde bugün deprem kaydı yok`
            : "Bugün deprem kaydı yok"}
        </Text>
      </View>
    );
  }

  return (
    <FlatList
      data={filtered}
      keyExtractor={(item) => item.eventID}
      renderItem={renderItem}
      contentContainerStyle={styles.listContent}
      ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
    />
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    padding: 12,
    borderWidth: 0.5,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  magnitudeBadge: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
    minWidth: 48,
    alignItems: "center",
  },
  magnitudeText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "700",
  },
  cardInfo: {
    flex: 1,
  },
  location: {
    fontSize: 14,
    fontWeight: "600",
  },
  subInfo: {
    fontSize: 12,
    marginTop: 2,
  },
  time: {
    fontSize: 13,
    fontWeight: "500",
  },
  cardDetails: {
    flexDirection: "row",
    gap: 16,
    marginTop: 8,
    paddingLeft: 58,
  },
  detail: {
    fontSize: 12,
  },
  emptyContainer: {
    padding: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 14,
    textAlign: "center",
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },
});
