import React, { useMemo } from "react";
import { View, Text, FlatList, StyleSheet, Dimensions, Pressable } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { ProvinceCount, Earthquake } from "@/lib/earthquake-service";

interface SortedGridMapProps {
  provinceCounts: Map<string, ProvinceCount>;
  latestProvince: string | null;
  earthquakes: Earthquake[];
  onProvincePress?: (province: string) => void;
}

// Türkiye'nin 81 ili
const PROVINCES = [
  "Adana", "Adıyaman", "Afyonkarahisar", "Ağrı", "Amasya", "Ankara", "Antalya", "Ardahan", "Artvin",
  "Aydın", "Balıkesir", "Bartın", "Batman", "Bayburt", "Bedel", "Bingöl", "Bitlis", "Bolu", "Burdur",
  "Bursa", "Çanakkale", "Çankırı", "Çorum", "Denizli", "Diyarbakır", "Düzce", "Edirne", "Elazığ",
  "Erzincan", "Erzurum", "Eskişehir", "Gaziantep", "Giresun", "Gümüşhane", "Hakkari", "Hatay",
  "Iğdır", "Isparta", "İstanbul", "İzmir", "Kahramanmaraş", "Karabük", "Karaman", "Karbala", "Kars",
  "Kastamonu", "Kayseri", "Kırıkkale", "Kırklareli", "Kırşehir", "Kilis", "Kocaeli", "Konya",
  "Kütahya", "Lâdik", "Latakia", "Malatya", "Manisa", "Mardin", "Mersin", "Merzifon", "Muğla",
  "Muş", "Nevşehir", "Niğde", "Ordu", "Orhaneli", "Osmancık", "Osmania", "Otlukbeli", "Ömerli",
  "Rize", "Sakarya", "Samsun", "Siirt", "Sinop", "Sivas", "Şırnak", "Şişli", "Tekirdağ", "Tokat",
  "Trabzon", "Tunceli", "Türkoğlu", "Uşak", "Van", "Yalova", "Yozgat", "Zonguldak"
];

interface ProvinceItem {
  province: string;
  count: number;
  isLatest: boolean;
  lastEarthquakeTime: Date | null;
}

export function SortedGridMap({
  provinceCounts,
  latestProvince,
  earthquakes,
  onProvincePress,
}: SortedGridMapProps) {
  const colors = useColors();

  const sortedProvinces = useMemo(() => {
    const items: ProvinceItem[] = PROVINCES.map((province) => {
      const count = provinceCounts.get(province);
      const isLatest = latestProvince === province;
      const provinceEarthquakes = earthquakes.filter(eq => eq.province === province);
      const lastEarthquakeTime = provinceEarthquakes.length > 0 
        ? new Date(provinceEarthquakes[0].date)
        : null;

      return {
        province,
        count: count?.count ?? 0,
        isLatest,
        lastEarthquakeTime,
      };
    });

    // Sıralama: 1. Son deprem (isLatest), 2. Deprem sayısı (yüksekten düşüğe), 3. Zaman (yeniden eskiye)
    return items.sort((a, b) => {
      if (a.isLatest) return -1;
      if (b.isLatest) return 1;
      
      if (a.count !== b.count) return b.count - a.count;
      
      if (a.lastEarthquakeTime && b.lastEarthquakeTime) {
        return b.lastEarthquakeTime.getTime() - a.lastEarthquakeTime.getTime();
      }
      
      return 0;
    });
  }, [provinceCounts, latestProvince, earthquakes]);

  const renderProvinceBox = ({ item }: { item: ProvinceItem }) => (
    <Pressable
      onPress={() => onProvincePress?.(item.province)}
      style={({ pressed }) => [
        styles.provinceBox,
        {
          backgroundColor: item.isLatest
            ? colors.primary
            : item.count > 0
            ? colors.warning
            : colors.border,
          borderColor: colors.foreground,
          opacity: pressed ? 0.7 : 1,
        },
      ]}
    >
      <Text
        style={[
          styles.provinceName,
          { color: item.isLatest || item.count > 0 ? "#FFFFFF" : colors.muted },
        ]}
        numberOfLines={2}
      >
        {item.province}
      </Text>
      {item.count > 0 && (
        <Text
          style={[
            styles.count,
            { color: item.isLatest ? colors.surface : "#FFFFFF" },
          ]}
        >
          {item.count}
        </Text>
      )}
    </Pressable>
  );

  return (
    <FlatList
      data={sortedProvinces}
      renderItem={renderProvinceBox}
      keyExtractor={(item, index) => `${item.province}-${index}`}
      numColumns={3}
      columnWrapperStyle={styles.row}
      scrollEnabled={false}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  row: {
    gap: 8,
    justifyContent: "space-between",
  },
  provinceBox: {
    flex: 1,
    aspectRatio: 1,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 4,
    minHeight: 80,
  },
  provinceName: {
    fontSize: 11,
    fontWeight: "600",
    textAlign: "center",
    lineHeight: 14,
  },
  count: {
    fontSize: 13,
    fontWeight: "700",
    marginTop: 4,
  },
});
