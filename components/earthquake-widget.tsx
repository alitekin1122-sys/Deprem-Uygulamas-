import React from "react";
import { View, Text, StyleSheet, Platform } from "react-native";
import { useColors } from "@/hooks/use-colors";

/**
 * Widget önizleme bileşeni.
 * Bu, uygulama içinde widget'ın nasıl görüneceğini gösterir.
 * Gerçek Android widget için react-native-android-widget paketi
 * ve development build gereklidir.
 */
export function EarthquakeWidgetPreview({
  totalCount,
  latestProvince,
  latestMagnitude,
}: {
  totalCount: number;
  latestProvince: string | null;
  latestMagnitude: number;
}) {
  const colors = useColors();

  return (
    <View
      style={[
        styles.widget,
        { backgroundColor: colors.surface, borderColor: colors.border },
      ]}
    >
      <View style={styles.widgetHeader}>
        <Text style={[styles.widgetTitle, { color: colors.primary }]}>
          Deprem Bildirim
        </Text>
        <Text style={[styles.widgetDate, { color: colors.muted }]}>
          {new Date().toLocaleDateString("tr-TR")}
        </Text>
      </View>

      <View style={styles.widgetBody}>
        <View style={styles.widgetStat}>
          <Text style={[styles.widgetStatValue, { color: colors.foreground }]}>
            {totalCount}
          </Text>
          <Text style={[styles.widgetStatLabel, { color: colors.muted }]}>
            Bugünkü Deprem
          </Text>
        </View>

        {latestProvince && (
          <View style={styles.widgetStat}>
            <Text
              style={[styles.widgetStatValue, { color: colors.primary }]}
              numberOfLines={1}
            >
              {latestProvince}
            </Text>
            <Text style={[styles.widgetStatLabel, { color: colors.muted }]}>
              Son Deprem (M{latestMagnitude})
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  widget: {
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    marginHorizontal: 16,
  },
  widgetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  widgetTitle: {
    fontSize: 14,
    fontWeight: "700",
  },
  widgetDate: {
    fontSize: 12,
  },
  widgetBody: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  widgetStat: {
    alignItems: "center",
    flex: 1,
  },
  widgetStatValue: {
    fontSize: 24,
    fontWeight: "700",
  },
  widgetStatLabel: {
    fontSize: 11,
    marginTop: 4,
    textAlign: "center",
  },
});
