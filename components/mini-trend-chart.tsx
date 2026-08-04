import React from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { ProvinceTrendDay } from "@/lib/province-trend-service";

interface MiniTrendChartProps {
  days: ProvinceTrendDay[];
  province: string;
  trend: "increasing" | "decreasing" | "stable";
}

export function MiniTrendChart({ days, province, trend }: MiniTrendChartProps) {
  const colors = useColors();
  const screenWidth = Dimensions.get("window").width;
  const chartWidth = screenWidth - 32; // padding
  const barWidth = Math.max(2, chartWidth / days.length - 1);
  const chartHeight = 80;

  const maxCount = Math.max(...days.map((d) => d.count), 1);

  const getBarHeight = (count: number) => {
    if (maxCount === 0) return 0;
    return (count / maxCount) * (chartHeight - 20);
  };

  const getTrendColor = () => {
    switch (trend) {
      case "increasing":
        return colors.error; // Kırmızı - artan
      case "decreasing":
        return colors.success; // Yeşil - azalan
      default:
        return colors.warning; // Turuncu - sabit
    }
  };

  const getTrendLabel = () => {
    switch (trend) {
      case "increasing":
        return "📈 Artan Trend";
      case "decreasing":
        return "📉 Azalan Trend";
      default:
        return "➡️ Sabit Trend";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.foreground }]}>
          {province} - Son 30 Gün
        </Text>
        <Text style={[styles.trendLabel, { color: getTrendColor() }]}>
          {getTrendLabel()}
        </Text>
      </View>

      <View style={[styles.chart, { backgroundColor: colors.surface, borderColor: colors.border }]}>
        <View style={styles.barsContainer}>
          {days.map((day, index) => {
            const barHeight = getBarHeight(day.count);
            const isRecent = index >= days.length - 7; // Son 7 gün daha belirgin

            return (
              <View
                key={`bar-${index}`}
                style={[
                  styles.barWrapper,
                  { width: barWidth },
                ]}
              >
                {barHeight > 0 && (
                  <View
                    style={[
                      styles.bar,
                      {
                        height: barHeight,
                        backgroundColor: isRecent ? colors.primary : colors.warning,
                        opacity: isRecent ? 1 : 0.6,
                      },
                    ]}
                  />
                )}
              </View>
            );
          })}
        </View>
      </View>

      {/* Özet İstatistikler */}
      <View style={styles.stats}>
        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Toplam</Text>
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {days.reduce((sum, d) => sum + d.count, 0)}
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Ortalama</Text>
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {(days.reduce((sum, d) => sum + d.count, 0) / days.length).toFixed(1)}
          </Text>
        </View>

        <View style={styles.statItem}>
          <Text style={[styles.statLabel, { color: colors.muted }]}>Maksimum</Text>
          <Text style={[styles.statValue, { color: colors.foreground }]}>
            {Math.max(...days.map((d) => d.count))}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
    gap: 8,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  title: {
    fontSize: 12,
    fontWeight: "600",
  },
  trendLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  chart: {
    borderRadius: 8,
    padding: 8,
    borderWidth: 0.5,
    height: 100,
  },
  barsContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    height: "100%",
    gap: 0.5,
  },
  barWrapper: {
    alignItems: "center",
    justifyContent: "flex-end",
    height: "100%",
  },
  bar: {
    width: "100%",
    borderRadius: 2,
  },
  stats: {
    flexDirection: "row",
    justifyContent: "space-around",
    gap: 8,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  statLabel: {
    fontSize: 10,
  },
  statValue: {
    fontSize: 12,
    fontWeight: "600",
  },
});

