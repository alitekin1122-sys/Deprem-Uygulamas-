import React, { useMemo } from "react";
import { View, Text, ScrollView, StyleSheet, Dimensions, FlatList } from "react-native";
import { useColors } from "@/hooks/use-colors";
import { ProvinceCount } from "@/lib/earthquake-service";

interface SimpleMapProps {
  provinceCounts: Map<string, ProvinceCount>;
  latestProvince: string | null;
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

export function SimpleMap({ provinceCounts, latestProvince }: SimpleMapProps) {
  const colors = useColors();

  const provinceList = useMemo(() => {
    return PROVINCES.map((province) => {
      const count = provinceCounts.get(province);
      const isLatest = latestProvince === province;
      return { province, count, isLatest };
    });
  }, [provinceCounts, latestProvince]);

  const renderProvinceBox = ({ item }: { item: (typeof provinceList)[0] }) => (
    <View
      style={[
        styles.provinceBox,
        {
          backgroundColor: item.isLatest
            ? colors.primary
            : item.count && item.count.count > 0
            ? colors.warning
            : colors.border,
          borderColor: colors.foreground,
        },
      ]}
    >
      <Text
        style={[
          styles.provinceName,
          { color: item.isLatest || (item.count && item.count.count > 0) ? "#FFFFFF" : colors.muted },
        ]}
        numberOfLines={2}
      >
        {item.province}
      </Text>
      {item.count && item.count.count > 0 && (
        <Text
          style={[
            styles.count,
            { color: item.isLatest ? colors.surface : "#FFFFFF" },
          ]}
        >
          {item.count.count}
        </Text>
      )}
    </View>
  );

  return (
    <FlatList
      data={provinceList}
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
