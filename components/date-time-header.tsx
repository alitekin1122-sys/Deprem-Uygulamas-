import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useClock, formatDateTR, formatTime } from "@/hooks/use-clock";
import { useColors } from "@/hooks/use-colors";

export function DateTimeHeader() {
  const now = useClock();
  const colors = useColors();

  return (
    <View style={[styles.container, { backgroundColor: colors.surface, borderColor: colors.border }]}>
      <View style={styles.row}>
        <Text style={[styles.date, { color: colors.foreground }]}>
          {formatDateTR(now)}
        </Text>
        <Text style={[styles.time, { color: colors.primary }]}>
          {formatTime(now)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderWidth: 0.5,
    marginHorizontal: 16,
    marginTop: 8,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: 14,
    fontWeight: "600",
  },
  time: {
    fontSize: 18,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
});
