import React, { useMemo, useState } from "react";
import { View, StyleSheet, Dimensions, ScrollView } from "react-native";
import Svg, { G, Polygon, Text as SvgText, Circle } from "react-native-svg";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withRepeat,
  withTiming,
  Easing,
} from "react-native-reanimated";
import geoData from "@/assets/tr-cities-geo.json";
import { useColors } from "@/hooks/use-colors";
import { ProvinceCount } from "@/lib/earthquake-service";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// Türkiye sınırları (yaklaşık)
const MIN_LON = 25.5;
const MAX_LON = 45.0;
const MIN_LAT = 35.5;
const MAX_LAT = 42.5;

const MAP_WIDTH = SCREEN_WIDTH - 32;
const MAP_HEIGHT = MAP_WIDTH * ((MAX_LAT - MIN_LAT) / (MAX_LON - MIN_LON));

function project(lon: number, lat: number): [number, number] {
  const x = ((lon - MIN_LON) / (MAX_LON - MIN_LON)) * MAP_WIDTH;
  const y = MAP_HEIGHT - ((lat - MIN_LAT) / (MAX_LAT - MIN_LAT)) * MAP_HEIGHT;
  return [x, y];
}

interface TurkeyMapProps {
  provinceCounts: Map<string, ProvinceCount>;
  latestProvince: string | null;
  onProvincePress?: (province: string) => void;
}

const AnimatedPolygon = Animated.createAnimatedComponent(Polygon);

function BlinkingPolygon({ points, color }: { points: string; color: string }) {
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.2, { duration: 600, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
  }, []);

  const animatedProps = useAnimatedProps(() => ({
    opacity: opacity.value,
  }));

  return (
    <AnimatedPolygon
      points={points}
      fill={color}
      animatedProps={animatedProps}
      stroke="#FFFFFF"
      strokeWidth={1.5}
    />
  );
}

interface GeoFeature {
  type: string;
  properties: { name: string; centroid: [number, number] };
  geometry: {
    type: string;
    coordinates: number[][][] | number[][][][];
  };
}

export function TurkeyMap({
  provinceCounts,
  latestProvince,
  onProvincePress,
}: TurkeyMapProps) {
  const colors = useColors();
  const [selectedProvince, setSelectedProvince] = useState<string | null>(null);

  const features = useMemo(() => {
    return (geoData as any).features as GeoFeature[];
  }, []);

  const getProvincePoints = (feature: GeoFeature): string => {
    const geom = feature.geometry;
    let allPoints: string[] = [];

    if (geom.type === "MultiPolygon") {
      let largestRing: number[][] | null = null;
      let largestLen = 0;
      const polygons = geom.coordinates as number[][][][];
      for (const polygon of polygons) {
        const ring = polygon[0];
        if (ring.length > largestLen) {
          largestLen = ring.length;
          largestRing = ring;
        }
      }
      if (largestRing) {
        allPoints = largestRing.map((coord: number[]) => {
          const [x, y] = project(coord[0], coord[1]);
          return `${x},${y}`;
        });
      }
    } else if (geom.type === "Polygon") {
      const rings = geom.coordinates as number[][][];
      const ring = rings[0];
      allPoints = ring.map((coord: number[]) => {
        const [x, y] = project(coord[0], coord[1]);
        return `${x},${y}`;
      });
    }

    return allPoints.join(" ");
  };

  const handlePress = (provinceName: string) => {
    setSelectedProvince(provinceName);
    onProvincePress?.(provinceName);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        horizontal={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Svg width={MAP_WIDTH} height={MAP_HEIGHT} style={styles.svg}>
          {/* Arka plan */}
          <Polygon
            points={`0,0 ${MAP_WIDTH},0 ${MAP_WIDTH},${MAP_HEIGHT} 0,${MAP_HEIGHT}`}
            fill={colors.surface}
          />

          {/* İller */}
          {features.map((feature, index) => {
            const provinceName = feature.properties.name;
            const points = getProvincePoints(feature);
            const count = provinceCounts.get(provinceName);
            const isLatest = latestProvince === provinceName;
            const isSelected = selectedProvince === provinceName;

            const fillColor = isLatest
              ? colors.primary
              : count && count.count > 0
              ? colors.warning
              : colors.border;

            const centroid = feature.properties.centroid;
            const [cx, cy] = project(centroid[0], centroid[1]);

            return (
              <G key={`province-${index}`}>
                {isLatest ? (
                  <BlinkingPolygon points={points} color={fillColor} />
                ) : (
                  <Polygon
                    points={points}
                    fill={fillColor}
                    stroke={
                      isSelected ? colors.foreground : colors.background
                    }
                    strokeWidth={isSelected ? 2 : 0.5}
                    onPress={() => handlePress(provinceName)}
                  />
                )}

                {/* İl adı */}
                <SvgText
                  x={cx}
                  y={cy}
                  fontSize={7}
                  fill={colors.foreground}
                  textAnchor="middle"
                  fontWeight="600"
                >
                  {provinceName}
                </SvgText>

                {/* Deprem sayısı */}
                {count && count.count > 0 && (
                  <>
                    <Circle
                      cx={cx}
                      cy={cy + 10}
                      r={7}
                      fill={isLatest ? colors.primary : colors.error}
                    />
                    <SvgText
                      x={cx}
                      y={cy + 13}
                      fontSize={8}
                      fill="#FFFFFF"
                      textAnchor="middle"
                      fontWeight="700"
                    >
                      {count.count}
                    </SvgText>
                  </>
                )}
              </G>
            );
          })}
        </Svg>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: {
    alignItems: "center",
  },
  svg: {
    backgroundColor: "transparent",
  },
});
